import { NextRequest, NextResponse } from 'next/server';
import GoogleCalendarService from '@/services/googleCalendarService';

export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get('code');
    const state = request.nextUrl.searchParams.get('state');

    if (!code) {
      return NextResponse.json(
        { error: 'No authorization code provided' },
        { status: 400 }
      );
    }

    const googleCalendarService = new GoogleCalendarService();
    const credentials = await googleCalendarService.getTokens(code);

    // Store credentials in session/database (this is a basic example)
    // In production, use a secure session management solution
    const response = NextResponse.redirect(new URL('/dashboard', request.url));
    
    // Set credentials in a secure cookie or header
    response.cookies.set('google_credentials', JSON.stringify(credentials), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error) {
    console.error('Auth callback error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
