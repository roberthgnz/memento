"use client";

import { useState, useTransition } from "react";
import { Pin, Trash2, ExternalLink, LoaderIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { NoteEditor } from "@/components/note-editor";
import type { Note } from "@/types";
import { toast } from "sonner";
import Link from "next/link";

interface NoteCardProps {
  note: Note;
  onPin: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, content: string) => Promise<void>;
}

export function NoteCard({ note, onPin, onDelete, onUpdate }: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleUpdate = async (content: string) => {
    startTransition(async () => {
      try {
        await onUpdate(note.id, content);
        setIsEditing(false);
         toast.success("Note updated", {
          description: "Your changes have been saved.",
        });
      } catch (error) {
         toast.error("Update failed", {
          description: "Could not save your changes.",
        });
      }
    });
  };

  const handlePin = () => {
    startTransition(async () => {
      try {
        await onPin(note.id);
      } catch (error) {
       toast.error("Action failed", {
          description: "Could not pin/unpin the note.",
        });
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await onDelete(note.id);
        toast.success("Note deleted", {
          description: "Your note has been removed.",
        });
      } catch (error) {
         toast.error("Delete failed", {
          description: "Could not delete the note.",
        });
      }
    });
  };

  return (
    <div
      className="rounded-lg p-4 relative group transition-colors"
      style={{ 
        backgroundColor: note.color,
        filter: 'contrast(0.95) brightness(var(--note-brightness, 1))'
      }}
    >
      {isEditing ? (
        <NoteEditor
          initialContent={note.content}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
          showCancelButton
        />
      ) : (
        <>
          <div 
            className="text-zinc-800 dark:text-zinc-900 mb-3 cursor-pointer prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: note.content }}
            style={{ direction: 'ltr', unicodeBidi: 'bidi-override' }}
            onClick={() => setIsEditing(true)}
          />
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-600 dark:text-zinc-700">
              {format(new Date(note.date), 'MMM d, yyyy')}
            </span>
            <div className="flex items-center space-x-2">
              <Link href={`/note/${note.id}`}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ExternalLink className="size-4" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handlePin}
                disabled={isPending}
              >
                {isPending ? <LoaderIcon className="size-4 animate-spin" /> : <Pin className={`size-4 ${note.isPinned ? 'fill-current' : ''}`} />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 dark:text-red-700 dark:hover:text-red-800"
                onClick={handleDelete}
                disabled={isPending}
              >
                {isPending ? <LoaderIcon className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}