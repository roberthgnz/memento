import { notFound } from 'next/navigation';
import { supabase } from "@/lib/supabase";
import { getSyncId } from '@/lib/cookies';
import { NoteDetailView } from '@/components/note-detail-view';
import type { Note } from '@/types';

async function getNote(syncId: string, id: string) {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('sync_id', syncId)
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) return null;

    return data as Note;
  } catch (error) {
    return null;
  }
}

export default async function NotePage({ params }: { params: { id: string } }) {
  const syncId = getSyncId();
  const note = await getNote(syncId, params.id);

  if (!note) {
    notFound();
  }

  return <NoteDetailView syncId={syncId} note={note} />;
}