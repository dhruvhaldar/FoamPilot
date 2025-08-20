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
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Folder, FolderPlus, BookCopy, ChevronRight, Trash2, Settings } from 'lucide-react';
import { useState } from 'react';
import { useAppContext } from './foam-pilot-client';

export function CaseExplorer() {
  const { state, dispatch, addCase, loadTutorial, activeCase, setActiveView } = useAppContext();
  const [isNewCaseDialogOpen, setIsNewCaseDialogOpen] = useState(false);
  const [newCaseName, setNewCaseName] = useState('');
  const [caseToDelete, setCaseToDelete] = useState<string | null>(null);

  const handleCreateCase = () => {
    if (newCaseName.trim()) {
      addCase(newCaseName.trim());
      setNewCaseName('');
      setIsNewCaseDialogOpen(false);
    }
  };

  const handleDeleteCase = () => {
    if (caseToDelete) {
      dispatch({ type: 'DELETE_CASE', payload: caseToDelete });
      setCaseToDelete(null);
    }
  };

  const openDeleteDialog = (e: React.MouseEvent, caseId: string) => {
    e.stopPropagation();
    setCaseToDelete(caseId);
  }

  const handleCaseSelection = (caseId: string) => {
    dispatch({ type: 'SET_ACTIVE_CASE', payload: caseId });
    setActiveView('case');
  }

  const caseForDeletion = state.cases.find(c => c.id === caseToDelete);

  return (
    <>
      <Sidebar className="w-64 border-r">
        <SidebarHeader>
          <h2 className="text-lg font-semibold">Cases</h2>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            {state.cases.map(c => (
              <SidebarMenuItem key={c.id} className="group">
                 <SidebarMenuButton
                  onClick={() => handleCaseSelection(c.id)}
                  isActive={c.id === activeCase?.id && state.activeView === 'case'}
                  className="w-full justify-start"
                >
                  <div className="flex items-center gap-2 truncate flex-1">
                    <Folder />
                    <span className="truncate">{c.name}</span>
                  </div>
                   {c.id === activeCase?.id && state.activeView === 'case' && <ChevronRight className="h-4 w-4" />}
                </SidebarMenuButton>
                 <div className="absolute right-1 top-1/2 -translate-y-1/2">
                    <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={(e) => openDeleteDialog(e, c.id)}>
                        <Trash2 className="h-4 w-4 text-destructive"/>
                    </Button>
                 </div>
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
          <Button 
            variant="ghost" 
            onClick={() => setActiveView('settings')}
            className="w-full justify-start"
            >
            <Settings className="mr-2 h-4 w-4" /> Settings
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

      <Dialog open={!!caseToDelete} onOpenChange={(open) => !open && setCaseToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Case</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the case "{caseForDeletion?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteCase}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
