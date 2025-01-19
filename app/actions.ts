"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { setSyncId } from "@/lib/cookies";
import { redirect } from "next/navigation";
import type { Note } from "@/types";

export async function createNote(note: Partial<Note>) {
  try {
    const { error, data } = await supabase
      .from('notes')
      .insert([note]).select().order('created_at', { ascending: false });

    if (error) throw error;
    revalidatePath('/');
    
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}

export async function updateNote(noteId: string, note: Note) {
  try {
    const { error } = await supabase
      .from('notes')
      .update(note)
      .eq('id', noteId);

    if (error) throw error;
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}

export async function deleteNote(noteId: string) {
  try {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', noteId);

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
      .select('*')
      .eq('sync_id', syncId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data as Note[];
  } catch (error) {
    return [];
  }
}

export async function updateSyncId(newSyncId: string) {
  "use server";
  setSyncId(newSyncId);
  redirect('/');
}