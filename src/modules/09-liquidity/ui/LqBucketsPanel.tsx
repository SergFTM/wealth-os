"use client";

import { useRouter } from 'next/navigation';

interface Bucket {
  id: string;
  bucket: 'today' | '7d' | '30d' | '90d';
  inflows: number;
  outflows: number;
  net: number;
  status: 'ok' | 'warning' | 'critical';
}

interface LqBucketsPanelProps {
  buckets: Bucket[];
}

export function LqBucketsPanel({ buckets }: LqBucketsPanelProps) {
  const router = useRouter();

  const bucketLabels: Record<string, string> = {
    'today': 'Сегодня',
    '7d': '7 дней',
    '30d': '30 дней',
    '90d': '90 дней'
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(val);
  };

  const statusColors = {
    ok: 'border-emerald-500 bg-emerald-50/50',
    warning: 'border-amber-500 bg-amber-50/50',
    critical: 'border-rose-400 bg-rose-50/50'
  };

  const orderedBuckets = ['today', '7d', '30d', '90d'];
  const sortedBuckets = orderedBuckets.map(b => buckets.find(bucket => bucket.bucket === b)).filter(Boolean) as Bucket[];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
      <h3 className="font-semibold text-stone-800 mb-4">Liquidity Buckets</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {sortedBuckets.map((bucket) => (
          <div
            key={bucket.id}
            onClick={() => router.push(`/m/liquidity/list?tab=buckets&bucket=${bucket.bucket}`)}
            className={`p-4 rounded-lg border-l-4 cursor-pointer transition-all hover:shadow-md ${statusColors[bucket.status]}`}
          >
            <div className="text-sm font-medium text-stone-600 mb-2">
              {bucketLabels[bucket.bucket]}
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-stone-500">Приход</span>
                <span className="text-emerald-600">+{formatCurrency(bucket.inflows)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-stone-500">Расход</span>
                <span className="text-rose-500">-{formatCurrency(bucket.outflows)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold pt-1 border-t border-stone-200">
                <span className="text-stone-700">Нетто</span>
                <span className={bucket.net >= 0 ? 'text-emerald-600' : 'text-rose-500'}>
                  {bucket.net >= 0 ? '+' : ''}{formatCurrency(bucket.net)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
