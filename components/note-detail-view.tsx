"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit2, Save, Copy, EyeOffIcon, EyeIcon } from 'lucide-react';
import Link from 'next/link';
import { NoteEditor } from '@/components/note-editor';
import { updateNote } from '@/app/actions';
import { toast } from "sonner";
import type { Note } from '@/types';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface NoteDetailViewProps {
  note: Note;
}

export function NoteDetailView({ note }: NoteDetailViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const togglePublic = async () => {
    try {
      setIsUpdating(true);
      const result = await updateNote(note.id, { is_public: !note.is_public });
      if (!result.success) {
        throw result.error;
      }
      toast.success(note.is_public ? "Note made private" : "Note made public", {
        description: note.is_public
          ? "Your note is no longer publicly accessible."
          : "Your note can now be accessed via a public link.",
      });
    } catch (error) {
      toast.error("Update failed", {
        description: "Could not update sharing settings.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const copyShareLink = async () => {
    const shareUrl = `${window.location.origin}/share/${note.id}`;
    await navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied", {
      description: "Share link has been copied to clipboard.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <Link href="/">
          <Button variant="ghost">
            <ArrowLeft className="size-4 mr-2" />
            Back
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size={'icon'}
                  onClick={togglePublic}
                  disabled={isUpdating}
                >
                  {note.is_public ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{note.is_public ? "Make private" : "Make public"}</p>
              </TooltipContent>
            </Tooltip>
            {note.is_public && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size={'icon'}
                    onClick={copyShareLink}
                    disabled={isUpdating}
                  >
                    <Copy className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy share link</p>
                </TooltipContent>
              </Tooltip>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size={'icon'}
                  onClick={() => setIsEditing(!isEditing)}
                  disabled={isUpdating}
                >
                  {isEditing ? (
                    <>
                      <Save className="size-4" />
                    </>
                  ) : (
                    <>
                      <Edit2 className="size-4" />
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isEditing ? "Save changes" : "Edit note"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div
        className="rounded-lg"
        style={{
          backgroundColor: note.color,
          filter: 'contrast(0.95) brightness(var(--note-brightness, 1))'
        }}
      >
        {isEditing ? (
          <NoteEditor
            noteId={note.id}
            type={note.is_pinned ? "pinned" : "notes"}
            initialContent={note.content}
            isEditing={isEditing}
            onCancel={() => setIsEditing(false)}
            showCancelButton
          />
        ) : (
          <div className="p-4">
            <div
              className="text-zinc-800 dark:text-zinc-900 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: note.content }}
            />
          </div>
        )}
      </div>
    </div>
  );
}