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

export async function updateNote(noteId: string, note: Partial<Note>) {
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

export async function getNotesBySyncId(syncId: string, type: 'all' | 'notes' | 'pinned') {
  try {
    let query = supabase
      .from('notes')
      .select('*')
      .eq('sync_id', syncId); 

    if (type === 'notes') {
      query = query.eq('is_pinned', false); 
    } else if (type === 'pinned') {
      query = query.eq('is_pinned', true); 
    }

    const { error, data } = await query;

    if (error) throw error;

    return data as Note[];
  } catch (error) {
    console.error('Error fetching notes:', error);
    return [];
  }
}

export async function updateSyncId(newSyncId: string) {
  "use server";
  setSyncId(newSyncId);
  redirect('/');
}