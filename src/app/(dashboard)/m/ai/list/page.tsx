"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  FileText,
  MessageSquare,
  ListTodo,
  ClipboardList,
  ThumbsUp,
  Settings,
  ArrowLeft,
} from 'lucide-react';
import { AiNarrativesTable } from '@/modules/20-ai/ui/AiNarrativesTable';
import { AiDraftsTable } from '@/modules/20-ai/ui/AiDraftsTable';
import { AiTriageTable } from '@/modules/20-ai/ui/AiTriageTable';
import { AiAuditTable } from '@/modules/20-ai/ui/AiAuditTable';
import { CopilotDrawer } from '@/components/global/CopilotDrawer';

type TabKey = 'narratives' | 'drafts' | 'triage' | 'audit' | 'feedback' | 'policies';

const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: 'narratives', label: 'Narratives', icon: FileText },
  { key: 'drafts', label: 'Drafts', icon: MessageSquare },
  { key: 'triage', label: 'Triage', icon: ListTodo },
  { key: 'audit', label: 'Audit Log', icon: ClipboardList },
  { key: 'feedback', label: 'Feedback', icon: ThumbsUp },
  { key: 'policies', label: 'Policies', icon: Settings },
];

export default function AiListPage() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as TabKey) || 'narratives';

  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const [narratives, setNarratives] = useState<any[]>([]);
  const [drafts, setDrafts] = useState<any[]>([]);
  const [triageItems, setTriageItems] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [policies, setPolicies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copilotOpen, setCopilotOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const endpoints: Record<TabKey, string> = {
          narratives: '/api/collections/aiNarratives',
          drafts: '/api/collections/aiDrafts',
          triage: '/api/collections/aiTriageItems',
          audit: '/api/collections/aiEvents',
          feedback: '/api/collections/aiFeedback',
          policies: '/api/collections/aiPolicies',
        };

        const res = await fetch(endpoints[activeTab]);
        const data = await res.json();

        switch (activeTab) {
          case 'narratives':
            setNarratives(data.data || []);
            break;
          case 'drafts':
            setDrafts(data.data || []);
            break;
          case 'triage':
            setTriageItems(data.data || []);
            break;
          case 'audit':
            setEvents(data.data || []);
            break;
          case 'feedback':
            setFeedback(data.data || []);
            break;
          case 'policies':
            setPolicies(data.data || []);
            break;
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    }

    setLoading(true);
    loadData();
  }, [activeTab]);

  const handleRowClick = (item: any) => {
    const typeMap: Record<TabKey, string> = {
      narratives: 'narrative',
      drafts: 'draft',
      triage: 'triage',
      audit: 'event',
      feedback: 'feedback',
      policies: 'policy',
    };
    window.location.href = `/m/ai/item/${item.id}?type=${typeMap[activeTab]}`;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
        </div>
      );
    }

    switch (activeTab) {
      case 'narratives':
        return <AiNarrativesTable narratives={narratives} onRowClick={handleRowClick} />;
      case 'drafts':
        return <AiDraftsTable drafts={drafts} onRowClick={handleRowClick} />;
      case 'triage':
        return <AiTriageTable items={triageItems} onRowClick={handleRowClick} />;
      case 'audit':
        return <AiAuditTable events={events} onRowClick={handleRowClick} />;
      case 'feedback':
        return (
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase">Event ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase">Rating</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase">Comment</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {feedback.map((fb: any) => (
                  <tr key={fb.id} className="hover:bg-stone-50">
                    <td className="px-4 py-3 text-sm text-stone-600 font-mono">{fb.eventId}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        fb.rating === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {fb.rating === 'up' ? '👍' : '👎'} {fb.rating}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-stone-600 max-w-xs truncate">
                      {fb.comment || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-stone-600">{fb.userId}</td>
                    <td className="px-4 py-3 text-sm text-stone-500">
                      {new Date(fb.createdAt).toLocaleDateString('ru-RU')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'policies':
        return (
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase">Allowed Types</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase">Max Queries</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {policies.map((policy: any) => (
                  <tr key={policy.id} className="hover:bg-stone-50 cursor-pointer" onClick={() => handleRowClick(policy)}>
                    <td className="px-4 py-3 text-sm font-medium text-stone-800">{policy.name}</td>
                    <td className="px-4 py-3 text-sm text-stone-600">{policy.roleKey}</td>
                    <td className="px-4 py-3 text-sm text-stone-600">
                      {policy.allowedPromptTypes?.length || 0} types
                    </td>
                    <td className="px-4 py-3 text-sm text-stone-600">{policy.maxDailyQueries}/day</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        policy.active ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-600'
                      }`}>
                        {policy.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/m/ai"
              className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-stone-800 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-violet-600" />
                AI Copilot
              </h1>
              <p className="text-sm text-stone-500 mt-1">
                Управление narratives, drafts, triage и audit
              </p>
            </div>
          </div>
          <button
            onClick={() => setCopilotOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Спросить Copilot
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-stone-100 rounded-xl">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.key
                    ? 'bg-white text-violet-700 shadow-sm'
                    : 'text-stone-600 hover:text-stone-800 hover:bg-white/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
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
        }}
      />
    </>
  );
}
