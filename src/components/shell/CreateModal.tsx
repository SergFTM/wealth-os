"use client";

import { useApp } from "@/lib/store";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useState } from "react";

type CreateType = 'task' | 'request' | 'invoice' | 'reportPackage' | 'case';

export function CreateModal() {
  const { t, createModalOpen, closeCreateModal } = useApp();
  const [selectedType, setSelectedType] = useState<CreateType | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '', client: '' });

  const types: { key: CreateType; icon: React.ReactNode }[] = [
    { key: 'task', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg> },
    { key: 'request', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { key: 'invoice', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" /></svg> },
    { key: 'reportPackage', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
    { key: 'case', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg> },
  ];

  const handleClose = () => {
    closeCreateModal();
    setSelectedType(null);
    setFormData({ title: '', description: '', client: '' });
  };

  const handleSave = () => {
    // In real app, this would save to backend
    console.log('Creating:', { type: selectedType, ...formData });
    handleClose();
  };

  return (
    <Modal open={createModalOpen} onClose={handleClose} title={t.create.title} size="md">
      {!selectedType ? (
        <div className="grid grid-cols-2 gap-3">
          {types.map(({ key, icon }) => (
            <button
              key={key}
              onClick={() => setSelectedType(key)}
              className="flex items-center gap-3 p-4 rounded-xl border border-stone-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all text-left"
            >
              <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-50 to-amber-50 text-emerald-600">
                {icon}
              </div>
              <span className="font-medium text-stone-700">
                {t.create[key as keyof typeof t.create]}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <button
            onClick={() => setSelectedType(null)}
            className="text-sm text-stone-500 hover:text-stone-700 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Назад
          </button>
          
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Название
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              placeholder={`Новый ${t.create[selectedType as keyof typeof t.create].toLowerCase()}`}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Клиент
            </label>
            <select
              value={formData.client}
              onChange={(e) => setFormData(prev => ({ ...prev, client: e.target.value }))}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              <option value="">Выберите клиента</option>
              <option value="Aurora Family">Aurora Family</option>
              <option value="Limassol Holdings">Limassol Holdings</option>
              <option value="North Star Trust">North Star Trust</option>
              <option value="Vega Partners">Vega Partners</option>
              <option value="Orion Family">Orion Family</option>
              <option value="Cedar Legacy">Cedar Legacy</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Описание
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 h-24 resize-none"
              placeholder="Опишите подробности..."
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={handleClose}>
              {t.common.cancel}
            </Button>
            <Button onClick={handleSave}>
              {t.common.save}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
