import { Suspense } from "react";
import { NotesContainer } from "@/components/notes-container";
import { NotesTabs } from "@/components/notes-tabs";
import { NoteEditor } from "@/components/note-editor";
import { NotesListSkeleton } from "@/components/notes-list skeleton";
import { createClient } from "@/lib/supabase/server";
import { HeroSection } from "@/components/hero-section";

type SearchPageParams = {
  type?: 'all' | 'notes' | 'pinned';
}

export default async function Home({ searchParams }: { searchParams: SearchPageParams }) {
  const type = searchParams?.type || "all"

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const userId = user?.id

  if (!userId) return <HeroSection />

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-transparent border-b w-full justify-start rounded-none space-x-6 h-12">
        <NotesTabs currentTab={type} />
      </div>
      <div className="mb-6">
        <NoteEditor type={type} />
      </div>
      <Suspense fallback={<NotesListSkeleton />}>
        <NotesContainer type={type} userId={userId} />
      </Suspense>
    </div>
  );
}