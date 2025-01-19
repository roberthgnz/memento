import { getNotesBySyncId } from "@/app/actions";
import { NotesList } from "./notes-list";

import { format, isToday, isYesterday, isThisWeek, isThisMonth } from "date-fns";
import { Note, GroupedNotes } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NotesContainerProps {
  type: 'all' | 'notes' | 'pinned';
  syncId: string;
}

function groupNotesByDate(notes: Note[]): GroupedNotes[] {
  return notes.reduce((groups: GroupedNotes[], note) => {
    let label = '';

    const date = new Date(note.created_at);
    if (isToday(date)) {
      label = 'TODAY';
    } else if (isYesterday(date)) {
      label = 'YESTERDAY';
    } else if (isThisWeek(date)) {
      label = 'THIS WEEK';
    } else if (isThisMonth(date)) {
      label = 'THIS MONTH';
    } else {
      label = format(date, 'MMMM yyyy').toUpperCase();
    }

    const existingGroup = groups.find(group => group.label === label);
    if (existingGroup) {
      existingGroup.notes.push(note);
    } else {
      groups.push({ label, notes: [note] });
    }

    return groups;
  }, []);
}

export async function NotesContainer({ type, syncId }: NotesContainerProps) {
  const notes = await getNotesBySyncId(syncId, type);

  const grouped = groupNotesByDate(notes).sort((a, b) => {
    if (a.label === 'TODAY') return -1;
    if (b.label === 'TODAY') return 1;
    if (a.label === 'YESTERDAY') return -1;
    if (b.label === 'YESTERDAY') return 1;
    if (a.label === 'THIS WEEK') return -1;
    if (b.label === 'THIS WEEK') return 1;
    if (a.label === 'THIS MONTH') return -1;
    if (b.label === 'THIS MONTH') return 1;
    return 0;
  });

  return <ScrollArea className="h-[60vh] [&>div]:px-2">
    <NotesList groups={grouped} type={type} />
  </ScrollArea>

}