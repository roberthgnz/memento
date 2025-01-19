"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import BulletList from '@tiptap/extension-bullet-list';
import { Bold, Italic, Underline as UnderlineIcon, List, Strikethrough, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from 'react';
import { getRandomColor } from '@/lib/utils';
import { createNote, updateNote } from '@/app/actions';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';

interface NoteEditorProps {
  type: 'all' | 'notes' | 'pinned';
  initialContent?: string;
  noteId?: string;
  isEditing?: boolean;
  onCancel?: () => void;
  onSave?: () => void;
  showCancelButton?: boolean;
}

export function NoteEditor({
  type,
  initialContent = "",
  noteId,
  isEditing = false,
  onCancel,
  onSave,
  showCancelButton = false
}: NoteEditorProps) {
  const [isPending, startTransition] = useTransition();

  const [content, setContent] = useState(initialContent);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      BulletList,
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'w-full min-h-[80px] focus:outline-none prose prose-sm max-w-none prose-yellow dark:prose-invert',
      },
    },
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML() as string);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editor?.getHTML()) {
      if (isEditing) {
        handleUpdate(content);
      } else {
        handleCreate(content);
        editor.commands.clearContent();
      }
      onSave?.();
    }
  };

  const handleCreate = async (content: string) => {
    const newNote = {
      content,
      is_public: false,
      is_pinned: type === 'pinned',
      color: getRandomColor(),
    };
    startTransition(async () => {
      try {
        const result = await createNote(newNote);
        if (!result.success) {
          throw result.error;
        }
        toast.success("Note created", {
          description: "Your note has been added.",
        });
      } catch (error) {
        toast.error("Creation failed", {
          description: "Could not create the note.",
        });
      } finally {
        if (!isEditing) {
          redirect(`/?type=${type}`);
        }
      }
    });
  };

  const handleUpdate = async (content: string) => {
    startTransition(async () => {
      try {

        const result = await updateNote(noteId as string, { content });
        if (!result.success) {
          throw result.error;
        }
        toast.success("Note updated", {
          description: "Your changes have been saved.",
        });
      } catch (error) {
        toast.error("Update failed", {
          description: "Could not save your changes.",
        });
      } finally {
        if (!isEditing) {
          redirect(`/?type=${type}`);
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="bg-yellow-100/90 dark:bg-yellow-900/20 p-4 rounded-lg shadow-sm size-full">
        <div className="flex gap-1 mb-2 border-b pb-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            data-active={editor?.isActive('bold')}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            data-active={editor?.isActive('italic')}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
            data-active={editor?.isActive('underline')}
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => editor?.chain().focus().toggleStrike().run()}
            data-active={editor?.isActive('strike')}
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
          <div className="w-px h-8 bg-yellow-200 dark:bg-yellow-800 mx-1" />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            data-active={editor?.isActive('bulletList')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
        <div className='min-h-[80px]'>
          <EditorContent editor={editor} />
        </div>
        <div className="flex justify-end mt-2 space-x-2">
          {showCancelButton && onCancel && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={onCancel}
              className="text-red-600"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            size="sm"
            className="bg-transparent hover:bg-yellow-200/50 dark:hover:bg-yellow-800/30 text-yellow-800 dark:text-yellow-200"
            disabled={isPending || !content}
          >
            {!showCancelButton && <Plus className="w-4 h-4 mr-2" />}
            {showCancelButton ? 'Save' : 'Add'}
          </Button>
        </div>
      </div>
    </form>
  );
}