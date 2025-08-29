import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Folder,
  Play,
  Pause,
  Trash2,
  Settings,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Copy
} from "lucide-react";

interface OpenFOAMCase {
  id: string;
  name: string;
  description: string;
  solver: string;
  status: "idle" | "running" | "completed" | "error";
  created: string;
  lastModified: string;
  meshCells?: number;
  iterations?: number;
}

const CaseManager = () => {
  const { toast } = useToast();
  const [cases, setCases] = useState<OpenFOAMCase[]>([
    {
      id: "1",
      name: "cavity-flow",
      description: "2D lid-driven cavity flow simulation",
      solver: "icoFoam",
      status: "completed",
      created: "2024-01-15",
      lastModified: "2024-01-20",
      meshCells: 400,
      iterations: 2000
    },
    {
      id: "2", 
      name: "airfoil-analysis",
      description: "NACA 0012 airfoil flow analysis",
      solver: "simpleFoam",
      status: "running",
      created: "2024-01-18",
      lastModified: "2024-01-22",
      meshCells: 85000,
      iterations: 1250
    },
    {
      id: "3",
      name: "heat-transfer",
      description: "Heat conduction in solid block",
      solver: "laplacianFoam",
      status: "error",
      created: "2024-01-20",
      lastModified: "2024-01-21",
      meshCells: 1200
    }
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newCase, setNewCase] = useState({
    name: "",
    description: "",
    solver: "icoFoam"
  });

  const solvers = [
    "icoFoam", "simpleFoam", "pimpleFoam", "rhoPimpleFoam", 
    "laplacianFoam", "scalarTransportFoam", "potentialFoam"
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running": return <Play className="h-4 w-4" />;
      case "completed": return <CheckCircle className="h-4 w-4" />;
      case "error": return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "running": return "default";
      case "completed": return "secondary";
      case "error": return "destructive";
      default: return "outline";
    }
  };

  const createCase = () => {
    if (!newCase.name.trim()) {
      toast({
        title: "Error",
        description: "Case name is required",
        variant: "destructive"
      });
      return;
    }

    const caseData: OpenFOAMCase = {
      id: Date.now().toString(),
      name: newCase.name,
      description: newCase.description,
      solver: newCase.solver,
      status: "idle",
      created: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0]
    };

    setCases([caseData, ...cases]);
    setIsCreateDialogOpen(false);
    setNewCase({ name: "", description: "", solver: "icoFoam" });
    
    toast({
      title: "Case Created",
      description: `${newCase.name} has been created successfully`
    });
  };

  const deleteCase = (id: string) => {
    const caseToDelete = cases.find(c => c.id === id);
    setCases(cases.filter(c => c.id !== id));
    
    toast({
      title: "Case Deleted",
      description: `${caseToDelete?.name} has been deleted`
    });
  };

  const duplicateCase = (originalCase: OpenFOAMCase) => {
    const duplicatedCase: OpenFOAMCase = {
      ...originalCase,
      id: Date.now().toString(),
      name: `${originalCase.name}-copy`,
      status: "idle",
      created: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
      iterations: undefined
    };

    setCases([duplicatedCase, ...cases]);
    
    toast({
      title: "Case Duplicated",
      description: `${duplicatedCase.name} has been created`
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Case Manager
          </h1>
          <p className="text-muted-foreground mt-2">
            Create and manage your OpenFOAM simulation cases
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:bg-gradient-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              New Case
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Case</DialogTitle>
              <DialogDescription>
                Set up a new OpenFOAM simulation case
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Case Name</label>
                <Input
                  placeholder="Enter case name"
                  value={newCase.name}
                  onChange={(e) => setNewCase({...newCase, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Input
                  placeholder="Brief description"
                  value={newCase.description}
                  onChange={(e) => setNewCase({...newCase, description: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Solver</label>
                <select
                  className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                  value={newCase.solver}
                  onChange={(e) => setNewCase({...newCase, solver: e.target.value})}
                >
                  {solvers.map(solver => (
                    <option key={solver} value={solver}>{solver}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={createCase}>Create Case</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cases.map((caseItem) => (
          <Card key={caseItem.id} className="group hover:shadow-elegant transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <Folder className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{caseItem.name}</CardTitle>
                </div>
                <Badge variant={getStatusVariant(caseItem.status)} className="flex items-center space-x-1">
                  {getStatusIcon(caseItem.status)}
                  <span className="capitalize">{caseItem.status}</span>
                </Badge>
              </div>
              <CardDescription>{caseItem.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Solver:</span>
                <span className="font-medium">{caseItem.solver}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Created:</span>
                <span>{caseItem.created}</span>
              </div>
              
              {caseItem.meshCells && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Mesh Cells:</span>
                  <span>{caseItem.meshCells.toLocaleString()}</span>
                </div>
              )}
              
              {caseItem.iterations && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Iterations:</span>
                  <span>{caseItem.iterations.toLocaleString()}</span>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  <FileText className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="outline" onClick={() => duplicateCase(caseItem)}>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
              </div>
              
              <div className="flex space-x-2">
                {caseItem.status === "running" ? (
                  <Button size="sm" variant="outline">
                    <Pause className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button size="sm" variant="outline">
                    <Play className="h-4 w-4" />
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => deleteCase(caseItem.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {cases.length === 0 && (
        <div className="text-center py-12">
          <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No cases yet</h3>
          <p className="text-muted-foreground mb-4">Create your first OpenFOAM case to get started</p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Case
          </Button>
        </div>
      )}
    </div>
  );
};

export default CaseManager;
