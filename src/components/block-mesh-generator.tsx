'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { generateBlockMeshDict } from '@/ai/flows/generate-blockmesh-dict';
import { Boxes, FilePlus, Sparkles } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Editor from 'react-simple-code-editor';
import { ScrollArea } from './ui/scroll-area';

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

const verticesPlaceholder = `(0 0 0)
(1 0 0)
(1 1 0)
(0 1 0)
(0 0 1)
(1 0 1)
(1 1 1)
(0 1 1)`;

const blocksPlaceholder = `hex (0 1 2 3 4 5 6 7) (20 20 20) simpleGrading (1 1 1)`;
const boundaryPlaceholder = `movingWall
{
    type wall;
    faces
    (
        (3 7 6 2)
    );
}
fixedWalls
{
    type wall;
    faces
    (
        (0 4 7 3)
        (1 2 6 5)
        (0 1 5 4)
    );
}
frontAndBack
{
    type empty;
    faces
    (
        (0 3 2 1)
        (4 5 6 7)
    );
}`;

interface BlockMeshGeneratorProps {
    addFileToCase: (name: string, content: string) => void;
}

const CodeEditor = ({ value, onValueChange, placeholder, rows }: { value: string, onValueChange: (value: string) => void, placeholder: string, rows: number }) => {
    return (
        <div className="font-mono text-sm border rounded-md relative bg-background min-h-[80px]" style={{ height: `${rows * 1.5}rem`}}>
            <ScrollArea className="h-full w-full absolute">
                <Editor
                    value={value}
                    onValueChange={onValueChange}
                    highlight={code => (
                        <SyntaxHighlighter language="cpp" style={customStyle} PreTag="div" customStyle={{ margin: 0, padding: 0, background: 'transparent' }}>
                            {code}
                        </SyntaxHighlighter>
                    )}
                    padding={10}
                    className="w-full h-full"
                    style={{
                        fontFamily: '"Fira code", "Fira Mono", monospace',
                        fontSize: 14,
                    }}
                    placeholder={placeholder}
                />
            </ScrollArea>
        </div>
    )
}

export function BlockMeshGenerator({ addFileToCase }: BlockMeshGeneratorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    vertices: verticesPlaceholder,
    blocks: blocksPlaceholder,
    edges: '',
    boundary: boundaryPlaceholder,
    convertToMeters: '1',
  });
  const { toast } = useToast();

  const handleFormDataChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await generateBlockMeshDict(formData);
      setResult(response.blockMeshDictContent);
    } catch (error) {
      console.error('blockMeshDict generation failed:', error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: 'Could not generate the file. Please check your inputs and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFile = () => {
    if (result) {
        addFileToCase('blockMeshDict', result);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI `blockMeshDict` Generator</CardTitle>
        <CardDescription>
          Define your geometry and let the AI generate the `blockMeshDict` file for you.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
            <div>
                <Label htmlFor="convertToMeters">Convert To Meters</Label>
                <Input id="convertToMeters" value={formData.convertToMeters} onChange={(e) => handleFormDataChange('convertToMeters', e.target.value)} />
            </div>
            <div>
                <Label htmlFor="vertices">Vertices</Label>
                <CodeEditor value={formData.vertices} onValueChange={(v) => handleFormDataChange('vertices', v)} placeholder={verticesPlaceholder} rows={9} />
            </div>
            <div>
                <Label htmlFor="blocks">Blocks</Label>
                <CodeEditor value={formData.blocks} onValueChange={(v) => handleFormDataChange('blocks', v)} placeholder={blocksPlaceholder} rows={3} />
            </div>
            <div>
                <Label htmlFor="edges">Edges (Optional)</Label>
                <CodeEditor value={formData.edges} onValueChange={(v) => handleFormDataChange('edges', v)} placeholder="e.g., arc 1 5 (1.0 0.5 0)" rows={3} />
            </div>
             <div>
                <Label htmlFor="boundary">Boundary</Label>
                <CodeEditor value={formData.boundary} onValueChange={(v) => handleFormDataChange('boundary', v)} placeholder={boundaryPlaceholder} rows={15} />
            </div>
             <Button onClick={handleGenerate} disabled={isLoading}>
                <Sparkles className="mr-2 h-4 w-4" />
                {isLoading ? 'Generating...' : 'Generate File'}
            </Button>
        </div>
        <div className="space-y-4 flex flex-col">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg flex items-center gap-2"><Boxes className="text-accent-foreground h-5 w-5" />Generated `blockMeshDict`</h3>
            <Button onClick={handleAddFile} disabled={!result} size="sm">
                <FilePlus className="mr-2 h-4 w-4" />
                Add to Case
            </Button>
          </div>
          
          <div className="flex-1 flex flex-col min-h-0">
            {isLoading && (
              <div className="space-y-2 flex-1">
                <Skeleton className="h-full w-full" />
              </div>
            )}

            {result && (
                <div className="flex-1 rounded-lg bg-secondary overflow-auto min-h-0">
                  <SyntaxHighlighter language="cpp" style={customStyle} className="p-4 text-xs font-mono h-full" PreTag="pre">
                      {result}
                  </SyntaxHighlighter>
                </div>
            )}

            {!result && !isLoading && (
              <div className="flex items-center justify-center bg-secondary rounded-lg flex-1">
                  <p className="text-muted-foreground">Generated file will appear here.</p>
              </div>
            )}
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
