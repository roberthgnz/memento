"use client";

import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Note } from "@/app/page";

interface StickyNoteProps {
  note: Note;
  onUpdate: (id: string, updates: Partial<Note>) => void;
  onDelete: (id: string) => void;
}

export function StickyNote({ note, onUpdate, onDelete }: StickyNoteProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(note.position);
  const noteRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const dx = e.clientX - dragStartPos.current.x;
      const dy = e.clientY - dragStartPos.current.y;

      const container = noteRef.current?.parentElement;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const noteRect = noteRef.current?.getBoundingClientRect();
      
      if (!noteRect) return;

      const maxX = (containerRect.width - noteRect.width) / containerRect.width * 100;
      const maxY = (containerRect.height - noteRect.height) / containerRect.height * 100;

      const newX = Math.max(0, Math.min(maxX, position.x + (dx / containerRect.width) * 100));
      const newY = Math.max(0, Math.min(maxY, position.y + (dy / containerRect.height) * 100));

      setPosition({ x: newX, y: newY });
      dragStartPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        onUpdate(note.id, { position });
      }
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, note.id, onUpdate, position]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsDragging(true);
      dragStartPos.current = { x: e.clientX, y: e.clientY };
    }
  };

  return (
    <div
      ref={noteRef}
      style={{
        position: "absolute",
        left: `${position.x}%`,
        top: `${position.y}%`,
        backgroundColor: note.color,
      }}
      className="w-64 rounded-lg shadow-lg cursor-move transition-shadow hover:shadow-xl"
      onMouseDown={handleMouseDown}
    >
      <div className="p-2 flex justify-end">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => onDelete(note.id)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <Textarea
        value={note.content}
        onChange={(e) => onUpdate(note.id, { content: e.target.value })}
        className="min-h-[150px] bg-transparent border-none focus-visible:ring-0 resize-none"
        placeholder="Type your note here..."
      />
    </div>
  );
}