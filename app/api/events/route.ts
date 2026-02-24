import { NextRequest, NextResponse } from 'next/server';
import CalendarSyncService from '@/services/calendarSyncService';

let syncService: CalendarSyncService | null = null;

export async function GET(request: NextRequest) {
  try {
    if (!syncService) {
      syncService = new CalendarSyncService();
    }

    const credentialsCookie = request.cookies.get('google_credentials');
    if (!credentialsCookie) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const credentials = JSON.parse(credentialsCookie.value);
    syncService.initializeWithCredentials(credentials);

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'all';
    const date = searchParams.get('date');

    let events;

    switch (type) {
      case 'upcoming':
        events = syncService.getUpcomingEvents(10);
        break;
      case 'day':
        if (!date) {
          return NextResponse.json(
            { error: 'Date parameter required for day view' },
            { status: 400 }
          );
        }
        events = syncService.getEventsByDay(new Date(date));
        break;
      case 'all':
      default:
        events = syncService.getSyncedEvents();
    }

    return NextResponse.json({
      success: true,
      events,
      eventCount: events.length,
    });
  } catch (error) {
    console.error('Events error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
