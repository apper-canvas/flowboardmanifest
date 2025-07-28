import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { projectService } from "@/services/api/projectService";
import { taskService } from "@/services/api/taskService";

const SettingsView = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    archivedProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [projects, tasks] = await Promise.all([
        projectService.getAll(),
        taskService.getAll()
      ]);

      const activeProjects = projects.filter(p => !p.archived);
      const archivedProjects = projects.filter(p => p.archived);
      const completedTasks = tasks.filter(t => t.status === "done");
      const pendingTasks = tasks.filter(t => t.status !== "done");

      setStats({
        totalProjects: projects.length,
        activeProjects: activeProjects.length,
        archivedProjects: archivedProjects.length,
        totalTasks: tasks.length,
        completedTasks: completedTasks.length,
        pendingTasks: pendingTasks.length
      });
    } catch (err) {
      console.error("Error loading stats:", err);
      toast.error("Failed to load statistics");
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      stats,
      version: "1.0"
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json"
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `flowboard-export-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Data exported successfully!");
  };

  const handleClearCompleted = () => {
    if (window.confirm("Are you sure you want to clear all completed tasks? This action cannot be undone.")) {
      toast.info("This feature would clear completed tasks in a real application");
    }
  };

  const statsCards = [
    {
      title: "Total Projects",
      value: stats.totalProjects,
      icon: "FolderOpen",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Active Projects",
      value: stats.activeProjects,
      icon: "Play",
      color: "from-green-500 to-green-600"
    },
    {
      title: "Total Tasks",
      value: stats.totalTasks,
      icon: "CheckSquare",
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Completed Tasks",
      value: stats.completedTasks,
      icon: "CheckCircle",
      color: "from-emerald-500 to-emerald-600"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-display">
          Settings
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your preferences and view application statistics
        </p>
      </div>

      {/* Statistics */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 font-display mb-4">
          Statistics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat) => (
            <Card key={stat.title} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {loading ? "..." : stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                  <ApperIcon name={stat.icon} className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Theme Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 font-display mb-4">
          Appearance
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Theme</h4>
              <p className="text-sm text-gray-500">Choose your preferred theme</p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1.5 text-sm bg-primary-500 text-white rounded-lg">
                Light
              </button>
              <button className="px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                Dark
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Animations</h4>
              <p className="text-sm text-gray-500">Enable smooth animations and transitions</p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary-500 transition-colors duration-200">
              <span className="inline-block h-4 w-4 translate-x-6 rounded-full bg-white transition-transform duration-200" />
            </button>
          </div>
        </div>
      </Card>

      {/* Data Management */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 font-display mb-4">
          Data Management
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Export Data</h4>
              <p className="text-sm text-gray-500">Download your projects and tasks as JSON</p>
            </div>
            <Button
              onClick={handleExportData}
              variant="outline"
              icon="Download"
              size="sm"
            >
              Export
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Clear Completed Tasks</h4>
              <p className="text-sm text-gray-500">Remove all completed tasks from archive</p>
            </div>
            <Button
              onClick={handleClearCompleted}
              variant="outline"
              icon="Trash2"
              size="sm"
            >
              Clear
            </Button>
          </div>
        </div>
      </Card>

      {/* About */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 font-display mb-4">
          About FlowBoard
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Version</span>
            <span className="font-medium text-gray-900">1.0.0</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Last Updated</span>
            <span className="font-medium text-gray-900">March 2024</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Built with</span>
            <span className="font-medium text-gray-900">React + Vite</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SettingsView;