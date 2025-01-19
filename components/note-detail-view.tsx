"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit2, Save, Share2, Copy } from 'lucide-react';
import Link from 'next/link';
import { NoteEditor } from '@/components/note-editor';
import { updateNote } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import type { Note } from '@/types';

interface NoteDetailViewProps {
  note: Note;
  syncId: string;
  isPublic: boolean;
}

export function NoteDetailView({ note, syncId, isPublic }: NoteDetailViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const handleUpdate = async (content: string) => {
    try {
      const updatedNote = { ...note, content, date: new Date() };
      const result = await updateNote(syncId, updatedNote, isPublic);
      
      if (result.success) {
        setIsEditing(false);
        toast({
          title: "Note updated",
          description: "Your changes have been saved.",
        });
      } else {
        throw new Error("Failed to update note");
      }
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Could not save your changes.",
        variant: "destructive",
      });
    }
  };

  const togglePublic = async () => {
    try {
      const result = await updateNote(syncId, note, !isPublic);
      
      if (result.success) {
        toast({
          title: isPublic ? "Note made private" : "Note made public",
          description: isPublic 
            ? "Your note is no longer publicly accessible."
            : "Your note can now be accessed via a public link.",
        });
      } else {
        throw new Error("Failed to update note");
      }
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Could not update sharing settings.",
        variant: "destructive",
      });
    }
  };

  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}/share/${note.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copied",
      description: "Share link has been copied to clipboard.",
    });
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <Link href="/">
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Notes
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={togglePublic}
            >
              <Share2 className="w-4 h-4 mr-2" />
              {isPublic ? 'Make Private' : 'Make Public'}
            </Button>
            {isPublic && (
              <Button
                variant="outline"
                onClick={copyShareLink}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </>
              )}
            </Button>
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
              initialContent={note.content}
              onSubmit={handleUpdate}
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
    </div>
  );
}