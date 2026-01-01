'use client';

import { useState } from 'react';

export default function Home() {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [authUrl, setAuthUrl] = useState('');
  const [code, setCode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const getAuthUrl = async () => {
    try {
      const response = await fetch('/api/auth');
      const data = await response.json();
      setAuthUrl(data.url);
    } catch (error) {
      setStatus('Error getting auth URL');
    }
  };

  const authenticate = async () => {
    try {
      const response = await fetch('/api/auth/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      if (data.success) {
        setIsAuthenticated(true);
        setStatus('Successfully authenticated!');
        setAuthUrl('');
        setCode('');
      } else {
        setStatus('Authentication failed');
      }
    } catch (error) {
      setStatus('Error during authentication');
    }
  };

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('Sending...');

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, subject, message }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('✓ Email sent successfully!');
        setTo('');
        setSubject('');
        setMessage('');
      } else {
        setStatus(`✗ Error: ${data.error}`);
      }
    } catch (error) {
      setStatus('✗ Failed to send email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">📧 Gmail Sender Agent</h1>
          <p className="text-gray-600 mb-6">Send emails using Gmail API</p>

          {!isAuthenticated ? (
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                <p className="text-sm text-yellow-800 mb-2">
                  <strong>Setup Required:</strong> You need to authenticate with Google OAuth2
                </p>
                <p className="text-xs text-yellow-700 mb-3">
                  This demo requires Gmail API credentials. For production use, set up OAuth2 credentials in Google Cloud Console.
                </p>
              </div>

              {!authUrl ? (
                <button
                  onClick={getAuthUrl}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition"
                >
                  Get Authorization URL
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded border">
                    <p className="text-xs text-gray-600 mb-2">Authorization URL:</p>
                    <a
                      href={authUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm break-all hover:underline"
                    >
                      {authUrl}
                    </a>
                  </div>
                  <input
                    type="text"
                    placeholder="Paste authorization code here"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={authenticate}
                    disabled={!code}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
                  >
                    Authenticate
                  </button>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={sendEmail} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To:
                </label>
                <input
                  type="email"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  required
                  placeholder="recipient@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject:
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  placeholder="Email subject"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message:
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  placeholder="Your message here..."
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 font-medium"
              >
                {loading ? 'Sending...' : 'Send Email'}
              </button>
            </form>
          )}

          {status && (
            <div
              className={`mt-4 p-4 rounded-lg ${
                status.includes('✓')
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : status.includes('✗')
                  ? 'bg-red-50 text-red-800 border border-red-200'
                  : 'bg-blue-50 text-blue-800 border border-blue-200'
              }`}
            >
              {status}
            </div>
          )}
        </div>

        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">📝 Setup Instructions</h2>
          <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
            <li>Go to <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Cloud Console</a></li>
            <li>Create a new project or select existing one</li>
            <li>Enable Gmail API</li>
            <li>Create OAuth 2.0 credentials (Desktop app)</li>
            <li>Download credentials and set environment variables:
              <div className="mt-2 bg-gray-50 p-3 rounded font-mono text-xs">
                GOOGLE_CLIENT_ID=your_client_id<br/>
                GOOGLE_CLIENT_SECRET=your_client_secret<br/>
                GOOGLE_REDIRECT_URI=urn:ietf:wg:oauth:2.0:oob
              </div>
            </li>
          </ol>
        </div>
      </div>
    </main>
  );
}
