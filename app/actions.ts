"use server";

import { revalidatePath } from "next/cache";
import type { Note } from "@/types";
import { createClient } from "@/lib/supabase/server";

export async function createNote(note: Partial<Note>) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    const { error, data } = await supabase
      .from('notes')
      .insert([{ ...note, user_id: user?.id }]).select().order('created_at', { ascending: false });

    if (error) throw error;
    revalidatePath('/');

    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}

export async function updateNote(noteId: string, note: Partial<Note>) {
  try {
    const supabase = await createClient();
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
    const supabase = await createClient();
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

export async function getNotesByUserId(userId: string, type: 'all' | 'notes' | 'pinned') {
  try {
    const supabase = await createClient();
    let query = supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId);

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