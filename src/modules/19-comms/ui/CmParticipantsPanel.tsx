"use client";

import { UserPlus, X, Eye, EyeOff, MoreHorizontal, Crown, Shield, Users } from 'lucide-react';

interface Participant {
  id: string;
  threadId: string;
  userId: string;
  role: 'owner' | 'member' | 'observer';
  addedBy: string;
  isClientVisible: boolean;
  joinedAt: string;
}

interface CmParticipantsPanelProps {
  participants: Participant[];
  currentUserId?: string;
  threadOwnerId?: string;
  isClientSafe?: boolean;
  onAddParticipant?: () => void;
  onRemoveParticipant?: (participant: Participant) => void;
  onChangeRole?: (participant: Participant, role: string) => void;
  onToggleVisibility?: (participant: Participant) => void;
  compact?: boolean;
}

const roleConfig: Record<string, { label: string; Icon: React.ComponentType<{ className?: string }> }> = {
  owner: { label: 'Владелец', Icon: Crown },
  member: { label: 'Участник', Icon: Users },
  observer: { label: 'Наблюдатель', Icon: Eye },
};

// Mock user data lookup
const getUserName = (userId: string): string => {
  const names: Record<string, string> = {
    'user-rm-001': 'Михаил Козлов',
    'user-rm-002': 'Анна Петрова',
    'user-rm-003': 'Дмитрий Сидоров',
    'user-pm-001': 'Сергей Иванов',
    'user-pm-002': 'Елена Морозова',
    'user-legal-001': 'Ольга Волкова',
    'user-compliance-001': 'Татьяна Белова',
    'user-ops-001': 'Алексей Новиков',
    'user-tax-001': 'Ирина Соколова',
    'user-cio-001': 'Виктор Орлов',
  };
  return names[userId] || userId;
};

const getUserInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

export function CmParticipantsPanel({
  participants,
  currentUserId = 'user-rm-001',
  threadOwnerId,
  isClientSafe = false,
  onAddParticipant,
  onRemoveParticipant,
  onChangeRole,
  onToggleVisibility,
  compact = false,
}: CmParticipantsPanelProps) {
  const sortedParticipants = [...participants].sort((a, b) => {
    const roleOrder = { owner: 0, member: 1, observer: 2 };
    return roleOrder[a.role] - roleOrder[b.role];
  });

  const visibleParticipants = sortedParticipants.filter(p => p.isClientVisible);
  const internalParticipants = sortedParticipants.filter(p => !p.isClientVisible);

  const isOwner = participants.some(p => p.userId === currentUserId && p.role === 'owner');

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-stone-100">
        <h3 className="text-sm font-semibold text-stone-800 flex items-center gap-2">
          <Users className="w-4 h-4 text-stone-500" />
          Участники ({participants.length})
        </h3>
        {onAddParticipant && (
          <button
            onClick={onAddParticipant}
            className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
            title="Добавить участника"
          >
            <UserPlus className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="divide-y divide-stone-100 max-h-80 overflow-y-auto">
        {/* Client-visible participants (when clientSafe) */}
        {isClientSafe && visibleParticipants.length > 0 && (
          <div>
            <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-100">
              <span className="text-xs font-medium text-emerald-700 flex items-center gap-1">
                <Eye className="w-3 h-3" />
                Видны клиенту
              </span>
            </div>
            {visibleParticipants.map((participant) => (
              <ParticipantRow
                key={participant.id}
                participant={participant}
                currentUserId={currentUserId}
                isOwner={isOwner}
                showVisibilityToggle={isClientSafe}
                onRemove={onRemoveParticipant}
                onChangeRole={onChangeRole}
                onToggleVisibility={onToggleVisibility}
                compact={compact}
              />
            ))}
          </div>
        )}

        {/* Internal participants (when clientSafe) */}
        {isClientSafe && internalParticipants.length > 0 && (
          <div>
            <div className="px-4 py-2 bg-stone-50 border-b border-stone-100">
              <span className="text-xs font-medium text-stone-600 flex items-center gap-1">
                <EyeOff className="w-3 h-3" />
                Только для команды
              </span>
            </div>
            {internalParticipants.map((participant) => (
              <ParticipantRow
                key={participant.id}
                participant={participant}
                currentUserId={currentUserId}
                isOwner={isOwner}
                showVisibilityToggle={isClientSafe}
                onRemove={onRemoveParticipant}
                onChangeRole={onChangeRole}
                onToggleVisibility={onToggleVisibility}
                compact={compact}
              />
            ))}
          </div>
        )}

        {/* All participants (when not clientSafe) */}
        {!isClientSafe && sortedParticipants.map((participant) => (
          <ParticipantRow
            key={participant.id}
            participant={participant}
            currentUserId={currentUserId}
            isOwner={isOwner}
            showVisibilityToggle={false}
            onRemove={onRemoveParticipant}
            onChangeRole={onChangeRole}
            onToggleVisibility={onToggleVisibility}
            compact={compact}
          />
        ))}
      </div>
    </div>
  );
}

function ParticipantRow({
  participant,
  currentUserId,
  isOwner,
  showVisibilityToggle,
  onRemove,
  onChangeRole,
  onToggleVisibility,
  compact,
}: {
  participant: Participant;
  currentUserId: string;
  isOwner: boolean;
  showVisibilityToggle: boolean;
  onRemove?: (p: Participant) => void;
  onChangeRole?: (p: Participant, role: string) => void;
  onToggleVisibility?: (p: Participant) => void;
  compact: boolean;
}) {
  const name = getUserName(participant.userId);
  const initials = getUserInitials(name);
  const role = roleConfig[participant.role] || roleConfig.member;
  const RoleIcon = role.Icon;
  const isCurrentUser = participant.userId === currentUserId;
  const canModify = isOwner && !isCurrentUser && participant.role !== 'owner';

  return (
    <div className="flex items-center gap-3 px-4 py-2 hover:bg-stone-50 transition-colors">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center text-xs font-medium text-stone-600 flex-shrink-0">
        {initials}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-sm truncate ${isCurrentUser ? 'font-semibold text-stone-800' : 'text-stone-700'}`}>
            {name}
          </span>
          {isCurrentUser && (
            <span className="text-xs text-stone-400">(вы)</span>
          )}
        </div>
        {!compact && (
          <div className="flex items-center gap-1 text-xs text-stone-500">
            <RoleIcon className="w-3 h-3" />
            {role.label}
          </div>
        )}
      </div>

      {/* Actions */}
      {canModify && (
        <div className="flex items-center gap-1">
          {showVisibilityToggle && (
            <button
              onClick={() => onToggleVisibility?.(participant)}
              className="p-1 text-stone-400 hover:text-stone-600 rounded transition-colors"
              title={participant.isClientVisible ? 'Скрыть от клиента' : 'Показать клиенту'}
            >
              {participant.isClientVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>
          )}
          <button
            onClick={() => onRemove?.(participant)}
            className="p-1 text-stone-400 hover:text-red-600 rounded transition-colors"
            title="Удалить"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
