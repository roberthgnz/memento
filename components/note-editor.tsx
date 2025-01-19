"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import { Bold, Italic, Underline as UnderlineIcon, List, Strikethrough, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NoteEditorProps {
  onSubmit: (content: string) => void;
  initialContent?: string;
  onCancel?: () => void;
  showCancelButton?: boolean;
}

export function NoteEditor({ 
  onSubmit, 
  initialContent = "", 
  onCancel, 
  showCancelButton = false 
}: NoteEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      BulletList,
      ListItem,
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'w-full min-h-[80px] focus:outline-none prose prose-sm max-w-none prose-yellow dark:prose-invert',
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editor?.getHTML()) {
      onSubmit(editor.getHTML());
      editor.commands.clearContent();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="bg-yellow-100/90 dark:bg-yellow-900/20 p-4 rounded-lg shadow-sm">
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
        <EditorContent editor={editor} />
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
          >
            {!showCancelButton && <Plus className="w-4 h-4 mr-2" />}
            {showCancelButton ? 'Save' : 'Add'}
          </Button>
        </div>
      </div>
    </form>
  );
}