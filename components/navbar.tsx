"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { StickyNote } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { SyncDialog } from "./sync-dialog";
import { updateSyncId } from "@/app/actions";

export function Navbar({ syncId }: { syncId: string }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

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
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className={cn(
                "transition-colors hover:text-foreground/80",
                isHome ? "text-foreground" : "text-foreground/60"
              )}
            >
              Notes
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center space-x-2">
            <SyncDialog syncId={syncId} onSync={updateSyncId} />
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}