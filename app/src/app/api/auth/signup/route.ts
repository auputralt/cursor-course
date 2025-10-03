import { NextRequest, NextResponse } from 'next/server';
import { handleCors, addCorsHeaders } from '@/lib/cors';
import { validateInput, userRegistrationSchema } from '@/lib/validation';
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
    const validation = validateInput(userRegistrationSchema, body);
    
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

    const { email, password, first_name, last_name } = validation.data!;

    // Attempt to sign up user
    const result = await auth.signUp(email, password, {
      first_name,
      last_name
    });

    const response = NextResponse.json({
      message: 'User created successfully. Please check your email to verify your account.',
      user: result.user,
      session: result.session
    }, { status: 201 });

    return addCorsHeaders(response, request);

  } catch (error) {
    console.error('Signup error:', error);
    
    let response: NextResponse;
    
    if (error instanceof Error) {
      if (error.message.includes('already registered')) {
        response = NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        );
      } else if (error.message.includes('invalid email')) {
        response = NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400 }
        );
      } else if (error.message.includes('password')) {
        response = NextResponse.json(
          { error: 'Password does not meet requirements' },
          { status: 400 }
        );
      } else {
        response = NextResponse.json(
          { error: 'Failed to create user account' },
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
