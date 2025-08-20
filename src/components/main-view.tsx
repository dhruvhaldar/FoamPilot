'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAppContext } from './foam-pilot-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { File, PlayCircle, Save, Terminal, Sparkles, FolderOpen, CircleDot, Boxes, AreaChart } from 'lucide-react';
import { AiOptimizer } from './ai-optimizer';
import type { CaseFile } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { BlockMeshGenerator } from './block-mesh-generator';
import Editor from 'react-simple-code-editor';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const customStyle = {
    ...prism,
    'comment': {
        color: '#228b22' /* Forest Green */
    },
    'prolog': {
        color: '#228b22'
    },
    'doctype': {
        color: '#228b22'
    },
    'cdata': {
        color: '#228b22'
    },
    'punctuation': {
        color: '#111827' // Almost black
    },
    'operator': {
        color: '#111827'
    }
}

const parseResiduals = (output: string[]) => {
    const residuals = [];
    const residualRegex = /Solving for (\w+), Initial residual = ([\d.e-]+), Final residual = ([\d.e-]+), NoIterations = (\d+)/g;
    let time = 0;
    for (const line of output) {
        if (line.startsWith('Time = ')) {
            const timeMatch = line.match(/Time = (\d+)/);
            if (timeMatch) {
                time = parseInt(timeMatch[1], 10);
            }
        }
        let match;
        while ((match = residualRegex.exec(line)) !== null) {
            residuals.push({
                time: time,
                variable: match[1],
                initial: parseFloat(match[2]),
                final: parseFloat(match[3]),
                iterations: parseInt(match[4]),
            })
        }
    }
    // group by time
    const groupedByTime = residuals.reduce((acc, curr) => {
        const timeEntry = acc.find(item => item.time === curr.time);
        if (timeEntry) {
            timeEntry[curr.variable] = curr.final;
        } else {
            acc.push({ time: curr.time, [curr.variable]: curr.final });
        }
        return acc;
    }, [] as {time: number, [key:string]: number }[]);

    return groupedByTime.sort((a,b) => a.time - b.time);
}

