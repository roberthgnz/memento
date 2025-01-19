"use client";

import { useState, useTransition } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NoteEditor } from "@/components/note-editor";
import { NoteCard } from "@/components/note-card";
import { generateId, getRandomColor } from "@/lib/utils";
import type { Note } from "@/types";
import { createNote, updateNote, deleteNote } from "@/app/actions";
import { toast } from "sonner";

interface NotesContainerProps {
  initialNotes: Note[];
  syncId: string;
}

export function NotesContainer({ initialNotes, syncId }: NotesContainerProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [isPending, startTransition] = useTransition();
  const [pendingAction, setPendingAction] = useState<'pin' | 'delete' | 'update' | null>(null);

  const handleCreateNote = async (content: string) => {
    const newNote: Note = {
      id: generateId(),
      content,
      color: getRandomColor(),
      date: new Date(),
      isPinned: false,
    };

    startTransition(async () => {
      try {
        const result = await createNote(syncId, newNote);
        if (result.success) {
          setNotes(prev => [newNote, ...prev]);
          toast.success("Note created", {
            description: "Your note has been added.",
          });
        } else {
          throw new Error("Failed to create note");
        }
      } catch (error) {
        toast.error("Creation failed", {
          description: "Could not create the note.",
        });
      }
    });
  };

  const handleUpdateNote = async (id: string, content: string) => {
    const noteToUpdate = notes.find(note => note.id === id);
    if (!noteToUpdate) return;

    const updatedNote = { ...noteToUpdate, content, date: new Date() };

    setPendingAction('update');
    startTransition(async () => {
      try {
        const result = await updateNote(syncId, updatedNote);
        if (result.success) {
          setNotes(prev => prev.map(note =>
            note.id === id ? updatedNote : note
          ));
        } else {
          throw new Error("Failed to update note");
        }
      } catch (error) {
        toast.error("Update failed", {
          description: "Could not update the note.",
        });
      } finally {
        setPendingAction(null);
      }
    });
  };

  const handleTogglePin = async (id: string) => {
    const noteToUpdate = notes.find(note => note.id === id);
    if (!noteToUpdate) return;

    const updatedNote = { ...noteToUpdate, isPinned: !noteToUpdate.isPinned };

    setPendingAction('pin');
    startTransition(async () => {
      try {
        const result = await updateNote(syncId, updatedNote);
        if (result.success) {
          setNotes(prev => prev.map(note =>
            note.id === id ? updatedNote : note
          ));
        } else {
          throw new Error("Failed to update note");
        }
      } catch (error) {
        toast.error("Action failed", {
          description: "Could not pin/unpin the note.",
        });
      } finally {
        setPendingAction(null);
      }
    });
  };

  const handleDeleteNote = async (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);

    setPendingAction('delete');
    startTransition(async () => {
      try {
        const result = await deleteNote(id);
        if (result.success) {
          setNotes(updatedNotes);
        } else {
          throw new Error("Failed to delete note");
        }
      } catch (error) {
        toast.error("Delete failed", {
          description: "Could not delete the note.",
        });
      } finally {
        setPendingAction(null);
      }
    });
  };

  const pinnedNotes = notes.filter(note => note.isPinned);
  const unpinnedNotes = notes.filter(note => !note.isPinned);

  return (
    <Tabs defaultValue="all" className="space-y-4">
      <TabsList className="bg-transparent border-b w-full justify-start rounded-none space-x-6 h-12">
        <TabsTrigger
          value="all"
          className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
        >
          All
        </TabsTrigger>
        <TabsTrigger
          value="notes"
          className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
        >
          Notes
        </TabsTrigger>
        <TabsTrigger
          value="pinned"
          className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
        >
          Pinned
        </TabsTrigger>
      </TabsList>

      <div className="mb-6">
        <NoteEditor onSubmit={handleCreateNote} />
      </div>

      <div className="space-y-2">
        <div className="text-sm text-muted-foreground font-medium">TODAY</div>
        <TabsContent value="all" className="space-y-3 mt-2">
          {[...pinnedNotes, ...unpinnedNotes].map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onPin={handleTogglePin}
              onDelete={handleDeleteNote}
              onUpdate={handleUpdateNote}
              isPending={isPending}
              pendingAction={pendingAction}
            />
          ))}
        </TabsContent>
        <TabsContent value="notes" className="space-y-3 mt-2">
          {unpinnedNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onPin={handleTogglePin}
              onDelete={handleDeleteNote}
              onUpdate={handleUpdateNote}
              isPending={isPending}
              pendingAction={pendingAction}
            />
          ))}
        </TabsContent>
        <TabsContent value="pinned" className="space-y-3 mt-2">
          {pinnedNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onPin={handleTogglePin}
              onDelete={handleDeleteNote}
              onUpdate={handleUpdateNote}
              isPending={isPending}
              pendingAction={pendingAction}
            />
          ))}
        </TabsContent>
      </div>
    </Tabs>
  );
}