'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRecord, useMutateRecord, useAuditEvents } from '@/lib/hooks';
import { ExExceptionDetail } from '@/modules/48-exceptions/ui/ExExceptionDetail';
import {
  assignException,
  changeSeverity,
  changeStatus,
  addRemediationStep,
  updateRemediationStep,
  addComment
} from '@/modules/48-exceptions/engine/triageEngine';
import { markSourceResolved } from '@/modules/48-exceptions/engine/autoCloseEngine';
import { Exception } from '@/modules/48-exceptions/engine/exceptionRouter';

export default function ExceptionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: exception, isLoading, error } = useRecord<Exception>('exceptions', id);
  const { mutate } = useMutateRecord('exceptions', id);
  const { events: auditEvents } = useAuditEvents(id);

  const handleAssign = async (role: string) => {
    if (!exception) return;
    const updates = assignException(exception, { role }, 'current_user');
    await mutate(updates);
  };

  const handleChangeSeverity = async (severity: string) => {
    if (!exception) return;
    const updates = changeSeverity(exception, severity as 'ok' | 'warning' | 'critical', 'current_user');
    await mutate(updates);
  };

  const handleChangeStatus = async (status: string) => {
    if (!exception) return;
    const updates = changeStatus(exception, status as 'open' | 'triage' | 'in_progress' | 'closed', 'current_user');
    await mutate(updates);
  };

  const handleAddRemediation = async (step: { title: string; ownerRole?: string }) => {
    if (!exception) return;
    const updates = addRemediationStep(exception, step, 'current_user');
    await mutate(updates);
  };

  const handleUpdateRemediation = async (index: number, update: { status: string }) => {
    if (!exception) return;
    const updates = updateRemediationStep(exception, index, update, 'current_user');
    await mutate(updates);
  };

  const handleMarkSourceResolved = async (resolved: boolean) => {
    if (!exception) return;
    const updates = markSourceResolved(exception, resolved, 'current_user');
    await mutate(updates);
  };

  const handleAddComment = async (comment: string) => {
    if (!exception) return;
    const updates = addComment(exception, comment, 'current_user');
    await mutate(updates);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-emerald-50/30 to-amber-50/20 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !exception) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-emerald-50/30 to-amber-50/20 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <h2 className="text-lg font-semibold text-red-800">Исключение не найдено</h2>
            <p className="text-sm text-red-600 mt-2">ID: {id}</p>
            <Link
              href="/m/exceptions"
              className="inline-block mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200"
            >
              Вернуться к списку
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-emerald-50/30 to-amber-50/20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/m/exceptions/list"
              className="p-2 rounded-lg hover:bg-stone-100 text-stone-600"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-stone-900">Исключение</h1>
              <p className="text-xs text-stone-500 font-mono">{id}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <ExExceptionDetail
          exception={exception}
          onAssign={handleAssign}
          onChangeSeverity={handleChangeSeverity}
          onChangeStatus={handleChangeStatus}
          onAddRemediation={handleAddRemediation}
          onUpdateRemediation={handleUpdateRemediation}
          onMarkSourceResolved={handleMarkSourceResolved}
          onAddComment={handleAddComment}
        />
      </div>
    </div>
  );
}
