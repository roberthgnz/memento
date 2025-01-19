import { Suspense } from "react";
import { NotesContainer } from "@/components/notes-container";
import { getSyncId } from "@/lib/cookies";
import { NotesTabs } from "@/components/notes-tabs";
import { NoteEditor } from "@/components/note-editor";
import { NotesListSkeleton } from "@/components/notes-list skeleton";

type SearchPageParams = {
  type?: 'all' | 'notes' | 'pinned';
}

export default async function Home({ searchParams }: { searchParams: SearchPageParams }) {
  const type = searchParams?.type || "all"

  const syncId = getSyncId();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-transparent border-b w-full justify-start rounded-none space-x-6 h-12">
          <NotesTabs currentTab={type} />
        </div>
        <div className="mb-6">
          <NoteEditor type={type} syncId={syncId} />
        </div>
        <Suspense fallback={<NotesListSkeleton />}>
          <NotesContainer type={type} syncId={syncId} />
        </Suspense>
      </div>
    </div>
  );
}