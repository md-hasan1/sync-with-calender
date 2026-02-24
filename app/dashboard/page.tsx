'use client';

import { CalendarComponent } from '@/app/components/Calendar';
import { EventList } from '@/app/components/EventList';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const response = await fetch('/api/sync', {
        method: 'POST',
        body: JSON.stringify({ action: 'sync' }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLastSync(new Date(data.lastSyncedAt));
      }
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    handleSync();
    const interval = setInterval(handleSync, 60 * 60 * 1000); // Sync every hour
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Calendar Dashboard</h1>
          <div className="flex gap-4 items-center">
            {lastSync && (
              <div className="text-sm text-gray-600">
                Last synced: {lastSync.toLocaleTimeString()}
              </div>
            )}
            <button
              onClick={handleSync}
              disabled={syncing}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 transition-colors"
            >
              {syncing ? 'Syncing...' : 'Sync Now'}
            </button>
            <Link
              href="/"
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded-lg transition-colors"
            >
              Logout
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setView('calendar')}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              view === 'calendar'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Calendar View
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              view === 'list'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Event List
          </button>
        </div>

        {view === 'calendar' && <CalendarComponent />}
        {view === 'list' && <EventList />}
      </div>
    </main>
  );
}
