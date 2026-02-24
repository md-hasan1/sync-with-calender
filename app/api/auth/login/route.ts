import { NextRequest, NextResponse } from 'next/server';
import GoogleCalendarService from '@/services/googleCalendarService';

export async function GET(request: NextRequest) {
  try {
    const googleCalendarService = new GoogleCalendarService();
    const authUrl = googleCalendarService.getAuthUrl();

    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Auth initiate error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate authentication' },
      { status: 500 }
    );
  }
}
