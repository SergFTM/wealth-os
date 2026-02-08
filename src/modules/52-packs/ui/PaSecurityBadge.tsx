"use client";

interface PaSecurityBadgeProps {
  watermark?: boolean;
  password?: boolean;
  downloadLimit?: number;
  ttlDays?: number;
}

export function PaSecurityBadge({ watermark, password, downloadLimit, ttlDays }: PaSecurityBadgeProps) {
  const badges: { icon: string; label: string; color: string }[] = [];

  if (watermark) {
    badges.push({ icon: '💧', label: 'Watermark', color: 'bg-blue-50 text-blue-700 border-blue-200' });
  }

  if (password) {
    badges.push({ icon: '🔒', label: 'Пароль', color: 'bg-amber-50 text-amber-700 border-amber-200' });
  }

  if (downloadLimit) {
    badges.push({ icon: '📥', label: `Max ${downloadLimit}`, color: 'bg-violet-50 text-violet-700 border-violet-200' });
  }

  if (ttlDays) {
    badges.push({ icon: '⏱️', label: `${ttlDays}д`, color: 'bg-stone-100 text-stone-700 border-stone-200' });
  }

  if (badges.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {badges.map((badge, idx) => (
        <span
          key={idx}
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${badge.color}`}
        >
          <span className="mr-1">{badge.icon}</span>
          {badge.label}
        </span>
      ))}
    </div>
  );
}

export function PaShareSecurityPanel({
  allowDownload,
  maxDownloads,
  downloadCount,
  watermarkEnabled,
  passwordProtected,
  expiresAt,
}: {
  allowDownload: boolean;
  maxDownloads?: number;
  downloadCount: number;
  watermarkEnabled?: boolean;
  passwordProtected?: boolean;
  expiresAt: string;
}) {
  const expiresDate = new Date(expiresAt);
  const now = new Date();
  const daysLeft = Math.ceil((expiresDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
      <h4 className="text-sm font-medium text-stone-700 mb-3">Настройки безопасности</h4>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-stone-600">Скачивание</span>
          <span className={allowDownload ? 'text-emerald-600' : 'text-red-600'}>
            {allowDownload ? 'Разрешено' : 'Запрещено'}
          </span>
        </div>

        {maxDownloads && (
          <div className="flex justify-between items-center">
            <span className="text-stone-600">Лимит скачиваний</span>
            <span className="text-stone-800">{downloadCount} / {maxDownloads}</span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-stone-600">Водяной знак</span>
          <span className={watermarkEnabled ? 'text-emerald-600' : 'text-stone-500'}>
            {watermarkEnabled ? 'Включён' : 'Выключен'}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-stone-600">Пароль</span>
          <span className={passwordProtected ? 'text-amber-600' : 'text-stone-500'}>
            {passwordProtected ? 'Установлен' : 'Нет'}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-stone-600">Срок действия</span>
          <span className={daysLeft <= 3 ? 'text-amber-600' : 'text-stone-800'}>
            {daysLeft > 0 ? `${daysLeft} дн.` : 'Истёк'}
          </span>
        </div>
      </div>
    </div>
  );
}
