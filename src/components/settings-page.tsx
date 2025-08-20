'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppContext } from './foam-pilot-client';
import { useToast } from '@/hooks/use-toast';

export function SettingsPage() {
    const { setActiveView } = useAppContext();
    const { toast } = useToast();

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
                    Configure paths for storing and fetching your OpenFOAM cases.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="case-path">Case Storage Path</Label>
                    <div className="flex gap-2">
                        <Input id="case-path" type="text" value="/home/user/foam_cases" readOnly />
                        <Button variant="outline">Browse</Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        This is the directory where your cases will be saved and loaded from.
                    </p>
                </div>
                 <Button onClick={handleSave}>Save Settings</Button>
            </CardContent>
        </Card>
    )
}
