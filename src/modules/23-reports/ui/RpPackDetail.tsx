'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ReportPack, PackStatus } from '../schema/reportPack';
import { ReportSection } from '../schema/reportSection';
import { RpSectionList } from './RpSectionList';
import { RpPackActions } from './RpPackActions';
import { RpShareDialog } from './RpShareDialog';
import { RpExportDialog } from './RpExportDialog';

interface RpPackDetailProps {
  pack: ReportPack;
  sections: ReportSection[];
  onUpdate: () => void;
}

function getStatusBadge(status: PackStatus) {
  const styles = {
    draft: 'bg-gray-100 text-gray-700 border-gray-300',
    locked: 'bg-blue-100 text-blue-700 border-blue-300',
    published: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    archived: 'bg-gray-100 text-gray-500 border-gray-300',
  };

  const labels = {
    draft: 'Draft',
    locked: 'Locked',
    published: 'Published',
    archived: 'Archived',
  };

  return (
    <span className={`px-3 py-1 text-sm font-medium rounded-full border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

export function RpPackDetail({ pack, sections, onUpdate }: RpPackDetailProps) {
  const router = useRouter();
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLock = async () => {
    if (!confirm('Lock this pack? You will not be able to edit it after locking.')) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/reports/packs/${pack.id}/lock`, {
        method: 'POST',
      });

      if (res.ok) {
        onUpdate();
      } else {
        const error = await res.json();
        alert(error.message || 'Failed to lock pack');
      }
    } catch (error) {
      console.error('Error locking pack:', error);
      alert('Failed to lock pack');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!confirm('Publish this pack? It will become available for sharing.')) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/reports/packs/${pack.id}/publish`, {
        method: 'POST',
      });

      if (res.ok) {
        onUpdate();
      } else {
        const error = await res.json();
        alert(error.message || 'Failed to publish pack');
      }
    } catch (error) {
      console.error('Error publishing pack:', error);
      alert('Failed to publish pack');
    } finally {
      setLoading(false);
    }
  };

  const handleClone = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reports/packs/${pack.id}/clone`, {
        method: 'POST',
      });

      if (res.ok) {
        const newPack = await res.json();
        router.push(`/m/reports/pack/${newPack.id}`);
      } else {
        const error = await res.json();
        alert(error.message || 'Failed to clone pack');
      }
    } catch (error) {
      console.error('Error cloning pack:', error);
      alert('Failed to clone pack');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this pack? This action cannot be undone.')) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/reports/packs/${pack.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.push('/m/reports/list');
      } else {
        const error = await res.json();
        alert(error.message || 'Failed to delete pack');
      }
    } catch (error) {
      console.error('Error deleting pack:', error);
      alert('Failed to delete pack');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSection = () => {
    router.push(`/m/reports/pack/${pack.id}/section/new`);
  };

  const handleEditSection = (sectionId: string) => {
    router.push(`/m/reports/pack/${pack.id}/section/${sectionId}`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => router.push('/m/reports/list')}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-2xl font-semibold text-gray-900">{pack.name}</h1>
            {getStatusBadge(pack.status)}
          </div>
          <p className="text-sm text-gray-500">
            {pack.periodLabel} | Version {pack.version}
            {pack.description && ` | ${pack.description}`}
          </p>
        </div>

        <RpPackActions
          pack={pack}
          loading={loading}
          onLock={handleLock}
          onPublish={handlePublish}
          onShare={() => setShowShareDialog(true)}
          onExport={() => setShowExportDialog(true)}
          onClone={handleClone}
          onDelete={handleDelete}
        />
      </div>

      {/* Pack Info Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Pack Type</p>
          <p className="text-lg font-medium text-gray-900 capitalize mt-1">{pack.packType}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Period</p>
          <p className="text-lg font-medium text-gray-900 mt-1">{pack.periodLabel}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Sections</p>
          <p className="text-lg font-medium text-gray-900 mt-1">{sections.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Last Updated</p>
          <p className="text-lg font-medium text-gray-900 mt-1">
            {new Date(pack.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Sections */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Sections</h2>
          {pack.status === 'draft' && (
            <button
              onClick={handleAddSection}
              className="px-3 py-1.5 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Section
            </button>
          )}
        </div>
        <div className="p-4">
          <RpSectionList
            sections={sections}
            editable={pack.status === 'draft'}
            onEdit={handleEditSection}
            onReorder={() => onUpdate()}
          />
        </div>
      </div>

      {/* Notes */}
      {pack.notes && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Notes</h3>
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{pack.notes}</p>
        </div>
      )}

      {/* Dialogs */}
      {showShareDialog && (
        <RpShareDialog
          pack={pack}
          onClose={() => setShowShareDialog(false)}
          onCreated={() => {
            setShowShareDialog(false);
            onUpdate();
          }}
        />
      )}

      {showExportDialog && (
        <RpExportDialog
          pack={pack}
          onClose={() => setShowExportDialog(false)}
          onExported={() => {
            setShowExportDialog(false);
            onUpdate();
          }}
        />
      )}
    </div>
  );
}
