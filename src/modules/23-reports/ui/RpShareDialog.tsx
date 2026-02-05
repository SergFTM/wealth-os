'use client';

import React, { useState } from 'react';
import { ReportPack } from '../schema/reportPack';
import { ShareAccessLevel } from '../schema/reportShare';

interface RpShareDialogProps {
  pack: ReportPack;
  onClose: () => void;
  onCreated: () => void;
}

export function RpShareDialog({ pack, onClose, onCreated }: RpShareDialogProps) {
  const [accessLevel, setAccessLevel] = useState<ShareAccessLevel>('view');
  const [requiresAuth, setRequiresAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [allowedEmails, setAllowedEmails] = useState('');
  const [expiresInDays, setExpiresInDays] = useState(30);
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [shareNote, setShareNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [createdShareUrl, setCreatedShareUrl] = useState<string | null>(null);

  const handleCreate = async () => {
    setLoading(true);

    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);

      const payload = {
        packId: pack.id,
        accessLevel,
        requiresAuth,
        password: password || undefined,
        allowedEmails: allowedEmails ? allowedEmails.split(',').map(e => e.trim().toLowerCase()) : undefined,
        expiresAt: expiresAt.toISOString(),
        recipientName: recipientName || undefined,
        recipientEmail: recipientEmail || undefined,
        shareNote: shareNote || undefined,
      };

      const res = await fetch('/api/reports/shares', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const share = await res.json();
        setCreatedShareUrl(share.shareUrl);
      } else {
        const error = await res.json();
        alert(error.message || 'Failed to create share link');
      }
    } catch (error) {
      console.error('Error creating share:', error);
      alert('Failed to create share link');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (createdShareUrl) {
      navigator.clipboard.writeText(createdShareUrl);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Share Report</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4">
          {createdShareUrl ? (
            /* Success State */
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Share Link Created</h3>
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-3">
                <input
                  type="text"
                  value={createdShareUrl}
                  readOnly
                  className="flex-1 bg-transparent text-sm text-gray-700 outline-none"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-1 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded"
                >
                  Copy
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-3">
                Link expires in {expiresInDays} days
              </p>
            </div>
          ) : (
            /* Form */
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Access Level
                </label>
                <select
                  value={accessLevel}
                  onChange={(e) => setAccessLevel(e.target.value as ShareAccessLevel)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="view">View Only</option>
                  <option value="download">View & Download</option>
                  <option value="full">Full Access</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expires In
                </label>
                <select
                  value={expiresInDays}
                  onChange={(e) => setExpiresInDays(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value={7}>7 days</option>
                  <option value={14}>14 days</option>
                  <option value={30}>30 days</option>
                  <option value={60}>60 days</option>
                  <option value={90}>90 days</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="requiresAuth"
                  checked={requiresAuth}
                  onChange={(e) => setRequiresAuth(e.target.checked)}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="requiresAuth" className="text-sm text-gray-700">
                  Require authentication
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password (optional)
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Allowed Emails (optional)
                </label>
                <input
                  type="text"
                  value={allowedEmails}
                  onChange={(e) => setAllowedEmails(e.target.value)}
                  placeholder="email@example.com, another@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <p className="text-xs text-gray-500 mt-1">Comma-separated list</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recipient Name
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="John Smith"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recipient Email
                  </label>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Note (optional)
                </label>
                <textarea
                  value={shareNote}
                  onChange={(e) => setShareNote(e.target.value)}
                  placeholder="Add a note about this share..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          {createdShareUrl ? (
            <button
              onClick={onCreated}
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Done
            </button>
          ) : (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Link'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
