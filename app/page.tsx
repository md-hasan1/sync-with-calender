'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated by checking for credentials cookie
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/sync');
        setIsAuthenticated(response.ok);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Google Calendar Sync
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Automatically sync events from your Google Calendar to your personal calendar
          </p>

          <div className="flex gap-4 justify-center">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={() => {
                    document.cookie = 'google_credentials=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                    setIsAuthenticated(false);
                  }}
                  className="px-8 py-3 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded-lg font-semibold transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/api/auth/login"
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                Connect Google Calendar
              </Link>
            )}
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-3xl mb-4">⚡</div>
              <h2 className="text-xl font-semibold mb-2">Automatic Sync</h2>
              <p className="text-gray-600">
                Events sync automatically from Google Calendar every hour
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-3xl mb-4">📅</div>
              <h2 className="text-xl font-semibold mb-2">Calendar View</h2>
              <p className="text-gray-600">
                Beautiful month view with all your events displayed
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-3xl mb-4">🔒</div>
              <h2 className="text-xl font-semibold mb-2">Secure</h2>
              <p className="text-gray-600">
                Your Google Calendar credentials are securely stored
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
