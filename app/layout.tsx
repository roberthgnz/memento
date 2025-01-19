import './globals.css';
import type { Metadata } from 'next';
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';
import { Navbar } from "@/components/navbar";
import { updateSyncId } from "./actions";
import { SyncDialog } from "@/components/sync-dialog";
import { getSyncId } from "@/lib/cookies";

export const metadata: Metadata = {
  title: 'Memento',
  description: 'A simple notes application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const syncId = getSyncId();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GeistSans.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
          </div>
          <Toaster richColors closeButton />
          <SyncDialog syncId={syncId} onSync={updateSyncId} />
        </ThemeProvider>
      </body>
    </html>
  );
}