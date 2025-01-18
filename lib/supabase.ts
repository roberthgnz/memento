import { createClient } from '@supabase/supabase-js';
import type { Note } from '@/app/page';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function syncNotes(syncId: string, notes: Note[]) {
  const { error } = await supabase
    .from('notes')
    .upsert(
      notes.map(note => ({
        sync_id: syncId,
        note_data: note
      }))
    );
  
  if (error) throw error;
}

export async function getNotes(syncId: string) {
  const { data, error } = await supabase
    .from('notes')
    .select('note_data')
    .eq('sync_id', syncId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data?.map(row => row.note_data as Note) || [];
}