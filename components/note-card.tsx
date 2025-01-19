"use client";

import { useState } from "react";
import { Pin, Trash2, ExternalLink, LoaderIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { NoteEditor } from "@/components/note-editor";
import type { Note } from "@/types";
import Link from "next/link";

interface NoteCardProps {
  note: Note;
  type: 'all' | 'notes' | 'pinned';
  onPin: (id: string, is_pinned: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isPending: boolean;
  pendingAction: 'pin' | 'delete' | 'update' | null;
}

export function NoteCard({ type, note, onPin, onDelete, isPending, pendingAction }: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div
      className={"rounded-lg p-4 relative group transition-colors"}
      style={{
        backgroundColor: note.color,
        filter: 'contrast(0.95) brightness(var(--note-brightness, 1))'
      }}
    >
      {isEditing ? (
        <NoteEditor
          type={type}
          noteId={note.id}
          initialContent={note.content}
          onCancel={() => setIsEditing(false)}
          onSave={() => setIsEditing(false)}
          isEditing={isEditing}
          showCancelButton
        />
      ) : (
        <>
          <div
            className="text-zinc-800 dark:text-zinc-900 mb-3 cursor-pointer prose prose-sm max-w-none [&>pre]:truncate [&>pre]:max-h-[80px] [&>pre>code]:truncate"
            dangerouslySetInnerHTML={{ __html: note.content }}
            onClick={() => setIsEditing(true)}
          />
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-600 dark:text-zinc-700">
              {format(new Date(note.created_at), 'MMM d, yyyy')}
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
                onClick={() => onPin(note.id, !note.is_pinned)}
                disabled={isPending}
              >
                {isPending && pendingAction === 'pin' ? (
                  <LoaderIcon className="size-4 animate-spin" />
                ) : (
                  <Pin className={`size-4 ${note.is_pinned ? 'fill-current' : ''}`} />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 dark:text-red-700 dark:hover:text-red-800"
                onClick={() => onDelete(note.id)}
                disabled={isPending}
              >
                {isPending && pendingAction === 'delete' ? (
                  <LoaderIcon className="size-4 animate-spin" />
                ) : (
                  <Trash2 className="size-4" />
                )}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}