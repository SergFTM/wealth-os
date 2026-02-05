"use client";

import { useState, useEffect } from 'react';
import { AiDashboardPage } from '@/modules/20-ai/ui/AiDashboardPage';
import { CopilotDrawer } from '@/components/global/CopilotDrawer';

interface AiEvent {
  id: string;
  confidencePct: number;
  clientSafe: boolean;
  blocked: boolean;
  sourcesJson: string;
  createdAt: string;
}

interface Narrative {
  id: string;
  clientId: string;
  scopeType: string;
  scopeId: string;
  category: string;
  periodStart: string;
  periodEnd: string;
  title: string;
  narrativeText: string;
  confidencePct: number;
  createdAt: string;
}

interface Draft {
  id: string;
  clientId: string;
  draftType: string;
  title: string;
  contentText: string;
  status: 'draft' | 'reviewed' | 'sent' | 'archived';
  targetModule: string | null;
  createdAt: string;
}

interface TriageItem {
  id: string;
  clientId: string;
  category: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  suggestedAction: string;
  status: 'open' | 'accepted' | 'dismissed' | 'completed';
  createdAt: string;
}

interface Feedback {
  rating: 'up' | 'down';
  createdAt: string;
}

export default function AiDashboard() {
  const [events, setEvents] = useState<AiEvent[]>([]);
  const [narratives, setNarratives] = useState<Narrative[]>([]);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [triageItems, setTriageItems] = useState<TriageItem[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [copilotOpen, setCopilotOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [eventsRes, narrativesRes, draftsRes, triageRes, feedbackRes] = await Promise.all([
          fetch('/api/collections/aiEvents'),
          fetch('/api/collections/aiNarratives'),
          fetch('/api/collections/aiDrafts'),
          fetch('/api/collections/aiTriageItems'),
          fetch('/api/collections/aiFeedback'),
        ]);

        const [eventsData, narrativesData, draftsData, triageData, feedbackData] = await Promise.all([
          eventsRes.json(),
          narrativesRes.json(),
          draftsRes.json(),
          triageRes.json(),
          feedbackRes.json(),
        ]);

        setEvents(eventsData.data || []);
        setNarratives(narrativesData.data || []);
        setDrafts(draftsData.data || []);
        setTriageItems(triageData.data || []);
        setFeedback(feedbackData.data || []);
      } catch (error) {
        console.error('Failed to load AI data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
      </div>
    );
  }

  return (
    <>
      <AiDashboardPage
        events={events}
        narratives={narratives}
        drafts={drafts}
        triageItems={triageItems}
        feedback={feedback}
        onOpenCopilot={() => setCopilotOpen(true)}
      />

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
