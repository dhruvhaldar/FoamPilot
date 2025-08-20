'use client';
import { BookCopy, FolderPlus, MousePointerClick } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useAppContext } from './foam-pilot-client';

export function WelcomeScreen() {
    const { loadTutorial } = useAppContext();
    return (
        <div className="h-full w-full flex items-center justify-center">
            <Card className="w-full max-w-lg text-center shadow-lg">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold tracking-tight">Welcome to FoamPilot</CardTitle>
                    <CardDescription className="text-lg">Your modern GUI for OpenFOAM.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                    <p>Get started by creating a new case or loading a tutorial.</p>
                    <div className="flex justify-center gap-4">
                        <div className="flex flex-col items-center gap-2">
                            <FolderPlus className="w-10 h-10 text-primary" />
                            <p className="text-sm font-medium">Create a New Case</p>
                            <p className="text-xs text-muted-foreground">Start from scratch.</p>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <BookCopy className="w-10 h-10 text-primary" />
                            <p className="text-sm font-medium">Load a Tutorial</p>
                            <p className="text-xs text-muted-foreground">Explore a pre-built example.</p>
                        </div>
                    </div>
                     <div className="flex items-center justify-center gap-2 pt-4 text-sm text-muted-foreground">
                        <MousePointerClick className="w-4 h-4"/>
                        <span>Use the panel on the left to begin.</span>
                     </div>
                </CardContent>
            </Card>
        </div>
    )
}
