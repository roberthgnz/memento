import { getNotesBySyncId } from "@/app/actions";
import { NotesList } from "./notes-list";

interface NotesContainerProps {
  type: 'all' | 'notes' | 'pinned';
  syncId: string;
}

export async function NotesContainer({ type, syncId }: NotesContainerProps) {
  const notes = await getNotesBySyncId(syncId, type);

  return <NotesList notes={notes} type={type} syncId={syncId} />;
}