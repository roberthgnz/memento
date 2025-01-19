import { notFound } from 'next/navigation';
import type { Note } from '@/types';
import { createClient } from '@/lib/supabase/server';

async function getPublicNote(id: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('id', id)
      .eq('is_public', true)
      .single();

    if (error) throw error;

    if (!data) return null;

    return data as Note;
  } catch (error) {
    return null;
  }
}

export default async function SharedNotePage({ params }: { params: { id: string } }) {
  const note = await getPublicNote(params.id);

  if (!note) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <p className="text-sm text-muted-foreground font-medium">
        Created on{' '} {new Date(note.created_at).toLocaleDateString()}{' '}
      </p>
      <div
        className="rounded-lg p-4"
        style={{
          backgroundColor: note.color,
          filter: 'contrast(0.95) brightness(var(--note-brightness, 1))'
        }}
      >
        <div
          className="text-zinc-800 dark:text-zinc-900 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: note.content }}
        />
      </div>
    </div>
  );
}