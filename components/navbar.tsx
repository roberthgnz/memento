import Link from "next/link";
import { StickyNote } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { SyncDialog } from "./sync-dialog";
import { updateSyncId } from "@/app/actions";
import { AuthButton } from "./auth-button";
import { createClient } from "@/lib/supabase/server";

export async function Navbar({ syncId }: { syncId: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center max-w-4xl mx-auto px-4">
        <div className="flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <StickyNote className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              Memento
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center space-x-2">
            <SyncDialog syncId={syncId} onSync={updateSyncId} />
            <AuthButton user={user} />
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}