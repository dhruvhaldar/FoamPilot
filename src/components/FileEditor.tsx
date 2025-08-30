import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface FileEditorProps {
  // Potentially accept props like file path, etc.
}

const FileEditor: React.FC<FileEditorProps> = () => {
  const [fileContent, setFileContent] = useState<string>('');
  const [fileName, setFileName] = useState<string | null>(null);
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
        setFileContent(content);
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
      // Here you would typically use an API to save the file to the server.
      // For this example, we'll just show a toast.
      toast.success(`Saved ${fileName}`);
      console.log("Saving content:", fileContent);
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
          // accept=".txt,.js,.ts,.tsx,.css" // Example file types
        />
      </div>
      <Textarea
        value={fileContent}
        onChange={(e) => setFileContent(e.target.value)}
        className="flex-grow w-full h-full p-2 resize-none"
        placeholder="Select a file to view and edit its content."
      />
    </div>
  );
};

export default FileEditor;
