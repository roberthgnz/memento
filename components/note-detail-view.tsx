"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit2, Save } from 'lucide-react';
import Link from 'next/link';
import { NoteEditor } from '@/components/note-editor';
import { updateNote } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import type { Note } from '@/types';

interface NoteDetailViewProps {
  note: Note;
  syncId: string;
}

export function NoteDetailView({ note, syncId }: NoteDetailViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const handleUpdate = async (content: string) => {
    try {
      const updatedNote = { ...note, content, date: new Date() };
      const result = await updateNote(syncId, updatedNote);
      
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