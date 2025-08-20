'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Boxes, Calculator, FileText, Play, TestTube2, Waypoints } from 'lucide-react';
import React from 'react';

interface WorkflowStepProps {
  icon: React.ElementType;
  title: string;
  description: string;
  isLast?: boolean;
}

const WorkflowStep: React.FC<WorkflowStepProps> = ({ icon: Icon, title, description, isLast = false }) => {
  return (
    <div className="flex items-start gap-4">
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
          <Icon className="w-6 h-6" />
        </div>
        {!isLast && <div className="w-px h-16 bg-border" />}
      </div>
      <div className="pt-2.5">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  );
};

const workflowSteps = [
    {
      icon: Boxes,
      title: 'Meshing',
      description: 'Generate the computational mesh using `blockMesh` or other utilities.',
    },
    {
      icon: TestTube2,
      title: 'Set Initial Conditions',
      description: 'Define boundary conditions and initial values for fields like velocity and pressure.',
    },
    {
      icon: Play,
      title: 'Run Solver',
      description: 'Execute the appropriate solver (e.g., `simpleFoam`, `pisoFoam`) to run the simulation.',
    },
    {
      icon: Calculator,
      title: 'Post-processing',
      description: 'Analyze the results, calculate derived quantities, and prepare for visualization.',
    },
    {
        icon: FileText,
        title: 'Generate Report',
        description: 'Create plots, animations, and a summary report of the simulation findings.',
      },
];

export function WorkflowVisualizer() {
  return (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Waypoints className="w-6 h-6 text-primary"/>
                Simulation Workflow
            </CardTitle>
            <CardDescription>
                This shows the typical sequence of steps for an OpenFOAM simulation.
            </CardDescription>
        </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col gap-2">
          {workflowSteps.map((step, index) => (
            <WorkflowStep
              key={step.title}
              icon={step.icon}
              title={step.title}
              description={step.description}
              isLast={index === workflowSteps.length - 1}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
