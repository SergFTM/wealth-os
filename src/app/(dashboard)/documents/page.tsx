"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { ScopeBar } from "@/components/shell/ScopeBar";
import { KpiCard } from "@/components/ui/KpiCard";
import { DataTable } from "@/components/ui/DataTable";
import { Drawer } from "@/components/ui/Drawer";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { documents, formatDate, Document } from "@/lib/data";

export default function DocumentsPage() {
  const { t } = useApp();
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  return (
    <div>
      <ScopeBar />
      <h1 className="text-2xl font-bold text-stone-800 mb-6">{t.nav.documents}</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <KpiCard title="Всего документов" value={documents.length} status="ok" />
        <KpiCard title="Ожидают подписи" value={documents.filter(d => d.status === 'pending_signature').length} status="warning" />
        <KpiCard title="Черновики" value={documents.filter(d => d.status === 'draft').length} status="info" />
        <KpiCard title="Активных" value={documents.filter(d => d.status === 'active' || d.status === 'final').length} status="ok" />
      </div>

      <DataTable
        data={documents}
        columns={[
          { key: 'name', header: 'Документ', render: (item) => <span className="font-medium">{item.name}</span> },
          { key: 'client', header: 'Клиент' },
          { key: 'type', header: 'Тип', render: (item) => <span className="capitalize">{item.type}</span> },
          { key: 'status', header: 'Статус', render: (item) => <StatusBadge status={item.status as 'active' | 'pending' | 'draft'} label={item.status} size="sm" /> },
          { key: 'size', header: 'Размер' },
          { key: 'uploadedAt', header: 'Дата', render: (item) => formatDate(item.uploadedAt) },
        ]}
        onRowClick={(item) => setSelectedDoc(item)}
      />

      <Drawer open={!!selectedDoc} onClose={() => setSelectedDoc(null)} title="Детали документа">
        {selectedDoc && (
          <div className="space-y-4">
            <div><label className="text-xs text-stone-500">Название</label><p className="font-medium">{selectedDoc.name}</p></div>
            <div><label className="text-xs text-stone-500">Клиент</label><p>{selectedDoc.client}</p></div>
            <div><label className="text-xs text-stone-500">Тип</label><p className="capitalize">{selectedDoc.type}</p></div>
            <div><label className="text-xs text-stone-500">Статус</label><div className="mt-1"><StatusBadge status={selectedDoc.status as 'active'} label={selectedDoc.status} /></div></div>
            <div><label className="text-xs text-stone-500">Размер</label><p>{selectedDoc.size}</p></div>
            <div><label className="text-xs text-stone-500">Загружен</label><p>{formatDate(selectedDoc.uploadedAt)}</p></div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
