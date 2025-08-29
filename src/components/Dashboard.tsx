import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Folder, 
  FileText, 
  Cpu, 
  Boxes, 
  Terminal, 
  Workflow,
  Eye,
  Play,
  Settings,
  Book,
  Zap
} from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  status?: "available" | "beta" | "coming-soon";
  onClick?: () => void;
}

const FeatureCard = ({ title, description, icon, status = "available", onClick }: FeatureCardProps) => (
  <Card className="group cursor-pointer transition-all duration-300 hover:shadow-card hover:scale-[1.02] bg-gradient-card border-border/50" onClick={onClick}>
    <CardHeader className="pb-4">
      <div className="flex items-start justify-between">
        <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
          {icon}
        </div>
        {status !== "available" && (
          <Badge variant={status === "beta" ? "secondary" : "outline"} className="text-xs">
            {status === "beta" ? "Beta" : "Soon"}
          </Badge>
        )}
      </div>
      <CardTitle className="text-lg group-hover:text-primary transition-colors">
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <CardDescription className="text-muted-foreground leading-relaxed">
        {description}
      </CardDescription>
    </CardContent>
  </Card>
);

export const Dashboard = () => {
  const features = [
    {
      title: "Case Management",
      description: "Create, organize, and manage your OpenFOAM simulation cases with an intuitive file browser and project structure.",
      icon: <Folder className="h-5 w-5 text-primary" />,
      status: "available" as const
    },
    {
      title: "Code Editor",
      description: "Built-in syntax highlighting editor for OpenFOAM dictionaries with auto-completion and error detection.",
      icon: <FileText className="h-5 w-5 text-primary" />,
      status: "available" as const
    },
    {
      title: "AI Parameter Optimizer",
      description: "Get intelligent suggestions for solver settings, boundary conditions, and numerical schemes to improve performance.",
      icon: <Cpu className="h-5 w-5 text-primary" />,
      status: "beta" as const
    },
    {
      title: "AI blockMeshDict Generator",
      description: "Describe your geometry in simple terms and let AI generate the complete blockMeshDict configuration.",
      icon: <Boxes className="h-5 w-5 text-primary" />,
      status: "beta" as const
    },
    {
      title: "Real-time Console",
      description: "Monitor your simulation progress with live solver output, residual tracking, and performance metrics.",
      icon: <Terminal className="h-5 w-5 text-primary" />,
      status: "available" as const
    },
    {
      title: "Workflow Visualization",
      description: "Interactive guide showing the complete OpenFOAM workflow from preprocessing to post-processing.",
      icon: <Workflow className="h-5 w-5 text-primary" />,
      status: "available" as const
    },
    {
      title: "Geometry Viewer",
      description: "3D visualization of your mesh and geometry with interactive controls for inspection and validation.",
      icon: <Eye className="h-5 w-5 text-primary" />,
      status: "available" as const
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-primary">
                <Zap className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">FoamPilot</h1>
                <p className="text-sm text-muted-foreground">Modern GUI for OpenFOAM</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Book className="h-4 w-4 mr-2" />
                Documentation
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button size="sm" className="bg-gradient-primary hover:opacity-90">
                <Play className="h-4 w-4 mr-2" />
                New Case
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Streamline Your CFD Workflow
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            FoamPilot combines the power of OpenFOAM with modern AI capabilities to accelerate your 
            computational fluid dynamics simulations and reduce setup time.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center bg-gradient-card border-border/50">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">50%</div>
              <p className="text-muted-foreground">Faster Setup</p>
            </CardContent>
          </Card>
          <Card className="text-center bg-gradient-card border-border/50">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-accent mb-2">AI</div>
              <p className="text-muted-foreground">Powered Optimization</p>
            </CardContent>
          </Card>
          <Card className="text-center bg-gradient-card border-border/50">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-success mb-2">100%</div>
              <p className="text-muted-foreground">OpenFOAM Compatible</p>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-6 text-foreground">Features & Tools</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>

        {/* Getting Started */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="text-xl">Getting Started</CardTitle>
            <CardDescription>
              Follow these steps to set up your first OpenFOAM case with FoamPilot
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-primary text-primary-foreground font-bold text-sm min-w-[2rem] text-center">1</div>
                <div>
                  <h4 className="font-semibold mb-1">Create New Case</h4>
                  <p className="text-sm text-muted-foreground">Start with a template or create from scratch</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-primary text-primary-foreground font-bold text-sm min-w-[2rem] text-center">2</div>
                <div>
                  <h4 className="font-semibold mb-1">Configure Parameters</h4>
                  <p className="text-sm text-muted-foreground">Use AI assistance to optimize settings</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-primary text-primary-foreground font-bold text-sm min-w-[2rem] text-center">3</div>
                <div>
                  <h4 className="font-semibold mb-1">Run Simulation</h4>
                  <p className="text-sm text-muted-foreground">Monitor progress in real-time console</p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Button className="bg-gradient-primary hover:opacity-90">
                <Play className="h-4 w-4 mr-2" />
                Start Your First Case
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
