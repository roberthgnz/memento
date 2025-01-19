"use client";

import { Button } from "@/components/ui/button";
import { signInWithProvider } from "@/lib/auth";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const sampleNotes = [
    {
        content: `<div class="space-y-2">
      <h3 class="font-semibold text-zinc-900 dark:text-zinc-50">📅 Project Kickoff Notes</h3>
      <ul class="list-disc pl-4 space-y-1 text-zinc-800 dark:text-zinc-200">
        <li><strong>Team:</strong> Design & Development</li>
        <li><strong>Goals:</strong> Launch MVP by Q2</li>
        <li><strong>Next Steps:</strong> Set up weekly sprints</li>
      </ul>
      <p class="text-sm text-zinc-600 dark:text-zinc-400">Added 2 hours ago</p>
    </div>`,
        color: "rgb(254 243 199 / 0.8) dark:rgb(234 179 8 / 0.2)",
        rotate: -2,
    },
    {
        content: `<div class="space-y-2">
      <h3 class="font-semibold text-zinc-900 dark:text-zinc-50">🛒 Shopping List</h3>
      <div class="space-y-1 text-zinc-800 dark:text-zinc-200">
        <p>🥑 Avocados</p>
        <p>🥖 Sourdough bread</p>
        <p>🫐 Fresh berries</p>
        <p>🥛 Oat milk</p>
      </div>
      <p class="text-sm text-zinc-600 dark:text-zinc-400">Updated 5 min ago</p>
    </div>`,
        color: "rgb(219 234 254 / 0.8) dark:rgb(59 130 246 / 0.2)",
        rotate: 1,
    },
    {
        content: `<div class="space-y-2">
      <h3 class="font-semibold text-zinc-900 dark:text-zinc-50">💡 Feature Ideas</h3>
      <div class="space-y-1 text-zinc-800 dark:text-zinc-200">
        <p><strong>AI Integration:</strong> Smart note categorization</p>
        <p><strong>Collaboration:</strong> Real-time editing</p>
        <p><strong>Mobile:</strong> Offline support</p>
      </div>
      <p class="text-sm text-zinc-600 dark:text-zinc-400">Pinned note</p>
    </div>`,
        color: "rgb(245 208 254 / 0.8) dark:rgb(168 85 247 / 0.2)",
        rotate: -1,
    },
];

const features = [
    {
        title: "Rich Text Editor",
        description: "Format your notes with bold, italic, lists, and more.",
        icon: "✍️",
    },
    {
        title: "Cross-Device Sync",
        description: "Access your notes from any device with our sync feature.",
        icon: "🔄",
    },
    {
        title: "Dark Mode",
        description: "Easy on the eyes with automatic dark mode support.",
        icon: "🌙",
    },
    {
        title: "Share Notes",
        description: "Share your notes with others via public links.",
        icon: "🔗",
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 10,
        },
    },
};

const titleVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 200,
            damping: 20,
        },
    },
};

const backgroundVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 0.1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 20,
            delay: 0.2,
        },
    },
};

