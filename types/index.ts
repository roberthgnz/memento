export type Note = {
  id: string;
  sync_id: string;
  content: string;
  color: string;
  created_at: Date;
  is_pinned: boolean;
  is_public: boolean;
};

export type GroupedNotes = {
  label: string;
  notes: Note[];
}