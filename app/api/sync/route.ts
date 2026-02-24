import { NextRequest, NextResponse } from 'next/server';
import CalendarSyncService from '@/services/calendarSyncService';

// Store sync service instance globally for demo purposes
// In production, use proper session management
let syncService: CalendarSyncService | null = null;

export async function GET(request: NextRequest) {
  try {
    if (!syncService) {
      syncService = new CalendarSyncService();
    }

    // Get credentials from cookie
    const credentialsCookie = request.cookies.get('google_credentials');
    if (!credentialsCookie) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const credentials = JSON.parse(credentialsCookie.value);
    syncService.initializeWithCredentials(credentials);

    const events = await syncService.syncEvents();

    return NextResponse.json({
      success: true,
      eventCount: events.length,
      events,
      lastSyncedAt: syncService.getLastSyncTime(),
    });
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync calendar' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    
    if (body.action === 'sync') {
      const events = await syncService.syncEvents();
      return NextResponse.json({
        success: true,
        eventCount: events.length,
        lastSyncedAt: syncService.getLastSyncTime(),
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Sync POST error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
