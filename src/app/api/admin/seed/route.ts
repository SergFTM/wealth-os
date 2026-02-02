import { NextResponse } from 'next/server';
import { ensureSeedOnce, resetSeedFlag } from '@/db/storage/ensureSeed';

export async function POST() {
  resetSeedFlag();
  await ensureSeedOnce(true);
  
  return NextResponse.json({ 
    success: true, 
    message: 'Demo data initialized' 
  });
}
