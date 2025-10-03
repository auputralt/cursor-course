import { NextRequest, NextResponse } from 'next/server';
import { handleCors, addCorsHeaders } from '@/lib/cors';
import { validateInput, userLoginSchema } from '@/lib/validation';
import { auth } from '@/lib/auth';
import { checkRateLimit, authRateLimiter } from '@/lib/rateLimiter';

export async function OPTIONS(request: NextRequest) {
  return handleCors(request) || new Response(null, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    
    // Check rate limit
    const rateLimitResult = checkRateLimit(authRateLimiter, clientIP);
    if (!rateLimitResult.allowed) {
      return addCorsHeaders(rateLimitResult.response!, request);
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = validateInput(userLoginSchema, body);
    
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

    const { email, password } = validation.data!;

    // Attempt to sign in user
    const result = await auth.signIn(email, password);

    const response = NextResponse.json({
      message: 'Login successful',
      user: result.user,
      session: result.session
    });

    return addCorsHeaders(response, request);

  } catch (error) {
    console.error('Signin error:', error);
    
    let response: NextResponse;
    
    if (error instanceof Error) {
      if (error.message.includes('Invalid login credentials')) {
        response = NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      } else if (error.message.includes('Email not confirmed')) {
        response = NextResponse.json(
          { error: 'Please verify your email before signing in' },
          { status: 401 }
        );
      } else if (error.message.includes('Too many requests')) {
        response = NextResponse.json(
          { error: 'Too many login attempts. Please try again later.' },
          { status: 429 }
        );
      } else {
        response = NextResponse.json(
          { error: 'Login failed' },
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
