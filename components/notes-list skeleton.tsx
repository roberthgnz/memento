"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function NotesListSkeleton() {
    return (
        <div className="space-y-2">
            <Skeleton className="h-5 w-24 bg-muted" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                        key={i}
                        className="rounded-lg p-4 bg-yellow-50/50 dark:bg-yellow-950/20"
                    >
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <div className="flex items-center justify-between pt-2">
                                <Skeleton className="h-4 w-24" />
                                <div className="flex items-center space-x-2">
                                    <Skeleton className="h-8 w-8 rounded-md" />
                                    <Skeleton className="h-8 w-8 rounded-md" />
                                    <Skeleton className="h-8 w-8 rounded-md" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}