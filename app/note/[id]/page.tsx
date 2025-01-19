import { notFound } from 'next/navigation';
import { getNotesBySyncId } from '@/app/actions';
import { getSyncId } from '@/lib/cookies';
import { NoteDetailView } from '@/components/note-detail-view';

export const dynamic = 'force-dynamic';

export default async function NotePage({ params }: { params: { id: string } }) {
  const syncId = getSyncId();
  const notes = await getNotesBySyncId(syncId);
  const note = notes.find(n => n.id === params.id);

  if (!note) {
    notFound();
  }

  return <NoteDetailView note={note} syncId={syncId} />;
}