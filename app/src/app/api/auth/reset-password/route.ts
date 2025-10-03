import { NextRequest, NextResponse } from 'next/server';
import { handleCors, addCorsHeaders } from '@/lib/cors';
import { validateInput, passwordResetSchema } from '@/lib/validation';
import { auth } from '@/lib/auth';

export async function OPTIONS(request: NextRequest) {
  return handleCors(request) || new Response(null, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validation = validateInput(passwordResetSchema, body);
    
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

    const { email } = validation.data!;

    // Send password reset email
    await auth.resetPassword(email);

    const response = NextResponse.json({
      message: 'Password reset email sent. Please check your inbox.'
    });

    return addCorsHeaders(response, request);

  } catch (error) {
    console.error('Password reset error:', error);
    
    let response: NextResponse;
    
    if (error instanceof Error) {
      if (error.message.includes('rate limit')) {
        response = NextResponse.json(
          { error: 'Too many password reset attempts. Please try again later.' },
          { status: 429 }
        );
      } else {
        response = NextResponse.json(
          { error: 'Failed to send password reset email' },
          { status: 500 }
        );
      }
    } else {
      response = NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }

    return addCorsHeaders(response, request);
  }
}
