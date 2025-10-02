import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

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

export async function POST(request: NextRequest) {
  try {
    // Check if OpenAI client is initialized
    if (!openai) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required for image generation' },
        { status: 400 }
      );
    }

    console.log('Generating image with prompt:', prompt);

    // Enhance prompt for more realistic images
    const enhancedPrompt = `Create a highly realistic, photorealistic image: ${prompt}. 
    Use professional photography style with excellent lighting, sharp details, and natural colors. 
    Make it look like a high-quality photograph, not a drawing or illustration.
    Focus on the specific details mentioned in the prompt and ensure all elements are clearly visible and well-composed.`;

    console.log('Enhanced prompt for realistic image:', enhancedPrompt);

    // Generate image using DALL-E 3 with enhanced settings
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: enhancedPrompt,
      n: 1,
      size: '1024x1024',
      quality: 'hd', // Use HD quality for better realism
      style: 'natural', // Natural style for realistic images
    });

    const imageUrl = response.data[0]?.url;

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Failed to generate image' },
        { status: 500 }
      );
    }

    console.log('Image generated successfully:', imageUrl);

    return NextResponse.json({
      imageUrl,
      prompt, // Return original prompt for display
      enhancedPrompt, // Return enhanced prompt for debugging
    });

  } catch (error) {
    console.error('OpenAI Image API error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
      
      if (error.message.includes('content_policy_violation')) {
        return NextResponse.json(
          { error: 'Content policy violation. Please modify your prompt.' },
          { status: 400 }
        );
      }

      if (error.message.includes('insufficient_quota')) {
        return NextResponse.json(
          { error: 'API quota exceeded. Please check your OpenAI account.' },
          { status: 402 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}
