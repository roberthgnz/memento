"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Pin, Trash2, Bold, Italic, Underline, List, Image, Strikethrough as StrikeThrough } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateId, getRandomColor } from "@/lib/utils";
import { format } from "date-fns";
import { ThemeToggle } from "@/components/theme-toggle";
import { SyncDialog } from "@/components/sync-dialog";
import { supabase, syncNotes, getNotes } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export type Note = {
  id: string;
  content: string;
  color: string;
  date: Date;
  isPinned: boolean;
};

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [syncId, setSyncId] = useState(() => generateId());
  const { toast } = useToast();
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const channel = supabase
      .channel(`notes_${syncId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notes',
          filter: `sync_id=eq.${syncId}`,
        },
        async () => {
          const updatedNotes = await getNotes(syncId);
          setNotes(updatedNotes);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [syncId]);

  useEffect(() => {
    const savedSyncId = localStorage.getItem('noteSyncId');
    if (savedSyncId) {
      setSyncId(savedSyncId);
      getNotes(savedSyncId).then(setNotes);
    } else {
      localStorage.setItem('noteSyncId', syncId);
    }
  }, []);

  const handleSync = async (code: string) => {
    try {
      const newNotes = await getNotes(code);
      setNotes(newNotes);
      setSyncId(code);
      localStorage.setItem('noteSyncId', code);
      toast({
        title: "Sync successful!",
        description: "Your notes have been synchronized.",
      });
    } catch (error) {
      toast({
        title: "Sync failed",
        description: "Could not sync with the provided code.",
        variant: "destructive",
      });
    }
  };

  const createNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;

    const newNote: Note = {
      id: generateId(),
      content: newNoteContent,
      color: getRandomColor(),
      date: new Date(),
      isPinned: false,
    };

    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    setNewNoteContent("");
    
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }

    try {
      await syncNotes(syncId, updatedNotes);
    } catch (error) {
      toast({
        title: "Sync failed",
        description: "Could not sync your new note.",
        variant: "destructive",
      });
    }
  };

  const togglePin = async (id: string) => {
    const updatedNotes = notes.map(note => 
      note.id === id ? { ...note, isPinned: !note.isPinned } : note
    );
    setNotes(updatedNotes);
    
    try {
      await syncNotes(syncId, updatedNotes);
    } catch (error) {
      toast({
        title: "Sync failed",
        description: "Could not sync your changes.",
        variant: "destructive",
      });
    }
  };

  const deleteNote = async (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    
    try {
      await syncNotes(syncId, updatedNotes);
    } catch (error) {
      toast({
        title: "Sync failed",
        description: "Could not sync your deletion.",
        variant: "destructive",
      });
    }
  };

  const formatText = (command: string) => {
    document.execCommand(command, false);
  };

  const handleNoteInput = (e: React.FormEvent<HTMLDivElement>) => {
    const content = e.currentTarget.innerHTML;
    setNewNoteContent(content);
  };

  const pinnedNotes = notes.filter(note => note.isPinned);
  const unpinnedNotes = notes.filter(note => !note.isPinned);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <ThemeToggle />
      <div className="max-w-2xl mx-auto p-4">
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

          <form onSubmit={createNote} className="mb-6">
            <div 
              className="bg-yellow-100/90 dark:bg-yellow-900/20 p-4 rounded-lg shadow-sm"
              style={{ minHeight: '100px' }}
            >
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
                  <StrikeThrough className="h-4 w-4" />
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
                onInput={handleNoteInput}
                style={{ direction: 'ltr', unicodeBidi: 'bidi-override' }}
              />
              <div className="flex justify-end mt-2">
                <Button 
                  type="submit"
                  size="sm"
                  className="bg-transparent hover:bg-yellow-200/50 dark:hover:bg-yellow-800/30 text-yellow-800 dark:text-yellow-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>
          </form>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground font-medium">TODAY</div>
            <TabsContent value="all" className="space-y-3 mt-2">
              {[...pinnedNotes, ...unpinnedNotes].map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onPin={togglePin}
                  onDelete={deleteNote}
                />
              ))}
            </TabsContent>
            <TabsContent value="notes" className="space-y-3 mt-2">
              {unpinnedNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onPin={togglePin}
                  onDelete={deleteNote}
                />
              ))}
            </TabsContent>
            <TabsContent value="pinned" className="space-y-3 mt-2">
              {pinnedNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onPin={togglePin}
                  onDelete={deleteNote}
                />
              ))}
            </TabsContent>
          </div>
        </Tabs>
      </div>
      <SyncDialog syncId={syncId} onSync={handleSync} />
    </main>
  );
}

function NoteCard({ 
  note, 
  onPin, 
  onDelete 
}: { 
  note: Note; 
  onPin: (id: string) => void; 
  onDelete: (id: string) => void; 
}) {
  return (
    <div
      className="rounded-lg p-4 relative group transition-colors"
      style={{ 
        backgroundColor: note.color,
        filter: 'contrast(0.95) brightness(var(--note-brightness, 1))'
      }}
    >
      <div 
        className="text-zinc-800 dark:text-zinc-900 mb-3"
        dangerouslySetInnerHTML={{ __html: note.content }}
        style={{ direction: 'ltr', unicodeBidi: 'bidi-override' }}
      />
      <div className="flex items-center justify-between">
        <span className="text-sm text-zinc-600 dark:text-zinc-700">
          {format(new Date(note.date), 'MMM d, yyyy')}
        </span>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onPin(note.id)}
          >
            <Pin className={`h-4 w-4 ${note.isPinned ? 'fill-current' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 dark:text-red-700 dark:hover:text-red-800"
            onClick={() => onDelete(note.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}