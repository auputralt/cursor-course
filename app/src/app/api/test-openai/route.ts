import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check if OpenAI API key is configured
    const hasApiKey = !!process.env.OPENAI_API_KEY;
    const apiKeyLength = process.env.OPENAI_API_KEY?.length || 0;
    
    return NextResponse.json({
      hasApiKey,
      apiKeyLength,
      message: hasApiKey 
        ? `OpenAI API key is configured (${apiKeyLength} characters)`
        : 'OpenAI API key is not configured',
      environment: process.env.NODE_ENV,
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    return NextResponse.json(
      { 
        error: 'Test endpoint failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
