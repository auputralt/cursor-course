import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { handleCors, addCorsHeaders } from '@/lib/cors';
import { validateInput, chatMessageSchema } from '@/lib/validation';
import { supabase } from '@/lib/supabase';
import { checkRateLimit, chatRateLimiter } from '@/lib/rateLimiter';

// Initialize OpenAI client with proper error handling
let openai: OpenAI | null = null;

try {
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
} catch (error) {
  console.error('Failed to initialize OpenAI client:', error);
}

export async function OPTIONS(request: NextRequest) {
  return handleCors(request) || new Response(null, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    // Check if OpenAI client is initialized
    if (!openai) {
      const response = NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
      return addCorsHeaders(response, request);
    }

    // Get user ID from headers (set by middleware)
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      const response = NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
      return addCorsHeaders(response, request);
    }

    // Check rate limit
    const rateLimitResult = checkRateLimit(chatRateLimiter, userId);
    if (!rateLimitResult.allowed && rateLimitResult.response) {
      return addCorsHeaders(rateLimitResult.response, request);
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = validateInput(chatMessageSchema, body);
    
    if (!validation.success) {
      const response = NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validation.errors 
        },
        { status: 400 }
      );
      return addCorsHeaders(response, request);
    }

    const { message } = validation.data!;

    // Create or get chat session for user
    const { data: session, error: sessionError } = await supabase
      .from('chat_sessions')
      .insert({ 
        title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
        user_id: userId 
      })
      .select()
      .single();

    if (sessionError) {
      console.error('Error creating chat session:', sessionError);
      const response = NextResponse.json(
        { error: 'Failed to create chat session' },
        { status: 500 }
      );
      return addCorsHeaders(response, request);
    }

    // Save user message to database
    const { error: messageError } = await supabase
      .from('chat_messages')
      .insert({
        chat_id: session.id,
        role: 'user',
        content: message,
        type: 'text',
        user_id: userId
      });

    if (messageError) {
      console.error('Error saving user message:', messageError);
    }

    // Create streaming completion
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant. Provide clear, concise, and helpful responses.'
        },
        {
          role: 'user',
          content: message
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
      stream: true, // Enable streaming
    });

    // Create a proper streaming response
    const encoder = new TextEncoder();
    let assistantResponse = '';
    
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              assistantResponse += content;
              // Send each token as it arrives
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
            }
          }
          
          // Save assistant response to database
          if (assistantResponse) {
            await supabase
              .from('chat_messages')
              .insert({
                chat_id: session.id,
                role: 'assistant',
                content: assistantResponse,
                type: 'text',
                user_id: userId
              });
          }
          
          // Signal completion
          controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      },
    });

    const streamResponse = new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

    // For streaming responses, we need to manually add CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-User-Id, X-User-Email',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400',
    };

    Object.entries(corsHeaders).forEach(([key, value]) => {
      streamResponse.headers.set(key, value);
    });

    return streamResponse;

  } catch (error) {
    console.error('OpenAI API error:', error);
    
    let errorResponse: NextResponse;
    
    if (error instanceof Error) {
      if (error.message.includes('rate limit')) {
        errorResponse = NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      } else if (error.message.includes('insufficient_quota')) {
        errorResponse = NextResponse.json(
          { error: 'API quota exceeded. Please check your OpenAI account.' },
          { status: 402 }
        );
      } else {
        errorResponse = NextResponse.json(
          { error: 'Failed to process request' },
          { status: 500 }
        );
      }
    } else {
      errorResponse = NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }

    return addCorsHeaders(errorResponse, request);
  }
}
