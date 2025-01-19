import { notFound } from 'next/navigation';
import { supabase } from "@/lib/supabase";
import type { Note } from '@/types';

export const dynamic = 'force-dynamic';

async function getPublicNote(id: string) {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('id, content, color, created_at, is_pinned')
      .eq('id', id)
      .eq('is_public', true)
      .single();
    
    if (error) throw error;
    
    if (!data) return null;

    return {
      id: data.id,
      content: data.content,
      color: data.color,
      date: data.created_at,
      isPinned: data.is_pinned
    } as Note;
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
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
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
    </div>
  );
}