import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Home,
  Folder,
  FileText,
  Cpu,
  Boxes,
  Terminal,
  Workflow,
  Eye,
  Settings,
  Menu,
  X,
  Zap
} from "lucide-react";

interface SidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "cases", label: "Case Manager", icon: Folder },
  { id: "editor", label: "File Editor", icon: FileText },
  { id: "ai-optimizer", label: "AI Optimizer", icon: Cpu, badge: "Beta" },
  { id: "mesh-generator", label: "Mesh Generator", icon: Boxes, badge: "Beta" },
  { id: "console", label: "Real-time Console", icon: Terminal },
  { id: "workflow", label: "Workflow Guide", icon: Workflow },
  { id: "geometry", label: "Geometry Viewer", icon: Eye },
];

export const Sidebar = ({ activeTab = "dashboard", onTabChange }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="sm"
        className="lg:hidden fixed top-4 left-4 z-50 bg-card border-border"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border z-50 transition-all duration-300",
          isCollapsed ? "w-16" : "w-64",
          "lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center justify-between">
              {!isCollapsed && (
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-gradient-primary">
                    <Zap className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="font-bold text-sidebar-foreground">FoamPilot</h2>
                    <p className="text-xs text-sidebar-foreground/60">CFD Interface</p>
                  </div>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="hidden lg:flex p-2 hover:bg-sidebar-accent"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                <Menu className="h-4 w-4 text-sidebar-foreground" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-10",
                  activeTab === item.id 
                    ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90" 
                    : "hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground",
                  isCollapsed && "justify-center px-2"
                )}
                onClick={() => {
                  onTabChange?.(item.id);
                  setIsMobileOpen(false);
                }}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <Badge 
                        variant={item.badge === "Beta" ? "secondary" : "outline"} 
                        className="text-xs ml-auto"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 hover:bg-sidebar-accent text-sidebar-foreground",
                isCollapsed && "justify-center px-2"
              )}
            >
              <Settings className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && <span>Settings</span>}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};
