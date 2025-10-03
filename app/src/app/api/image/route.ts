import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { handleCors, addCorsHeaders } from '@/lib/cors';
import { validateInput, imageGenerationSchema } from '@/lib/validation';
import { checkRateLimit, imageRateLimiter } from '@/lib/rateLimiter';

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
    const rateLimitResult = checkRateLimit(imageRateLimiter, userId);
    if (!rateLimitResult.allowed && rateLimitResult.response) {
      return addCorsHeaders(rateLimitResult.response, request);
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = validateInput(imageGenerationSchema, body);
    
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

    const { prompt } = validation.data!;

    console.log('Generating image with prompt:', prompt);

    // Enhance prompt for more realistic images
    const enhancedPrompt = `Create a highly realistic, photorealistic image: ${prompt}. 
    Use professional photography style with excellent lighting, sharp details, and natural colors. 
    Make it look like a high-quality photograph, not a drawing or illustration.
    Focus on the specific details mentioned in the prompt and ensure all elements are clearly visible and well-composed.`;

    console.log('Enhanced prompt for realistic image:', enhancedPrompt);

    // Generate image using DALL-E 3 with enhanced settings
    const imageResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt: enhancedPrompt,
      n: 1,
      size: '1024x1024',
      quality: 'hd', // Use HD quality for better realism
      style: 'natural', // Natural style for realistic images
    });

    const imageUrl = imageResponse.data?.[0]?.url;

    if (!imageUrl) {
      const errorResponse = NextResponse.json(
        { error: 'Failed to generate image' },
        { status: 500 }
      );
      return addCorsHeaders(errorResponse, request);
    }

    console.log('Image generated successfully:', imageUrl);

    const successResponse = NextResponse.json({
      imageUrl,
      prompt, // Return original prompt for display
      enhancedPrompt, // Return enhanced prompt for debugging
    });

    return addCorsHeaders(successResponse, request);

  } catch (error) {
    console.error('OpenAI Image API error:', error);
    
    let errorResponse: NextResponse;
    
    if (error instanceof Error) {
      if (error.message.includes('rate limit')) {
        errorResponse = NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      } else if (error.message.includes('content_policy_violation')) {
        errorResponse = NextResponse.json(
          { error: 'Content policy violation. Please modify your prompt.' },
          { status: 400 }
        );
      } else if (error.message.includes('insufficient_quota')) {
        errorResponse = NextResponse.json(
          { error: 'API quota exceeded. Please check your OpenAI account.' },
          { status: 402 }
        );
      } else {
        errorResponse = NextResponse.json(
          { error: 'Failed to generate image' },
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
