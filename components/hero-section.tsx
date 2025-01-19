"use client";

import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { signInWithProvider } from "@/lib/auth";
import { toast } from "sonner";

export function HeroSection() {
    const handleSignIn = async (provider: "github" | "google") => {
        try {
            await signInWithProvider(provider);
        } catch (error) {
            toast.error("Authentication failed", {
                description: "Could not sign in with " + provider,
            });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] text-center px-4">
            <div className="max-w-3xl space-y-6">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                    Your thoughts, organized{" "}
                    <span className="text-yellow-600 dark:text-yellow-500">beautifully</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Create, organize, and share your notes with ease. Sign in to start your journey
                    or continue as a guest to try it out.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Button
                        size="lg"
                        onClick={() => handleSignIn("github")}
                        className="gap-2"
                    >
                        <Github className="w-5 h-5" />
                        Sign in with GitHub
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        onClick={() => handleSignIn("google")}
                        className="gap-2"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="currentColor"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Sign in with Google
                    </Button>
                </div>
            </div>
        </div>
    );
}