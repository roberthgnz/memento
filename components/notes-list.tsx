"use client";

import { useState, useTransition } from "react";
import { NoteCard } from "@/components/note-card";
import type { GroupedNotes } from "@/types";
import { updateNote, deleteNote } from "@/app/actions";
import { toast } from "sonner";
import { redirect } from "next/navigation";

interface NotesContainerProps {
    groups: GroupedNotes[];
    type: 'all' | 'notes' | 'pinned';
}

export function NotesList({ groups, type }: NotesContainerProps) {
    const [isPending, startTransition] = useTransition();
    const [pendingAction, setPendingAction] = useState<'pin' | 'delete' | 'update' | null>(null);

    const handleTogglePin = async (id: string, is_pinned: boolean) => {
        setPendingAction('pin');
        startTransition(async () => {
            try {
                const result = await updateNote(id, { is_pinned });
                if (!result.success) {
                    throw result.error
                }
            } catch (error) {
                toast.error("Action failed", {
                    description: "Could not pin/unpin the note.",
                });
            } finally {
                setPendingAction(null);
                redirect(`/?type=${type}`);
            }
        });
    };

    const handleDeleteNote = async (id: string) => {
        setPendingAction('delete');
        startTransition(async () => {
            try {
                const result = await deleteNote(id);
                if (!result.success) {
                    throw result.error
                }
            } catch (error) {
                toast.error("Delete failed", {
                    description: "Could not delete the note.",
                });
            } finally {
                setPendingAction(null);
                redirect(`/?type=${type}`);
            }
        });
    };

    return (
        <div className="space-y-4">
            {groups.map(({ label, notes }) => (
                <div key={label} className="space-y-2">
                    <div className="text-sm text-muted-foreground font-medium">{label}</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {notes.map(note => (
                            <NoteCard
                                key={note.id}
                                type={type}
                                note={note}
                                isPending={isPending}
                                pendingAction={pendingAction}
                                onPin={handleTogglePin}
                                onDelete={handleDeleteNote}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}