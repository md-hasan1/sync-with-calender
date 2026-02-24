'use client';

import { useEffect, useState } from 'react';
import { SyncedEvent } from '@/services/calendarSyncService';

export function EventList() {
  const [events, setEvents] = useState<SyncedEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUpcomingEvents();
  }, []);

  const fetchUpcomingEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/events?type=upcoming');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data.events);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-gray-600">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="text-gray-600">No upcoming events</div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.googleId}
              className="border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
              
              <div className="text-sm text-gray-600 space-y-1">
                <div>
                  <span className="font-medium">Start:</span>{' '}
                  {formatDateTime(event.startTime)}
                </div>
                <div>
                  <span className="font-medium">End:</span>{' '}
                  {formatDateTime(event.endTime)}
                </div>
                
                {event.location && (
                  <div>
                    <span className="font-medium">Location:</span> {event.location}
                  </div>
                )}
                
                {event.description && (
                  <div className="mt-2">
                    <span className="font-medium">Description:</span>
                    <p className="mt-1 text-gray-700">{event.description}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={fetchUpcomingEvents}
        disabled={loading}
        className="mt-6 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Loading...' : 'Refresh Events'}
      </button>
    </div>
  );
}
