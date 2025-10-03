import { NextRequest, NextResponse } from 'next/server';
import { handleCors, addCorsHeaders } from '@/lib/cors';
import { auth } from '@/lib/auth';

export async function OPTIONS(request: NextRequest) {
  return handleCors(request) || new Response(null, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    // Sign out user
    await auth.signOut();

    const response = NextResponse.json({
      message: 'Logout successful'
    });

    return addCorsHeaders(response, request);

  } catch (error) {
    console.error('Signout error:', error);
    
    const response = NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );

    return addCorsHeaders(response, request);
  }
}