export function MainView() {
  const { activeCase, dispatch } = useAppContext();
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [editorContent, setEditorContent] = useState('');
  const [isUnsaved, setIsUnsaved] = useState(false);
  const { toast } = useToast();

  const selectedFile = activeCase?.files.find(f => f.id === selectedFileId);

  const chartData = useMemo(() => activeCase ? parseResiduals(activeCase.consoleOutput) : [], [activeCase?.consoleOutput]);

  useEffect(() => {
    if (activeCase && !selectedFileId && activeCase.files.length > 0) {
      setSelectedFileId(activeCase.files[0].id);
    }
    if (activeCase && selectedFileId && !activeCase.files.find(f => f.id === selectedFileId)) {
        setSelectedFileId(activeCase.files.length > 0 ? activeCase.files[0].id : null);
    }
  }, [activeCase, selectedFileId]);
  
  useEffect(() => {
    if (selectedFile) {
      setEditorContent(selectedFile.content);
      setIsUnsaved(false);
    } else {
      setEditorContent('');
    }
  }, [selectedFile, activeCase]);

  const handleSave = () => {
    if (activeCase && selectedFileId && isUnsaved) {
      dispatch({ type: 'UPDATE_FILE', payload: { caseId: activeCase.id, fileId: selectedFileId, content: editorContent } });
      setIsUnsaved(false);
      toast({ title: "File saved!", description: `${selectedFile?.name} has been updated.`});
    }
  };
  
  const handleContentChange = (content: string) => {
    setEditorContent(content);
    setIsUnsaved(true);
  }

  const handleRunSimulation = useCallback(() => {
    if (!activeCase || activeCase.isRunning) return;

    dispatch({ type: 'UPDATE_CASE', payload: { id: activeCase.id, isRunning: true, consoleOutput: ['Starting simulation...'] } });

    let iteration = 0;
    const interval = setInterval(() => {
        iteration++;
        const U_initial = 1 / (iteration * 0.8 + 1) * Math.random();
        const U_final = U_initial / (10 + Math.random() * 5);
        const p_initial = 1 / (iteration * 0.5 + 1) * Math.random();
        const p_final = p_initial / (10 + Math.random() * 5);

        const newOutput = [
            `Time = ${iteration}`,
            `Solving for U, Initial residual = ${U_initial.toExponential(4)}, Final residual = ${U_final.toExponential(4)}, NoIterations = ${Math.floor(Math.random() * 5) + 1}`,
            `Solving for p, Initial residual = ${p_initial.toExponential(4)}, Final residual = ${p_final.toExponential(4)}, NoIterations = ${Math.floor(Math.random() * 15) + 5}`,
            `...`,
        ].join('\n');
      
      // A bit of a hack to get the latest console output without state dependency issues in interval
      const currentOutput = document.getElementById('console-output')?.textContent?.split('\n') || [];
      const updatedOutput = [...currentOutput, newOutput];
      dispatch({ type: 'UPDATE_CASE', payload: { id: activeCase.id, consoleOutput: updatedOutput } });

      if (iteration >= 20) {
        clearInterval(interval);
        dispatch({
          type: 'UPDATE_CASE',
          payload: { id: activeCase!.id, isRunning: false, consoleOutput: [...updatedOutput, 'Simulation finished.'] },
        });
      }
    }, 500);
  }, [activeCase, dispatch]);

  if (!activeCase) {
    return null;
  }

  const addFileToCase = (name: string, content: string) => {
    if (!activeCase) return;
    const newFile: CaseFile = {
      id: `file-${Date.now()}`,
      name,
      content,
    };
    dispatch({ type: 'ADD_FILE_TO_CASE', payload: { caseId: activeCase.id, file: newFile } });
    setSelectedFileId(newFile.id);
    toast({
      title: 'File Added',
      description: `The file "${name}" has been added to the case.`,
    })
  }

  return (
    <div className="flex h-full gap-4">
      <Card className="w-64 shrink-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FolderOpen className="h-5 w-5" />
            <span>Case Files</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1">
            {activeCase.files.map(file => (
              <li key={file.id}>
                <Button
                  variant={selectedFileId === file.id ? 'secondary' : 'ghost'}
                  className="w-full justify-start gap-2"
                  onClick={() => setSelectedFileId(file.id)}
                >
                  <File className="h-4 w-4" />
                  <span className="truncate">{file.name}</span>
                  {file.id === selectedFileId && isUnsaved && <CircleDot className="h-3 w-3 text-primary animate-pulse" />}
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <div className="flex-1 flex flex-col min-h-0">
        <header className="flex items-center justify-between pb-4">
          <h2 className="text-xl font-semibold">{activeCase.name}</h2>
          <Button onClick={handleRunSimulation} disabled={activeCase.isRunning}>
            <PlayCircle className="mr-2 h-4 w-4" />
            {activeCase.isRunning ? 'Running...' : 'Run Simulation'}
          </Button>
        </header>
        <Tabs defaultValue="editor" className="flex-1 flex flex-col min-h-0">
          <TabsList>
            <TabsTrigger value="editor"><File className="mr-2 h-4 w-4" />Editor</TabsTrigger>
            <TabsTrigger value="console"><Terminal className="mr-2 h-4 w-4" />Console</TabsTrigger>
            <TabsTrigger value="ai-optimizer"><Sparkles className="mr-2 h-4 w-4" />AI Optimizer</TabsTrigger>
            <TabsTrigger value="block-mesh"><Boxes className="mr-2 h-4 w-4" />BlockMesh</TabsTrigger>
          </TabsList>
          <TabsContent value="editor" className="flex-1 mt-4 flex flex-col">
            <div className="flex justify-between items-center mb-2 shrink-0">
                <p className="text-sm font-medium">{selectedFile?.name || 'No file selected'}</p>
                <Button onClick={handleSave} disabled={!isUnsaved}>
                    <Save className="mr-2 h-4 w-4" />
                    Save
                </Button>
            </div>
             <div className="border rounded-md bg-background flex-1 relative">
                <ScrollArea className="h-full w-full absolute">
                    <Editor
                        value={editorContent}
                        onValueChange={handleContentChange}
                        highlight={code => (
                            <SyntaxHighlighter language="cpp" style={customStyle} PreTag="div" customStyle={{
                                minHeight: '100%',
                                width: '100%',
                                margin: 0,
                                padding: 0
                            }}>
                                {code}
                            </SyntaxHighlighter>
                        )}
                        padding={10}
                        className="font-mono text-sm"
                        style={{
                            fontFamily: '"Fira code", "Fira Mono", monospace',
                            fontSize: 14,
                        }}
                        placeholder="Select a file to edit..."
                    />
                </ScrollArea>
             </div>
          </TabsContent>
          <TabsContent value="console" className="flex-1 mt-4 flex flex-col gap-4">
            <Card className="flex-1">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AreaChart className="h-5 w-5" />
                        Residuals Monitor
                    </CardTitle>
                    <CardDescription>
                        Live plot of solver residuals.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" label={{ value: 'Time (s)', position: 'insideBottom', offset: -5 }} />
                            <YAxis  label={{ value: 'Residual', angle: -90, position: 'insideLeft' }} tickFormatter={(value) => value.toExponential(1)} />
                            <Tooltip formatter={(value: number) => value.toExponential(4)} />
                            <Legend />
                            <Line type="monotone" dataKey="U" stroke="hsl(var(--chart-1))" dot={false} />
                            <Line type="monotone" dataKey="p" stroke="hsl(var(--chart-2))" dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card className="flex-1">
                <ScrollArea className="h-full w-full">
                <pre id="console-output" className="p-4 bg-secondary rounded-lg h-full overflow-auto text-xs font-mono">
                    {activeCase.consoleOutput.join('\n')}
                </pre>
                </ScrollArea>
            </Card>
          </TabsContent>
          <TabsContent value="ai-optimizer" className="flex-1 mt-4">
            <AiOptimizer />
          </TabsContent>
          <TabsContent value="block-mesh" className="flex-1 mt-4">
            <BlockMeshGenerator addFileToCase={addFileToCase} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
