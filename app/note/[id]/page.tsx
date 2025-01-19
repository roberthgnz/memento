import { notFound } from 'next/navigation';
import { NoteDetailView } from '@/components/note-detail-view';
import type { Note } from '@/types';
import { createClient } from '@/lib/supabase/server';

async function getNote(id: string) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser()
    const userId = user!.id

    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
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
  const note = await getNote(params.id);

  if (!note) {
    notFound();
  }

  return <NoteDetailView note={note} />;
}