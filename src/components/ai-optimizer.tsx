'use client';

import { useState } from 'react';
import { useAppContext } from './foam-pilot-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { suggestSolverParameters } from '@/ai/flows/suggest-solver-parameters';
import type { SolverType } from '@/lib/types';
import { Sparkles, Wand2 } from 'lucide-react';

export function AiOptimizer() {
  const { activeCase, dispatch } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ suggestedParameters: string; requiredFilesCheck: string } | null>(null);
  const { toast } = useToast();

  const handleSolverChange = (value: string) => {
    if (activeCase) {
      dispatch({ type: 'UPDATE_CASE', payload: { id: activeCase.id, solver: value as SolverType } });
    }
  };

  const handleOptimize = async () => {
    if (!activeCase) return;

    setIsLoading(true);
    setResult(null);

    try {
      const caseData = activeCase.files
        .map(file => `--- ${file.name} ---\n${file.content}`)
        .join('\n\n');

      const response = await suggestSolverParameters({
        caseData,
        solverType: activeCase.solver,
      });
      setResult(response);
    } catch (error) {
      console.error('AI optimization failed:', error);
      toast({
        variant: 'destructive',
        title: 'Optimization Failed',
        description: 'Could not get suggestions from the AI. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!activeCase) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Parameter Optimizer</CardTitle>
        <CardDescription>
          Get AI-powered suggestions for optimal solver parameters based on your case setup.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Select onValueChange={handleSolverChange} defaultValue={activeCase.solver}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select solver" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="simpleFoam">simpleFoam</SelectItem>
              <SelectItem value="pisoFoam">pisoFoam</SelectItem>
              <SelectItem value="icoFoam">icoFoam</SelectItem>
              <SelectItem value="potentialFoam">potentialFoam</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleOptimize} disabled={isLoading}>
            <Wand2 className="mr-2 h-4 w-4" />
            {isLoading ? 'Analyzing...' : 'Suggest Parameters'}
          </Button>
        </div>

        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-16 w-full" />
          </div>
        )}

        {result && (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2"><Sparkles className="text-accent-foreground h-5 w-5" />Suggested Parameters</h3>
              <pre className="p-4 bg-secondary rounded-lg text-sm font-mono overflow-auto">{result.suggestedParameters}</pre>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Required Files Check</h3>
              <p className="text-sm text-muted-foreground p-4 bg-secondary rounded-lg">{result.requiredFilesCheck}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
