'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppContext } from './foam-pilot-client';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export function SettingsPage() {
    const { setActiveView } = useAppContext();
    const { toast } = useToast();
    const [casePath, setCasePath] = useState('/home/user/foam_cases');
    const [openfoamPath, setOpenfoamPath] = useState('/opt/openfoam');

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
                    Configure paths for your OpenFOAM environment.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
