import { Suspense } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { SyncDialog } from "@/components/sync-dialog";
import { NotesContainer } from "@/components/notes-container";
import { getNotesBySyncId, updateSyncId } from "./actions";
import { getSyncId } from "@/lib/cookies";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const syncId = getSyncId();
  const initialNotes = await getNotesBySyncId(syncId);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <ThemeToggle />
      <div className="max-w-2xl mx-auto p-4">
        <Suspense fallback={<div>Loading notes...</div>}>
          <NotesContainer initialNotes={initialNotes} syncId={syncId} />
        </Suspense>
      </div>
      <SyncDialog syncId={syncId} onSync={updateSyncId} />
    </main>
  );
}