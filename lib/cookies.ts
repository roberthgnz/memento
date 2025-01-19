import { cookies } from 'next/headers';
import { generateId } from './utils';

const SYNC_ID_COOKIE = 'note-sync-id';

export function getSyncId(): string {
  const cookieStore = cookies();
  const syncId = cookieStore.get(SYNC_ID_COOKIE);
  return syncId?.value || generateId();
}

export function setSyncId(syncId: string) {
  const cookieStore = cookies();
  cookieStore.set(SYNC_ID_COOKIE, syncId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });
}