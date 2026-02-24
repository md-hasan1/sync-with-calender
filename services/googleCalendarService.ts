import { calendar_v3, google } from 'googleapis';
import { Credentials } from 'google-auth-library';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export class GoogleCalendarService {
  private calendar: calendar_v3.Calendar;

  constructor() {
    this.calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  }

  /**
   * Get authorization URL
   */
  getAuthUrl(): string {
    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/calendar.readonly',
        'https://www.googleapis.com/auth/calendar.events',
      ],
    });
  }

  /**
   * Exchange authorization code for tokens
   */
  async getTokens(code: string) {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    return tokens;
  }

  /**
   * Set credentials from stored token
   */
  setCredentials(credentials: Credentials) {
    oauth2Client.setCredentials(credentials);
  }

  /**
   * Get events from primary calendar
   */
  async getEvents(
    timeMin?: string,
    timeMax?: string,
    maxResults: number = 20
  ): Promise<calendar_v3.Schema$Event[]> {
    try {
      const res = await this.calendar.events.list({
        calendarId: 'primary',
        timeMin: timeMin || new Date().toISOString(),
        timeMax: timeMax,
        maxResults,
        singleEvents: true,
        orderBy: 'startTime',
      });

      return res.data.items || [];
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  }

  /**
   * Create an event
   */
  async createEvent(event: calendar_v3.Schema$Event) {
    try {
      const res = await this.calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
      });
      return res.data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  /**
   * Update an event
   */
  async updateEvent(eventId: string, event: calendar_v3.Schema$Event) {
    try {
      const res = await this.calendar.events.update({
        calendarId: 'primary',
        eventId,
        requestBody: event,
      });
      return res.data;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }

  /**
   * Delete an event
   */
  async deleteEvent(eventId: string) {
    try {
      await this.calendar.events.delete({
        calendarId: 'primary',
        eventId,
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }

  /**
   * Get calendar details
   */
  async getCalendarInfo() {
    try {
      const res = await this.calendar.calendars.get({
        calendarId: 'primary',
      });
      return res.data;
    } catch (error) {
      console.error('Error getting calendar info:', error);
      throw error;
    }
  }
}

export default GoogleCalendarService;
