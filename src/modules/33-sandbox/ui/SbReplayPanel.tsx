'use client';

import { useState } from 'react';
import { useApp } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { SbStatusPill } from './SbStatusPill';
import { getAvailableEventTypes, type EventType } from '../engine/replayEngine';

interface ReplayRun {
  id: string;
  envId: string;
  eventType: string;
  count: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  eventsGenerated?: number;
  deliveriesCreated?: number;
  startedAt?: string;
  finishedAt?: string;
  createdAt: string;
}

interface SbReplayPanelProps {
  replayRuns: ReplayRun[];
  environments: Array<{ id: string; name: string }>;
  onRunReplay?: (envId: string, eventType: EventType, count: number) => void;
}

const i18n = {
  ru: {
    title: 'Event Replay',
    newReplay: 'Новый Replay',
    history: 'История Replay',
    selectEnv: 'Среда',
    selectEvent: 'Тип события',
    count: 'Количество',
    run: 'Запустить Replay',
    events: 'Событий',
    deliveries: 'Доставок',
    noRuns: 'Нет запусков replay',
  },
  en: {
    title: 'Event Replay',
    newReplay: 'New Replay',
    history: 'Replay History',
    selectEnv: 'Environment',
    selectEvent: 'Event Type',
    count: 'Count',
    run: 'Run Replay',
    events: 'Events',
    deliveries: 'Deliveries',
    noRuns: 'No replay runs',
  },
  uk: {
    title: 'Event Replay',
    newReplay: 'Новий Replay',
    history: 'Історія Replay',
    selectEnv: 'Середовище',
    selectEvent: 'Тип події',
    count: 'Кількість',
    run: 'Запустити Replay',
    events: 'Подій',
    deliveries: 'Доставок',
    noRuns: 'Немає запусків replay',
  },
};

export function SbReplayPanel({ replayRuns, environments, onRunReplay }: SbReplayPanelProps) {
  const { locale } = useApp();
  const t = i18n[locale];

  const [selectedEnv, setSelectedEnv] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<EventType>('webhook.test');
  const [eventCount, setEventCount] = useState<number>(10);
  const [isRunning, setIsRunning] = useState(false);

  const eventTypes = getAvailableEventTypes();

  const handleRun = async () => {
    if (!selectedEnv) return;
    setIsRunning(true);
    try {
      await onRunReplay?.(selectedEnv, selectedEvent, eventCount);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* New Replay Form */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-indigo-100/50 p-5">
        <h3 className="font-semibold text-stone-800 mb-4">{t.newReplay}</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm text-stone-500 block mb-2">{t.selectEnv}</label>
            <select
              value={selectedEnv}
              onChange={(e) => setSelectedEnv(e.target.value)}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="">-- Select --</option>
              {environments.map((env) => (
                <option key={env.id} value={env.id}>{env.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-stone-500 block mb-2">{t.selectEvent}</label>
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value as EventType)}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              {eventTypes.map((et) => (
                <option key={et.type} value={et.type}>{et.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-stone-500 block mb-2">{t.count}</label>
            <input
              type="number"
              value={eventCount}
              onChange={(e) => setEventCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
              min={1}
              max={100}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-end">
            <Button
              variant="primary"
              onClick={handleRun}
              disabled={!selectedEnv || isRunning}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500"
            >
              {isRunning ? 'Running...' : t.run}
            </Button>
          </div>
        </div>
      </div>

      {/* Replay History */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-indigo-100/50 p-5">
        <h3 className="font-semibold text-stone-800 mb-4">{t.history}</h3>

        {replayRuns.length === 0 ? (
          <p className="text-sm text-stone-500 text-center py-4">{t.noRuns}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-100">
                  <th className="px-3 py-2 text-left text-xs font-semibold text-stone-500 uppercase">ID</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-stone-500 uppercase">Event Type</th>
                  <th className="px-3 py-2 text-center text-xs font-semibold text-stone-500 uppercase">Count</th>
                  <th className="px-3 py-2 text-center text-xs font-semibold text-stone-500 uppercase">Status</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold text-stone-500 uppercase">{t.events}</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold text-stone-500 uppercase">{t.deliveries}</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-stone-500 uppercase">Started</th>
                </tr>
              </thead>
              <tbody>
                {replayRuns.slice(0, 10).map((run) => (
                  <tr key={run.id} className="border-b border-stone-50 hover:bg-indigo-50/50">
                    <td className="px-3 py-2">
                      <code className="text-xs text-stone-600">{run.id}</code>
                    </td>
                    <td className="px-3 py-2">
                      <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded">{run.eventType}</span>
                    </td>
                    <td className="px-3 py-2 text-center text-sm text-stone-800">{run.count}</td>
                    <td className="px-3 py-2 text-center">
                      <SbStatusPill status={run.status} />
                    </td>
                    <td className="px-3 py-2 text-right text-sm font-mono text-stone-800">
                      {run.eventsGenerated || 0}
                    </td>
                    <td className="px-3 py-2 text-right text-sm font-mono text-stone-800">
                      {run.deliveriesCreated || 0}
                    </td>
                    <td className="px-3 py-2 text-sm text-stone-600">
                      {run.startedAt ? new Date(run.startedAt).toLocaleString() : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
