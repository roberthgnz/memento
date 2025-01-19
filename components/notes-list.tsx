"use client";

import { useState, useTransition } from "react";
import { NoteEditor } from "@/components/note-editor";
import { NoteCard } from "@/components/note-card";
import { getRandomColor } from "@/lib/utils";
import type { GroupedNotes } from "@/types";
import { createNote, updateNote, deleteNote } from "@/app/actions";
import { toast } from "sonner";
import { redirect } from "next/navigation";

interface NotesContainerProps {
    groups: GroupedNotes[];
    type: 'all' | 'notes' | 'pinned';
    syncId: string;
}

export function NotesList({ groups, type, syncId }: NotesContainerProps) {
    const [isPending, startTransition] = useTransition();
    const [pendingAction, setPendingAction] = useState<'pin' | 'delete' | 'update' | null>(null);

    const handleCreateNote = async (content: string) => {
        const newNote = {
            content,
            sync_id: syncId,
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
                redirect(`/?type=${type}`);
            }
        });
    };

    const handleUpdateNote = async (id: string, content: string) => {
        setPendingAction('update');
        startTransition(async () => {
            try {
                const result = await updateNote(id, { content });
                if (!result.success) {
                    throw result.error
                }
            } catch (error) {
                toast.error("Update failed", {
                    description: "Could not update the note.",
                });
            } finally {
                setPendingAction(null);
                redirect(`/?type=${type}`);
            }
        });
    };

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
        <>
            <div className="mb-6">
                <NoteEditor onSubmit={handleCreateNote} />
            </div>

            <div className="space-y-4">
                {groups.map(({ label, notes }) => (
                    <div key={label} className="space-y-2">
                        <div className="text-sm text-muted-foreground font-medium">{label}</div>
                        <div className="space-y-2">
                            {notes.map(note => (
                                <NoteCard
                                    key={note.id}
                                    note={note}
                                    isPending={isPending}
                                    pendingAction={pendingAction}
                                    onUpdate={handleUpdateNote}
                                    onPin={handleTogglePin}
                                    onDelete={handleDeleteNote}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}