const noteVariants = {
    hidden: (i: number) => ({
        opacity: 0,
        y: 50,
        rotate: 0,
    }),
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        rotate: window.innerWidth >= 640 ? [-2, 1, -1][i] : 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15,
            delay: 0.2 + i * 0.1,
        },
    }),
    hover: (i: number) => ({
        scale: 1.05,
        rotate: window.innerWidth >= 640 ? [-3, 2, -2][i] : 0,
        y: -5,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 15,
        },
    }),
};

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
        <div className="min-h-[calc(100vh-3.5rem)] flex flex-col">
            <div className="flex-1 flex items-center justify-center relative overflow-hidden">
                <motion.div
                    className="absolute inset-0 bg-grid-pattern"
                    initial="hidden"
                    animate="visible"
                    variants={backgroundVariants}
                />
                <div className="relative w-full max-w-5xl mx-auto px-4 py-8 sm:py-16 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        className="space-y-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <div className="relative">
                            <motion.h1
                                variants={titleVariants}
                                className="text-4xl font-bold tracking-tight sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-yellow-500 dark:from-yellow-500 dark:to-yellow-400"
                            >
                                Memento
                            </motion.h1>
                        </div>
                        <motion.h2
                            variants={itemVariants}
                            className="text-3xl sm:text-4xl font-semibold"
                        >
                            Your thoughts, organized{" "}
                            <span className="text-yellow-600 dark:text-yellow-500">beautifully</span>
                        </motion.h2>
                        <motion.p
                            variants={itemVariants}
                            className="text-lg text-muted-foreground max-w-2xl mx-auto"
                        >
                            Create, organize, and share your notes with ease. Sign in to start your journey
                            or continue as a guest to try it out.
                        </motion.p>
                        <motion.div
                            variants={itemVariants}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => handleSignIn("google")}
                                className="gap-2"
                            >
                                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M24.02 12.2727C24.02 11.4218 23.9436 10.6036 23.8018 9.81819H12.5V14.46H18.9582C18.68 15.96 17.8345 17.2309 16.5636 18.0818V21.0927H20.4418C22.7109 19.0036 24.02 15.9273 24.02 12.2727Z" fill="#4285F4" />
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12.5 24C15.74 24 18.4564 22.9254 20.4418 21.0927L16.5636 18.0818C15.4891 18.8018 14.1145 19.2273 12.5 19.2273C9.37455 19.2273 6.72909 17.1163 5.78546 14.28H1.77637V17.3891C3.75091 21.3109 7.80909 24 12.5 24Z" fill="#34A853" />
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M5.78545 14.28C5.54545 13.56 5.40909 12.7909 5.40909 12C5.40909 11.2091 5.54545 10.44 5.78545 9.71999V6.6109H1.77636C0.963636 8.2309 0.5 10.0636 0.5 12C0.5 13.9364 0.963636 15.7691 1.77636 17.3891L5.78545 14.28Z" fill="#FBBC05" />
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12.5 4.77273C14.2618 4.77273 15.8436 5.37818 17.0873 6.56727L20.5291 3.12545C18.4509 1.18909 15.7345 0 12.5 0C7.80909 0 3.75091 2.68909 1.77637 6.61091L5.78546 9.72C6.72909 6.88364 9.37455 4.77273 12.5 4.77273Z" fill="#EA4335" />
                                </svg>
                                Sign in with Google
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => handleSignIn("github")}
                                className="gap-2"
                            >
                                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_39_364)">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M12.4642 0C5.84833 0 0.5 5.5 0.5 12.3042C0.5 17.7432 3.92686 22.3472 8.68082 23.9767C9.27518 24.0992 9.4929 23.712 9.4929 23.3862C9.4929 23.101 9.47331 22.1232 9.47331 21.1045C6.14514 21.838 5.45208 19.6378 5.45208 19.6378C4.91722 18.2118 4.12473 17.8452 4.12473 17.8452C3.03543 17.0915 4.20408 17.0915 4.20408 17.0915C5.41241 17.173 6.04645 18.3545 6.04645 18.3545C7.11592 20.2285 8.83926 19.699 9.53257 19.373C9.63151 18.5785 9.94865 18.0285 10.2854 17.723C7.63094 17.4377 4.83812 16.3785 4.83812 11.6523C4.83812 10.3078 5.31322 9.20775 6.06604 8.35225C5.94727 8.04675 5.53118 6.7835 6.18506 5.09275C6.18506 5.09275 7.19527 4.76675 9.47306 6.35575C10.4483 6.08642 11.454 5.9494 12.4642 5.94825C13.4744 5.94825 14.5042 6.091 15.4552 6.35575C17.7332 4.76675 18.7434 5.09275 18.7434 5.09275C19.3973 6.7835 18.981 8.04675 18.8622 8.35225C19.6349 9.20775 20.0904 10.3078 20.0904 11.6523C20.0904 16.3785 17.2976 17.4172 14.6233 17.723C15.0592 18.11 15.4353 18.8433 15.4353 20.0045C15.4353 21.6545 15.4158 22.9788 15.4158 23.386C15.4158 23.712 15.6337 24.0992 16.2278 23.977C20.9818 22.347 24.4087 17.7432 24.4087 12.3042C24.4282 5.5 19.0603 0 12.4642 0Z" fill="#24292F" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_39_364">
                                            <rect width="24" height="24" fill="white" transform="translate(0.5)" />
                                        </clipPath>
                                    </defs>
                                </svg>
                                Sign in with GitHub
                            </Button>
                        </motion.div>
                    </motion.div>

                    {/* Sample Notes */}
                    <motion.div
                        className="relative mt-16 sm:mt-24"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center gap-4 sm:gap-8">
                            <AnimatePresence>
                                {sampleNotes.map((note, index) => (
                                    <motion.div
                                        key={index}
                                        custom={index}
                                        variants={noteVariants}
                                        initial="hidden"
                                        animate="visible"
                                        whileHover="hover"
                                        className="w-[85vw] sm:w-72 cursor-pointer"
                                        style={{
                                            backgroundColor: note.color,
                                        }}
                                    >
                                        <div className="rounded-lg p-4 shadow-lg backdrop-blur-sm">
                                            <div
                                                dangerouslySetInnerHTML={{ __html: note.content }}
                                            />
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Features Section */}
                    <motion.div
                        className="mt-24 sm:mt-32"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.h2
                            variants={itemVariants}
                            className="text-3xl font-bold mb-12"
                        >
                            Features you&apos;ll love
                        </motion.h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    whileHover={{
                                        scale: 1.05,
                                        transition: { type: "spring", stiffness: 300, damping: 15 }
                                    }}
                                    className="p-6 rounded-lg bg-card border transition-colors hover:bg-accent"
                                >
                                    <div className="text-3xl mb-4">{feature.icon}</div>
                                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}