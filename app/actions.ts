"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { setSyncId } from "@/lib/cookies";
import { redirect } from "next/navigation";
import type { Note } from "@/types";

export async function createNote(syncId: string, note: Note) {
  try {
    const { error } = await supabase
      .from('notes')
      .insert([{
        sync_id: syncId,
        note_data: note,
        is_public: false
      }]);
    if (error) throw error;
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}

export async function updateNote(syncId: string, note: Note, isPublic?: boolean) {
  try {
    // First, find the existing record
    const { data: existingNote, error: findError } = await supabase
      .from('notes')
      .select()
      .eq('sync_id', syncId)
      .eq('note_data->>id', note.id)
      .single();

    if (findError) throw findError;

    const updateData = {
      note_data: note,
      ...(typeof isPublic === 'boolean' ? { is_public: isPublic } : {})
    };

    // If the note exists, update it
    if (existingNote) {
      const { error: updateError } = await supabase
        .from('notes')
        .update(updateData)
        .eq('sync_id', syncId)
        .eq('note_data->>id', note.id);

      if (updateError) throw updateError;
    } else {
      // If the note doesn't exist, insert it
      const { error: insertError } = await supabase
        .from('notes')
        .insert([{ 
          sync_id: syncId, 
          ...updateData
        }]);

      if (insertError) throw insertError;
    }

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}

export async function deleteNote(syncId: string, notes: Note[]) {
  try {
    const { error } = await supabase
      .from('notes')
      .upsert(
        notes.map(note => ({
          sync_id: syncId,
          note_data: note,
          is_public: false
        }))
      );
    if (error) throw error;
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}

export async function getNotesBySyncId(syncId: string) {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('note_data')
      .eq('sync_id', syncId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data?.map(row => row.note_data as Note) || [];
  } catch (error) {
    return [];
  }
}

export async function updateSyncId(newSyncId: string) {
  "use server";
  setSyncId(newSyncId);
  redirect('/');
}