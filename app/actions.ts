"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { setSyncId } from "@/lib/cookies";
import { redirect } from "next/navigation";
import type { Note } from "@/types";

export async function createNote(syncId: string, note: Note) {
  try {
    await supabase
      .from('notes')
      .upsert([{
        sync_id: syncId,
        note_data: note
      }]);
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}

export async function updateNote(syncId: string, notes: Note[]) {
  try {
    await supabase
      .from('notes')
      .upsert(
        notes.map(note => ({
          sync_id: syncId,
          note_data: note
        }))
      );
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}

export async function deleteNote(syncId: string, notes: Note[]) {
  try {
    await supabase
      .from('notes')
      .upsert(
        notes.map(note => ({
          sync_id: syncId,
          note_data: note
        }))
      );
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