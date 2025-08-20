'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAppContext } from './foam-pilot-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { File, PlayCircle, Save, Terminal, Sparkles, FolderOpen, CircleDot, Boxes, LineChart, Waypoints } from 'lucide-react';
import { AiOptimizer } from './ai-optimizer';
import type { CaseFile } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { BlockMeshGenerator } from './block-mesh-generator';
import Editor from 'react-simple-code-editor';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { CartesianGrid, Line, XAxis, YAxis, ComposedChart } from 'recharts';
import { WorkflowVisualizer } from './workflow-visualizer';


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

function ConsoleChart({ consoleOutput }: { consoleOutput: string[] }) {
    const chartData = useMemo(() => {
        return consoleOutput
            .map(line => {
                const match = line.match(/Time = (\d+(\.\d+)?)/);
                if (match) {
                    return { time: parseFloat(match[1]), value: Math.random() * 10 }; // Using random data for visualization
                }
                return null;
            })
            .filter(item => item !== null);
    }, [consoleOutput]);

    if (chartData.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Run simulation to see chart data.</p>
            </div>
        )
    }

    const chartConfig = {
        value: {
            label: "Value",
            color: "hsl(var(--chart-1))",
        },
    }

    return (
        <ChartContainer config={chartConfig} className="h-full w-full">
            <ComposedChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="time" type="number" name="Time" />
                <YAxis />
                <ChartTooltip
                    content={<ChartTooltipContent indicator="dot" />}
                />
                <Line dataKey="value" type="monotone" stroke="var(--color-value)" strokeWidth={2} dot={false} />
            </ComposedChart>
        </ChartContainer>
    );
}

export function MainView() {
  const { activeCase, dispatch } = useAppContext();
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [editorContent, setEditorContent] = useState('');
  const [isUnsaved, setIsUnsaved] = useState(false);
  const { toast } = useToast();

  const selectedFile = activeCase?.files.find(f => f.id === selectedFileId);

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
      const newOutput = `Time = ${iteration}\n...solving for U, p, ...\n`;
      // A bit of a hack to get the latest console output without state dependency issues in interval
      dispatch({ type: 'UPDATE_CASE', payload: { id: activeCase.id, consoleOutput: [...(document.getElementById('console-output')?.textContent?.split('\n') || []), newOutput] } });


      if (iteration >= 10) {
        clearInterval(interval);
        dispatch({
          type: 'UPDATE_CASE',
          payload: { id: activeCase!.id, isRunning: false, consoleOutput: [...(document.getElementById('console-output')?.textContent?.split('\n') || []), newOutput, 'Simulation finished.'] },
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
            <TabsTrigger value="workflow"><Waypoints className="mr-2 h-4 w-4" />Workflow</TabsTrigger>
            <TabsTrigger value="console"><Terminal className="mr-2 h-4 w-4" />Console</TabsTrigger>
            <TabsTrigger value="visualization"><LineChart className="mr-2 h-4 w-4" />Visualization</TabsTrigger>
            <TabsTrigger value="ai-optimizer"><Sparkles className="mr-2 h-4 w-4" />AI Optimizer</TabsTrigger>
            <TabsTrigger value="block-mesh"><Boxes className="mr-2 h-4 w-4" />BlockMesh</TabsTrigger>
          </TabsList>
          
          <TabsContent value="editor" className="flex-1 flex flex-col min-h-0 mt-4">
            <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium">{selectedFile?.name || 'No file selected'}</p>
                <Button onClick={handleSave} disabled={!isUnsaved}>
                    <Save className="mr-2 h-4 w-4" />
                    Save
                </Button>
            </div>
            <div className='flex-1 font-mono text-sm border rounded-md relative bg-background min-h-0'>
              <ScrollArea className="h-full w-full absolute">
                <Editor
                    value={editorContent}
                    onValueChange={handleContentChange}
                    highlight={code => (
                      <SyntaxHighlighter language="cpp" style={customStyle} PreTag="div" customStyle={{ margin: 0, padding: 0, background: 'transparent', height: '100%', width: '100%' }}>
                        {code}
                      </SyntaxHighlighter>
                    )}
                    padding={10}
                    className="w-full h-full"
                    style={{
                      fontFamily: '"Fira code", "Fira Mono", monospace',
                      fontSize: 14,
                    }}
                    placeholder="Select a file to edit..."
                  />
                </ScrollArea>
            </div>
          </TabsContent>
          <TabsContent value="workflow" className="flex-1 mt-4 flex flex-col min-h-0">
            <ScrollArea className="h-full">
                <WorkflowVisualizer />
            </ScrollArea>
          </TabsContent>
          <TabsContent value="console" className="flex-1 mt-4 flex flex-col min-h-0">
            <Card className="flex-1 flex flex-col">
                <ScrollArea className="h-full w-full">
                  <pre id="console-output" className="p-4 bg-secondary rounded-lg h-full overflow-auto text-xs font-mono">
                    {activeCase.consoleOutput.join('\n')}
                  </pre>
                </ScrollArea>
            </Card>
          </TabsContent>
           <TabsContent value="visualization" className="flex-1 mt-4 flex flex-col min-h-0">
            <ScrollArea className="h-full">
              <Card className="h-full flex flex-col">
                  <CardContent className="h-full w-full p-4 flex-1">
                      <ConsoleChart consoleOutput={activeCase.consoleOutput} />
                  </CardContent>
              </Card>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="ai-optimizer" className="flex-1 mt-4 flex flex-col min-h-0">
            <ScrollArea className="h-full">
              <AiOptimizer />
            </ScrollArea>
          </TabsContent>
          <TabsContent value="block-mesh" className="flex-1 mt-4 flex flex-col min-h-0">
            <ScrollArea className="h-full">
              <BlockMeshGenerator addFileToCase={addFileToCase} />
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
