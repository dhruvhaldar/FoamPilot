import React, { useState, useRef, useCallback } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-cpp';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const FileEditor: React.FC = () => {
  const [code, setCode] = useState(`#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`);
  const [fileName, setFileName] = useState<string | null>('example.cpp');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelectClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCode(content);
        toast.success(`Loaded ${file.name}`);
      };
      reader.onerror = () => {
        toast.error(`Error reading ${file.name}`);
      };
      reader.readAsText(file);
    }
  }, []);

  const handleSave = () => {
    if (fileName) {
      toast.success(`Saved ${fileName}`);
      console.log("Saving content:", code);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-2 border-b">
        <Button onClick={handleFileSelectClick}>Open File</Button>
        {fileName && <span className="text-sm font-medium">{fileName}</span>}
        <Button onClick={handleSave} disabled={!fileName}>Save</Button>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
          accept=".cpp,.h,.txt"
        />
      </div>
      <Editor
        value={code}
        onValueChange={code => setCode(code)}
        highlight={code => highlight(code, languages.cpp, 'cpp')}
        padding={10}
        style={{
          fontFamily: '"Fira Mono", "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
          fontSize: 14,
          backgroundColor: '#2d2d2d',
          height: '100%',
          overflow: 'auto'
        }}
      />
    </div>
  );
};

export default FileEditor;
