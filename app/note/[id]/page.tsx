import { notFound } from 'next/navigation';
import { supabase } from "@/lib/supabase";
import { getSyncId } from '@/lib/cookies';
import { NoteDetailView } from '@/components/note-detail-view';
import type { Note } from '@/types';

export const dynamic = 'force-dynamic';

async function getNote(syncId: string, id: string) {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('note_data, is_public')
      .eq('sync_id', syncId)
      .eq('note_data->>id', id)
      .single();
    
    if (error) throw error;
    return {
      note: data?.note_data as Note,
      isPublic: data?.is_public || false
    };
  } catch (error) {
    return null;
  }
}

export default async function NotePage({ params }: { params: { id: string } }) {
  const syncId = getSyncId();
  const noteData = await getNote(syncId, params.id);

  if (!noteData) {
    notFound();
  }

  return <NoteDetailView note={noteData.note} syncId={syncId} isPublic={noteData.isPublic} />;
}