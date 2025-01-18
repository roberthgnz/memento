"use client";

import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Smartphone, Copy } from 'lucide-react';

interface SyncDialogProps {
  syncId: string;
  onSync: (code: string) => void;
}

export function SyncDialog({ syncId, onSync }: SyncDialogProps) {
  const [qrCode, setQrCode] = useState('');
  const [syncCode, setSyncCode] = useState('');

  useEffect(() => {
    QRCode.toDataURL(syncId).then(setQrCode);
  }, [syncId]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(syncId);
  };

  const handleSync = (e: React.FormEvent) => {
    e.preventDefault();
    if (syncCode.trim()) {
      onSync(syncCode.trim());
      setSyncCode('');
    }
  };

  return (
    <Dialog>
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
              Scan this QR code or use the sync code on another device to sync your notes
            </div>
            <div className="flex flex-col items-center space-y-4">
              {qrCode && (
                <img 
                  src={qrCode} 
                  alt="Sync QR Code"
                  className="w-48 h-48 bg-white p-2 rounded-lg"
                />
              )}
              <div className="flex items-center space-x-2">
                <code className="bg-muted px-2 py-1 rounded text-sm">{syncId}</code>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={copyToClipboard}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
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
                className="flex-1"
              />
              <Button type="submit">Sync!</Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}