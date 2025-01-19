"use client";

import { useState, useTransition } from "react";
import { Pin, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { NoteEditor } from "@/components/note-editor";
import type { Note } from "@/types";
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();

  const handleUpdate = async (content: string) => {
    startTransition(async () => {
      try {
        await onUpdate(note.id, content);
        setIsEditing(false);
        toast({
          title: "Note updated",
          description: "Your changes have been saved.",
        });
      } catch (error) {
        toast({
          title: "Update failed",
          description: "Could not save your changes.",
          variant: "destructive",
        });
      }
    });
  };

  const handlePin = () => {
    startTransition(async () => {
      try {
        await onPin(note.id);
      } catch (error) {
        toast({
          title: "Action failed",
          description: "Could not pin/unpin the note.",
          variant: "destructive",
        });
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await onDelete(note.id);
        toast({
          title: "Note deleted",
          description: "Your note has been removed.",
        });
      } catch (error) {
        toast({
          title: "Delete failed",
          description: "Could not delete the note.",
          variant: "destructive",
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
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handlePin}
                disabled={isPending}
              >
                <Pin className={`h-4 w-4 ${note.isPinned ? 'fill-current' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 dark:text-red-700 dark:hover:text-red-800"
                onClick={handleDelete}
                disabled={isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}