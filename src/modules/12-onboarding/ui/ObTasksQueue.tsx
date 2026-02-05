"use client";

import { ObSlaBadge } from './ObSlaBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface ComplianceTask {
  id: string;
  caseId: string;
  title: string;
  dueAt: string;
  assignee: string;
  status: string;
  slaRisk: boolean;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ObTasksQueueProps {
  tasks: ComplianceTask[];
  onComplete: (id: string) => void;
  onEscalate?: (id: string) => void;
  compact?: boolean;
}

const statusMap: Record<string, 'pending' | 'in_progress' | 'completed'> = {
  open: 'pending',
  in_progress: 'in_progress',
  done: 'completed',
};

export function ObTasksQueue({ tasks, onComplete, onEscalate, compact }: ObTasksQueueProps) {
  if (tasks.length === 0) {
    return (
      <div className="p-6 text-center text-stone-400 text-sm">
        Нет задач
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-200/50">
            <th className="text-left py-2 px-3 font-medium text-stone-500">Задача</th>
            {!compact && <th className="text-left py-2 px-3 font-medium text-stone-500">Кейс</th>}
            <th className="text-left py-2 px-3 font-medium text-stone-500">Срок</th>
            <th className="text-left py-2 px-3 font-medium text-stone-500">Статус</th>
            {!compact && <th className="text-left py-2 px-3 font-medium text-stone-500">Исполнитель</th>}
            {!compact && <th className="text-left py-2 px-3 font-medium text-stone-500">Действия</th>}
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className={`border-b border-stone-100 hover:bg-stone-50/50 ${task.slaRisk ? 'bg-red-50/30' : ''}`}>
              <td className="py-2 px-3 font-medium text-stone-800">{task.title}</td>
              {!compact && <td className="py-2 px-3 text-stone-500 text-xs">{task.caseId}</td>}
              <td className="py-2 px-3">
                <ObSlaBadge dueAt={task.dueAt} status={task.status === 'done' ? 'approved' : 'active'} />
              </td>
              <td className="py-2 px-3">
                <StatusBadge status={statusMap[task.status] || 'info'} size="sm" />
              </td>
              {!compact && <td className="py-2 px-3 text-stone-500 text-xs">{task.assignee.split('@')[0]}</td>}
              {!compact && (
                <td className="py-2 px-3">
                  {task.status !== 'done' && (
                    <div className="flex gap-1">
                      <button onClick={() => onComplete(task.id)} className="px-2 py-1 text-xs text-emerald-600 hover:bg-emerald-50 rounded">Done</button>
                      {onEscalate && (
                        <button onClick={() => onEscalate(task.id)} className="px-2 py-1 text-xs text-amber-600 hover:bg-amber-50 rounded">Escalate</button>
                      )}
                    </div>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
