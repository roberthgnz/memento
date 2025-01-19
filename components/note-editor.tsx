"use client";

import { useRef } from "react";
import { Bold, Italic, Underline, List, Strikethrough, Plus } from "lucide-react";
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
  const editorRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editorRef.current?.innerHTML.trim()) {
      onSubmit(editorRef.current.innerHTML);
      if (editorRef.current) {
        editorRef.current.innerHTML = "";
      }
    }
  };

  const formatText = (command: string) => {
    document.execCommand(command, false);
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
            onClick={() => formatText('bold')}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => formatText('italic')}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => formatText('underline')}
          >
            <Underline className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => formatText('strikeThrough')}
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
          <div className="w-px h-8 bg-yellow-200 dark:bg-yellow-800 mx-1" />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => formatText('insertUnorderedList')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
        <div
          ref={editorRef}
          contentEditable
          className="w-full min-h-[80px] focus:outline-none empty:before:content-[attr(placeholder)] empty:before:text-yellow-800/50 dark:empty:before:text-yellow-200/50"
          placeholder="Add note..."
          dangerouslySetInnerHTML={{ __html: initialContent }}
          style={{ direction: 'ltr', unicodeBidi: 'bidi-override' }}
        />
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