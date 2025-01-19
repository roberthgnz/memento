"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const NotesTabs = ({ currentTab }: {
    currentTab: 'all' | 'notes' | 'pinned';
}) => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [tab, setTab] = useState(currentTab);

    useEffect(() => {
        const updateSearchURL = (queryValues: Record<string, string>) => {
            const params = new URLSearchParams(searchParams!)
            for (const [name, value] of Object.entries(queryValues)) {
                params.set(name, value)
            }
            const url = `${pathname}?${params.toString()}`
            return router.push(url)
        }

        updateSearchURL({ type: tab })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tab])

    return (
        <div className="flex space-x-4">
            <Button
                variant={'ghost'}
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-b-none"
                data-state={tab === 'all' ? 'active' : 'inactive'}
                onClick={() => setTab('all')}
            >
                All
            </Button>
            <Button
                variant={'ghost'}
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-b-none"
                data-state={tab === 'notes' ? 'active' : 'inactive'}
                onClick={() => setTab('notes')}
            >
                Notes
            </Button>
            <Button
                variant={'ghost'}
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-b-none"
                data-state={tab === 'pinned' ? 'active' : 'inactive'}
                onClick={() => setTab('pinned')}
            >
                Pinned
            </Button>
        </div>
    );
}