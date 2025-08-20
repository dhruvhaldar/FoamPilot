'use client';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Folder, FolderPlus, BookCopy, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useAppContext } from './foam-pilot-client';

export function CaseExplorer() {
  const { state, dispatch, addCase, loadTutorial, activeCase } = useAppContext();
  const [isNewCaseDialogOpen, setIsNewCaseDialogOpen] = useState(false);
  const [newCaseName, setNewCaseName] = useState('');

  const handleCreateCase = () => {
    if (newCaseName.trim()) {
      addCase(newCaseName.trim());
      setNewCaseName('');
      setIsNewCaseDialogOpen(false);
    }
  };

  return (
    <>
      <Sidebar className="w-64 border-r">
        <SidebarHeader>
          <h2 className="text-lg font-semibold">Cases</h2>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            {state.cases.map(c => (
              <SidebarMenuItem key={c.id}>
                <SidebarMenuButton
                  onClick={() => dispatch({ type: 'SET_ACTIVE_CASE', payload: c.id })}
                  isActive={c.id === activeCase?.id}
                  className="justify-between"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Folder />
                    <span className="truncate">{c.name}</span>
                  </div>
                  {c.id === activeCase?.id && <ChevronRight className="h-4 w-4" />}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="gap-2">
          <Button variant="outline" onClick={() => setIsNewCaseDialogOpen(true)} className="w-full">
            <FolderPlus className="mr-2 h-4 w-4" />
            <span>New Case</span>
          </Button>
          <Button variant="secondary" onClick={loadTutorial}>
            <BookCopy className="mr-2 h-4 w-4" /> Load Tutorial
          </Button>
        </SidebarFooter>
      </Sidebar>

      <Dialog open={isNewCaseDialogOpen} onOpenChange={setIsNewCaseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Case</DialogTitle>
            <DialogDescription>
              Enter a name for your new OpenFOAM case.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newCaseName}
                onChange={e => setNewCaseName(e.target.value)}
                className="col-span-3"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleCreateCase()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleCreateCase}>Create Case</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
