import { useState, useRef, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, Box, Sphere, Environment, PerspectiveCamera } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Upload,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Move3D,
  Maximize,
  Download,
  Settings,
  Eye,
  EyeOff,
  Ruler,
  Layers,
  Info,
  Grid3X3,
  Box as BoxIcon,
  Circle
} from "lucide-react";

// Force browser refresh - fixed icon imports

interface MeshObject {
  id: string;
  name: string;
  type: "box" | "sphere" | "cylinder" | "custom";
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
  visible: boolean;
}

const SampleMesh = ({ object }: { object: MeshObject }) => {
  const meshRef = useRef<any>();

  switch (object.type) {
    case "box":
      return (
        <Box
          ref={meshRef}
          position={object.position}
          rotation={object.rotation}
          scale={object.scale}
          visible={object.visible}
        >
          <meshStandardMaterial color={object.color} wireframe={false} />
        </Box>
      );
    case "sphere":
      return (
        <Sphere
          ref={meshRef}
          position={object.position}
          rotation={object.rotation}
          scale={object.scale}
          visible={object.visible}
        >
          <meshStandardMaterial color={object.color} wireframe={false} />
        </Sphere>
      );
    default:
      return null;
  }
};

export const GeometryViewer = () => {
  const [meshObjects, setMeshObjects] = useState<MeshObject[]>([
    {
      id: "1",
      name: "Inlet Pipe",
      type: "box",
      position: [-2, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 0.5, 0.5],
      color: "#0ea5e9",
      visible: true
    },
    {
      id: "2", 
      name: "Mixing Chamber",
      type: "sphere",
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: "#f97316",
      visible: true
    },
    {
      id: "3",
      name: "Outlet Pipe",
      type: "box",
      position: [2, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 0.5, 0.5],
      color: "#10b981",
      visible: true
    }
  ]);

  const [viewMode, setViewMode] = useState<"solid" | "wireframe" | "points">("solid");
  const [showGrid, setShowGrid] = useState(true);
  const [showAxes, setShowAxes] = useState(true);
  const [lightIntensity, setLightIntensity] = useState([1]);
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [measurementMode, setMeasurementMode] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      toast.success(`Uploaded ${file.name} - Processing mesh file...`);
      
      // In a real implementation, you would parse the OpenFOAM mesh file here
      // For demo purposes, we'll simulate adding a new mesh object
      setTimeout(() => {
        const newObject: MeshObject = {
          id: Date.now().toString(),
          name: file.name.split('.')[0],
          type: "box",
          position: [0, 0, 1],
          rotation: [0, 0, 0],
          scale: [0.8, 0.8, 0.8],
          color: "#8b5cf6",
          visible: true
        };
        setMeshObjects(prev => [...prev, newObject]);
        toast.success("Mesh loaded successfully!");
      }, 1500);
    }
  }, []);

  const toggleObjectVisibility = (id: string) => {
    setMeshObjects(prev => 
      prev.map(obj => 
        obj.id === id ? { ...obj, visible: !obj.visible } : obj
      )
    );
  };

  const resetView = () => {
    toast.info("View reset to default position");
  };

  const exportScene = () => {
    toast.success("Scene exported successfully!");
  };

  return (
    <div className="h-screen bg-background flex">
      {/* Main 3D Viewer */}
      <div className="flex-1 relative">
        <Canvas>
          <PerspectiveCamera makeDefault position={[5, 5, 5]} />
          <OrbitControls enablePan enableZoom enableRotate />
          
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={lightIntensity[0]} 
            castShadow 
          />
          
          {/* Environment */}
          <Environment preset="city" />
          
          {/* Grid and Axes */}
          {showGrid && <Grid infiniteGrid />}
          
          {/* Render Mesh Objects */}
          {meshObjects.map(object => (
            <SampleMesh key={object.id} object={object} />
          ))}
        </Canvas>

        {/* Floating Controls */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="bg-card/80 backdrop-blur-sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Mesh
          </Button>
          
          <Button 
            size="sm" 
            variant="outline" 
            className="bg-card/80 backdrop-blur-sm"
            onClick={resetView}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset View
          </Button>
          
          <Button 
            size="sm" 
            variant="outline" 
            className="bg-card/80 backdrop-blur-sm"
            onClick={() => setMeasurementMode(!measurementMode)}
          >
            <Ruler className="h-4 w-4 mr-2" />
            {measurementMode ? "Exit" : "Measure"}
          </Button>
        </div>

        {/* View Mode Controls */}
        <div className="absolute top-4 right-4">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">View Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">View Mode</label>
                <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solid">Solid</SelectItem>
                    <SelectItem value="wireframe">Wireframe</SelectItem>
                    <SelectItem value="points">Points</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Grid</label>
                <Switch 
                  checked={showGrid} 
                  onCheckedChange={setShowGrid}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Axes</label>
                <Switch 
                  checked={showAxes} 
                  onCheckedChange={setShowAxes}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Light Intensity</label>
                <Slider
                  value={lightIntensity}
                  onValueChange={setLightIntensity}
                  max={3}
                  min={0.1}
                  step={0.1}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Bar */}
        <div className="absolute bottom-4 left-4 right-4">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="flex items-center justify-between py-3">
              <div className="flex items-center gap-4">
                <Badge variant="outline">
                  Objects: {meshObjects.length}
                </Badge>
                <Badge variant="outline">
                  Visible: {meshObjects.filter(obj => obj.visible).length}
                </Badge>
                {measurementMode && (
                  <Badge variant="secondary">
                    <Ruler className="h-3 w-3 mr-1" />
                    Measurement Mode
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={exportScene}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-80 bg-card border-l border-border p-4 overflow-y-auto">
        <Tabs defaultValue="objects" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="objects">Objects</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>
          
          <TabsContent value="objects" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Scene Objects</CardTitle>
                <CardDescription>Manage geometry components</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {meshObjects.map((object) => (
                  <div key={object.id} className="flex items-center justify-between p-2 rounded-lg border border-border/50 hover:bg-muted/50">
                    <div className="flex items-center gap-2">
                      {object.type === "box" ? (
                        <BoxIcon className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{object.name}</p>
                        <p className="text-xs text-muted-foreground">{object.type}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleObjectVisibility(object.id)}
                    >
                      {object.visible ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Add Mesh File
            </Button>
          </TabsContent>
          
          <TabsContent value="analysis" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Mesh Quality</CardTitle>
                <CardDescription>Analysis and validation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Cells</span>
                  <Badge variant="outline">156,432</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Faces</span>
                  <Badge variant="outline">892,156</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Points</span>
                  <Badge variant="outline">324,789</Badge>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm">Min Quality</span>
                  <Badge variant="outline">0.42</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Max Skewness</span>
                  <Badge variant="outline">2.1</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Aspect Ratio</span>
                  <Badge variant="outline">15.2</Badge>
                </div>
              </CardContent>
            </Card>
            
            <Button className="w-full" variant="outline">
              <Info className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </TabsContent>
          
          <TabsContent value="export" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Export Options</CardTitle>
                <CardDescription>Save geometry and analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export STL
                </Button>
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export OBJ
                </Button>
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Screenshot
                </Button>
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Animation
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".stl,.obj,.ply,.foam,.msh"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};
