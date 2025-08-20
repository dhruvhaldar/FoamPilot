'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppContext } from './foam-pilot-client';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useTheme } from 'next-themes';
import { Switch } from './ui/switch';
import { Moon, Sun } from 'lucide-react';

export function SettingsPage() {
    const { setActiveView } = useAppContext();
    const { toast } = useToast();
    const [casePath, setCasePath] = useState('/home/user/foam_cases');
    const [openfoamPath, setOpenfoamPath] = useState('/opt/openfoam');
    const { theme, setTheme } = useTheme();

    const handleSave = () => {
        // In a real app, you'd save the settings here.
        toast({
            title: 'Settings Saved',
            description: 'Your configuration has been updated.',
        });
        setActiveView('welcome');
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>
                    Configure your application preferences and OpenFOAM environment.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label>Appearance</Label>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <h3 className="font-medium">Dark Mode</h3>
                            <p className="text-xs text-muted-foreground">
                                Toggle between light and dark themes.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Sun className="h-5 w-5" />
                            <Switch
                                checked={theme === 'dark'}
                                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                            />
                            <Moon className="h-5 w-5" />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="case-path">Case Storage Path</Label>
                    <div className="flex gap-2">
                        <Input
                            id="case-path"
                            type="text"
                            value={casePath}
                            onChange={(e) => setCasePath(e.target.value)}
                        />
                        <Button variant="outline">Browse</Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        This is the directory where your cases will be saved and loaded from.
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="openfoam-path">OpenFOAM Installation Path</Label>
                    <div className="flex gap-2">
                        <Input
                            id="openfoam-path"
                            type="text"
                            value={openfoamPath}
                            onChange={(e) => setOpenfoamPath(e.target.value)}
                        />
                        <Button variant="outline">Browse</Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        The root directory of your OpenFOAM installation.
                    </p>
                </div>

                 <Button onClick={handleSave}>Save Settings</Button>
            </CardContent>
        </Card>
    )
}
