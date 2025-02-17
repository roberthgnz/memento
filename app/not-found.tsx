import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <Link href="/">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </Link>
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-2">Note not found</h2>
        <p className="text-muted-foreground">
          The note you&apos;re looking for doesn&apos;t exist or has been deleted.
        </p>
      </div>
    </div>
  );
}