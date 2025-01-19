"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Smartphone, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface SyncDialogProps {
  syncId: string;
  onSync: (code: string) => Promise<void>;
}

export function SyncDialog({ syncId, onSync }: SyncDialogProps) {
  const [syncCode, setSyncCode] = useState('');
  const [open, setOpen] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(syncId);
    toast.success("Code copied", {
      description: "Sync code has been copied to clipboard.",
    });
  };

  const handleSync = async (e: React.FormEvent) => {
    e.preventDefault();
    if (syncCode.trim()) {
      await onSync(syncCode.trim());
      setSyncCode('');
      setOpen(false);
      toast.success("Sync successful", {
        description: "Your notes have been synced.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="fixed bottom-4 right-4">
          <Smartphone className="w-4 h-4 mr-2" />
          Sync
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sync Across Devices</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Share this code with another device to sync your notes
            </div>
            <div className="flex items-center space-x-2">
              <code className="bg-muted px-3 py-1.5 rounded-md text-sm flex-1 font-mono">
                {syncId}
              </code>
              <Button
                variant="ghost"
                size="icon"
                onClick={copyToClipboard}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Or enter a sync code to connect to another device
            </div>
            <form onSubmit={handleSync} className="flex space-x-2">
              <Input
                value={syncCode}
                onChange={(e) => setSyncCode(e.target.value)}
                placeholder="Enter sync code..."
                className="flex-1 font-mono"
              />
              <Button type="submit">Sync</Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}