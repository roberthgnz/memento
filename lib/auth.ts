"use client";

import { type Provider } from "@supabase/supabase-js";
import { createClient } from "./supabase/client";

const supabase = createClient()

export async function signInWithProvider(provider: Provider) {
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    throw error;
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}