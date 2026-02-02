"use client";

import { Shield, Eye, Edit, Trash2, Share2, Users } from 'lucide-react';

interface DvAccessPanelProps {
  confidentiality: 'internal' | 'client_safe';
  linkedCount: number;
  onUpdateAccess: (settings: { allowAdvisor: boolean; clientSafe: boolean }) => void;
}

const rolePermissions = [
  { role: 'Owner/Admin', read: true, add: true, delete: true, share: true },
  { role: 'CFO', read: true, add: true, delete: false, share: true },
  { role: 'Operations', read: true, add: true, delete: false, share: false },
  { role: 'Compliance', read: true, add: false, delete: false, share: false },
  { role: 'External Advisor', read: 'shares', add: false, delete: false, share: false },
  { role: 'Client', read: 'client_safe', add: false, delete: false, share: false },
];

export function DvAccessPanel({ confidentiality, linkedCount, onUpdateAccess }: DvAccessPanelProps) {
  const isClientSafe = confidentiality === 'client_safe';

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-gradient-to-r from-emerald-50 to-amber-50 rounded-xl p-4 border border-emerald-200/50">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-emerald-600" />
          <div>
            <h3 className="font-semibold text-stone-800">Уровень доступа</h3>
            <p className="text-sm text-stone-600">
              {isClientSafe 
                ? 'Клиентский доступ — документ виден клиентам и advisors'
                : 'Внутренний — только для команды MFO'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Object-based access note */}
      {linkedCount > 0 && (
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
          <p className="text-sm text-blue-700">
            <strong>Заметка:</strong> Документ связан с {linkedCount} объектами. 
            Доступ может наследоваться от связанных объектов.
          </p>
        </div>
      )}

      {/* RBAC Table */}
      <div>
        <h4 className="text-sm font-semibold text-stone-700 mb-3 flex items-center gap-2">
          <Users className="w-4 h-4" />
          Права по ролям
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200">
                <th className="text-left py-2 px-3 font-medium text-stone-600">Роль</th>
                <th className="text-center py-2 px-3 font-medium text-stone-600">
                  <Eye className="w-4 h-4 mx-auto" />
                </th>
                <th className="text-center py-2 px-3 font-medium text-stone-600">
                  <Edit className="w-4 h-4 mx-auto" />
                </th>
                <th className="text-center py-2 px-3 font-medium text-stone-600">
                  <Trash2 className="w-4 h-4 mx-auto" />
                </th>
                <th className="text-center py-2 px-3 font-medium text-stone-600">
                  <Share2 className="w-4 h-4 mx-auto" />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {rolePermissions.map((perm) => (
                <tr key={perm.role} className="hover:bg-stone-50">
                  <td className="py-2 px-3 text-stone-700">{perm.role}</td>
                  <td className="text-center py-2 px-3">
                    {perm.read === true ? (
                      <span className="text-emerald-500">✓</span>
                    ) : perm.read === 'shares' ? (
                      <span className="text-xs text-stone-500">shares</span>
                    ) : perm.read === 'client_safe' ? (
                      <span className={`text-xs ${isClientSafe ? 'text-emerald-500' : 'text-stone-400'}`}>
                        {isClientSafe ? '✓' : '—'}
                      </span>
                    ) : (
                      <span className="text-stone-300">—</span>
                    )}
                  </td>
                  <td className="text-center py-2 px-3">
                    {perm.add ? (
                      <span className="text-emerald-500">✓</span>
                    ) : (
                      <span className="text-stone-300">—</span>
                    )}
                  </td>
                  <td className="text-center py-2 px-3">
                    {perm.delete ? (
                      <span className="text-emerald-500">✓</span>
                    ) : (
                      <span className="text-stone-300">—</span>
                    )}
                  </td>
                  <td className="text-center py-2 px-3">
                    {perm.share ? (
                      <span className="text-emerald-500">✓</span>
                    ) : (
                      <span className="text-stone-300">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Access Settings */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-stone-700">Настройки доступа</h4>
        
        <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-stone-200 cursor-pointer hover:border-emerald-300 transition-colors">
          <input
            type="checkbox"
            checked={isClientSafe}
            onChange={(e) => onUpdateAccess({ allowAdvisor: isClientSafe, clientSafe: e.target.checked })}
            className="w-4 h-4 text-emerald-600 border-stone-300 rounded focus:ring-emerald-500"
          />
          <div>
            <p className="text-sm font-medium text-stone-700">Client Safe</p>
            <p className="text-xs text-stone-500">Документ доступен клиентам через portal</p>
          </div>
        </label>

        <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-stone-200 cursor-pointer hover:border-emerald-300 transition-colors">
          <input
            type="checkbox"
            checked={true}
            onChange={(e) => onUpdateAccess({ allowAdvisor: e.target.checked, clientSafe: isClientSafe })}
            className="w-4 h-4 text-emerald-600 border-stone-300 rounded focus:ring-emerald-500"
          />
          <div>
            <p className="text-sm font-medium text-stone-700">Allow Advisors</p>
            <p className="text-xs text-stone-500">Документ можно расшарить external advisors</p>
          </div>
        </label>
      </div>
    </div>
  );
}
