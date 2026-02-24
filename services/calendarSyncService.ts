import GoogleCalendarService from './googleCalendarService';
import { calendar_v3 } from 'googleapis';
import { Credentials } from 'google-auth-library';

export interface SyncedEvent {
  id: string;
  googleId: string;
  title: string;
  description?: string | null;
  startTime: Date;
  endTime: Date;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
  lastSyncedAt: Date;
}

export class CalendarSyncService {
  private calendarService: GoogleCalendarService;
  private syncedEvents: Map<string, SyncedEvent> = new Map();
  private lastSyncTime: Date | null = null;

  constructor() {
    this.calendarService = new GoogleCalendarService();
  }

  /**
   * Initialize sync service with credentials
   */
  initializeWithCredentials(credentials: Credentials) {
    this.calendarService.setCredentials(credentials);
  }

  /**
   * Sync events from Google Calendar
   */
  async syncEvents(): Promise<SyncedEvent[]> {
    try {
      const now = new Date();
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const twoMonthsLater = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);

      const events = await this.calendarService.getEvents(
        oneMonthAgo.toISOString(),
        twoMonthsLater.toISOString(),
        100
      );

      const syncedEvents = this.transformEvents(events);
      
      // Update the synced events map
      syncedEvents.forEach((event) => {
        this.syncedEvents.set(event.googleId, event);
      });

      this.lastSyncTime = now;

      return syncedEvents;
    } catch (error) {
      console.error('Error syncing events:', error);
      throw error;
    }
  }

  /**
   * Transform Google Calendar events to our format
   */
  private transformEvents(
    googleEvents: calendar_v3.Schema$Event[]
  ): SyncedEvent[] {
    return googleEvents.map((event) => {
      const syncedEvent: SyncedEvent = {
        id: `event-${event.id}`,
        googleId: event.id || '',
        title: event.summary || 'Untitled Event',
        description: event.description || undefined,
        startTime: new Date(event.start?.dateTime || event.start?.date || ''),
        endTime: new Date(event.end?.dateTime || event.end?.date || ''),
        location: event.location || undefined,
        createdAt: new Date(event.created || ''),
        updatedAt: new Date(event.updated || ''),
        lastSyncedAt: new Date(),
      };
      return syncedEvent;
    });
  }

  /**
   * Get all synced events
   */
  getSyncedEvents(): SyncedEvent[] {
    return Array.from(this.syncedEvents.values()).sort(
      (a, b) => a.startTime.getTime() - b.startTime.getTime()
    );
  }

  /**
   * Get events in a date range
   */
  getEventsByDateRange(startDate: Date, endDate: Date): SyncedEvent[] {
    return this.getSyncedEvents().filter(
      (event) =>
        event.startTime >= startDate && event.endTime <= endDate
    );
  }

  /**
   * Get upcoming events
   */
  getUpcomingEvents(limit: number = 10): SyncedEvent[] {
    const now = new Date();
    return this.getSyncedEvents()
      .filter((event) => event.startTime >= now)
      .slice(0, limit);
  }

  /**
   * Get events for a specific day
   */
  getEventsByDay(date: Date): SyncedEvent[] {
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    return this.getEventsByDateRange(startOfDay, endOfDay);
  }

  /**
   * Get last sync time
   */
  getLastSyncTime(): Date | null {
    return this.lastSyncTime;
  }

  /**
   * Clear synced events
   */
  clearSyncedEvents() {
    this.syncedEvents.clear();
    this.lastSyncTime = null;
  }

  /**
   * Add a new event to Google Calendar
   */
  async addEvent(event: {
    title: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    location?: string;
  }) {
    try {
      const googleEvent = {
        summary: event.title,
        description: event.description,
        location: event.location,
        start: {
          dateTime: event.startTime.toISOString(),
        },
        end: {
          dateTime: event.endTime.toISOString(),
        },
      };

      const createdEvent = await this.calendarService.createEvent(googleEvent);
      
      // Sync to get updated events
      await this.syncEvents();
      
      return createdEvent;
    } catch (error) {
      console.error('Error adding event:', error);
      throw error;
    }
  }

  /**
   * Delete an event
   */
  async deleteEvent(googleId: string) {
    try {
      await this.calendarService.deleteEvent(googleId);
      this.syncedEvents.delete(googleId);
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }
}

export default CalendarSyncService;
