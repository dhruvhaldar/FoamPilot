import { useState } from "react";
import { Dashboard } from "@/components/Dashboard";
import { Sidebar } from "@/components/Sidebar";
import { GeometryViewer } from "@/components/GeometryViewer";
import CaseManager from "@/components/CaseManager";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "cases":
        return <CaseManager />;
      case "editor":
        return <div className="p-8"><h2 className="text-2xl font-bold">File Editor - Coming Soon</h2></div>;
      case "ai-optimizer":
        return <div className="p-8"><h2 className="text-2xl font-bold">AI Parameter Optimizer - Coming Soon</h2></div>;
      case "mesh-generator":
        return <div className="p-8"><h2 className="text-2xl font-bold">AI Mesh Generator - Coming Soon</h2></div>;
      case "console":
        return <div className="p-8"><h2 className="text-2xl font-bold">Real-time Console - Coming Soon</h2></div>;
      case "workflow":
        return <div className="p-8"><h2 className="text-2xl font-bold">Workflow Visualization - Coming Soon</h2></div>;
      case "geometry":
        return <GeometryViewer />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className={activeTab === "geometry" ? "flex-1" : "flex-1 lg:ml-64"}>
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
