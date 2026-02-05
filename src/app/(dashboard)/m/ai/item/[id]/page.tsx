"use client";

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Sparkles,
  FileText,
  MessageSquare,
  ListTodo,
  ClipboardList,
  Calendar,
  User,
  Target,
  Shield,
} from 'lucide-react';
import { AiNarrativeDetail } from '@/modules/20-ai/ui/AiNarrativeDetail';
import { AiDraftDetail } from '@/modules/20-ai/ui/AiDraftDetail';
import { AiConfidenceBadge } from '@/modules/20-ai/ui/AiConfidenceBadge';
import { AiSourcesCard } from '@/modules/20-ai/ui/AiSourcesCard';
import { AiFeedbackPanel } from '@/modules/20-ai/ui/AiFeedbackPanel';
import { CopilotDrawer } from '@/components/global/CopilotDrawer';

type ItemType = 'narrative' | 'draft' | 'triage' | 'event' | 'policy';

export default function AiItemPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const type = (searchParams.get('type') as ItemType) || 'event';

  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copilotOpen, setCopilotOpen] = useState(false);

  useEffect(() => {
    async function loadItem() {
      const collectionMap: Record<ItemType, string> = {
        narrative: 'aiNarratives',
        draft: 'aiDrafts',
        triage: 'aiTriageItems',
        event: 'aiEvents',
        policy: 'aiPolicies',
      };

      try {
        const res = await fetch(`/api/collections/${collectionMap[type]}/${id}`);
        const data = await res.json();
        setItem(data);
      } catch (error) {
        console.error('Failed to load item:', error);
      } finally {
        setLoading(false);
      }
    }

    loadItem();
  }, [id, type]);

  const handleFeedback = async (feedback: { rating: 'up' | 'down'; comment?: string }) => {
    try {
      await fetch('/api/ai/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: id,
          rating: feedback.rating,
          comment: feedback.comment,
        }),
      });
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };

  const handleDraftUpdate = async (updates: any) => {
    try {
      await fetch('/api/ai/drafts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          ...updates,
        }),
      });
      // Reload item
      const res = await fetch(`/api/collections/aiDrafts/${id}`);
      const data = await res.json();
      setItem(data);
    } catch (error) {
      console.error('Failed to update draft:', error);
    }
  };

  const handleTriageUpdate = async (status: string) => {
    try {
      await fetch('/api/ai/triage', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          status,
        }),
      });
      // Reload item
      const res = await fetch(`/api/collections/aiTriageItems/${id}`);
      const data = await res.json();
      setItem(data);
    } catch (error) {
      console.error('Failed to update triage item:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center py-12">
        <p className="text-stone-500">Item not found</p>
        <Link href="/m/ai/list" className="text-violet-600 hover:text-violet-700 mt-2 inline-block">
          Back to list
        </Link>
      </div>
    );
  }

  const getIcon = () => {
    switch (type) {
      case 'narrative':
        return FileText;
      case 'draft':
        return MessageSquare;
      case 'triage':
        return ListTodo;
      case 'event':
        return ClipboardList;
      default:
        return Sparkles;
    }
  };

  const Icon = getIcon();

  const renderContent = () => {
    switch (type) {
      case 'narrative':
        return (
          <AiNarrativeDetail
            narrative={item}
            onAskFollowUp={() => setCopilotOpen(true)}
          />
        );

      case 'draft':
        return (
          <AiDraftDetail
            draft={item}
            onUpdate={handleDraftUpdate}
          />
        );

      case 'triage':
        return (
          <div className="space-y-6">
            {/* Triage Header */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-stone-800">{item.title}</h2>
                  <p className="text-sm text-stone-500 mt-1">{item.category}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  item.severity === 'critical' ? 'bg-red-100 text-red-700' :
                  item.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                  item.severity === 'medium' ? 'bg-amber-100 text-amber-700' :
                  'bg-stone-100 text-stone-600'
                }`}>
                  {item.severity}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-stone-700 mb-2">Suggested Action</h3>
                  <p className="text-sm text-stone-600 bg-violet-50 p-4 rounded-lg border border-violet-100">
                    {item.suggestedAction}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-sm text-stone-500">
                  <span>Client: {item.clientId}</span>
                  <span>Status: {item.status}</span>
                  <span>Created: {new Date(item.createdAt).toLocaleDateString('ru-RU')}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            {item.status === 'open' && (
              <div className="bg-white rounded-2xl border border-stone-200 p-6">
                <h3 className="text-sm font-medium text-stone-700 mb-4">Actions</h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleTriageUpdate('accepted')}
                    className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                  >
                    Accept & Take Action
                  </button>
                  <button
                    onClick={() => handleTriageUpdate('dismissed')}
                    className="px-4 py-2 text-sm font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            {item.status === 'accepted' && (
              <div className="bg-white rounded-2xl border border-stone-200 p-6">
                <h3 className="text-sm font-medium text-stone-700 mb-4">Mark as Completed</h3>
                <button
                  onClick={() => handleTriageUpdate('completed')}
                  className="px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors"
                >
                  Mark Completed
                </button>
              </div>
            )}
          </div>
        );

      case 'event':
        const sources = item.sourcesJson ? JSON.parse(item.sourcesJson) : [];
        return (
          <div className="space-y-6">
            {/* Event Details */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-xs font-mono text-stone-400">{item.id}</span>
                  <h2 className="text-lg font-semibold text-stone-800 mt-1">{item.promptType}</h2>
                </div>
                <div className="flex items-center gap-2">
                  {item.clientSafe && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-emerald-700 bg-emerald-100 rounded-full">
                      <Shield className="w-3 h-3" />
                      Client-safe
                    </span>
                  )}
                  {item.blocked && (
                    <span className="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">
                      Blocked
                    </span>
                  )}
                  <AiConfidenceBadge confidence={item.confidencePct} />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-stone-700 mb-2">Prompt</h3>
                  <p className="text-sm text-stone-600 bg-stone-50 p-4 rounded-lg">
                    {item.promptText}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-stone-700 mb-2">Response</h3>
                  <div className="text-sm text-stone-600 bg-violet-50 p-4 rounded-lg whitespace-pre-wrap">
                    {item.responseText || 'No response (blocked)'}
                  </div>
                </div>

                {item.blockReason && (
                  <div>
                    <h3 className="text-sm font-medium text-red-700 mb-2">Block Reason</h3>
                    <p className="text-sm text-red-600 bg-red-50 p-4 rounded-lg">
                      {item.blockReason}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-4 pt-4 border-t border-stone-100 text-sm text-stone-500">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {item.userId}
                  </span>
                  <span className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    {item.clientId}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(item.createdAt).toLocaleString('ru-RU')}
                  </span>
                </div>
              </div>
            </div>

            {/* Sources */}
            {sources.length > 0 && (
              <AiSourcesCard sources={sources} />
            )}

            {/* Feedback */}
            <AiFeedbackPanel onSubmit={handleFeedback} />
          </div>
        );

      case 'policy':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200 p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-stone-800">{item.name}</h2>
                  <p className="text-sm text-stone-500 mt-1">{item.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  item.active ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-600'
                }`}>
                  {item.active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-stone-700 mb-3">Allowed Prompt Types</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.allowedPromptTypes?.map((pt: string) => (
                      <span key={pt} className="px-2 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 rounded">
                        {pt}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-stone-700 mb-3">Blocked Prompt Types</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.blockedPromptTypes?.map((pt: string) => (
                      <span key={pt} className="px-2 py-1 text-xs font-medium text-red-700 bg-red-50 rounded">
                        {pt}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-stone-700 mb-3">Requires Confirmation</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.requiresConfirmation?.length > 0 ? (
                      item.requiresConfirmation.map((pt: string) => (
                        <span key={pt} className="px-2 py-1 text-xs font-medium text-amber-700 bg-amber-50 rounded">
                          {pt}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-stone-500">None</span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-stone-700 mb-3">Limits</h3>
                  <div className="space-y-2 text-sm text-stone-600">
                    <div className="flex justify-between">
                      <span>Max Daily Queries</span>
                      <span className="font-medium">{item.maxDailyQueries}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Client-safe Default</span>
                      <span className="font-medium">{item.clientSafeDefault ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href={`/m/ai/list?tab=${type === 'event' ? 'audit' : type + 's'}`}
            className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
              <Icon className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-stone-800">
                {type.charAt(0).toUpperCase() + type.slice(1)} Detail
              </h1>
              <p className="text-sm text-stone-500">{id}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        {renderContent()}
      </div>

      <CopilotDrawer
        isOpen={copilotOpen}
        onClose={() => setCopilotOpen(false)}
        moduleContext={{
          moduleKey: 'ai',
          moduleName: 'AI Copilot',
          recordId: id,
          recordType: type,
        }}
      />
    </>
  );
}
