import { useState, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { projectService } from "@/services/api/projectService";
import { taskService } from "@/services/api/taskService";

const ArchiveView = () => {
  const [archivedProjects, setArchivedProjects] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("projects");

  useEffect(() => {
    loadArchivedData();
  }, []);

  const loadArchivedData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [projects, tasks] = await Promise.all([
        projectService.getAll(),
        taskService.getAll()
      ]);
      
      const archived = projects.filter(p => p.archived);
      const completed = tasks.filter(t => t.status === "done");
      
      setArchivedProjects(archived);
      setCompletedTasks(completed);
    } catch (err) {
      setError("Failed to load archived data. Please try again.");
      console.error("Error loading archived data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreProject = async (projectId) => {
    try {
      await projectService.unarchive(projectId);
      setArchivedProjects(prev => prev.filter(p => p.Id !== projectId));
      toast.success("Project restored successfully!");
    } catch (err) {
      toast.error("Failed to restore project");
      console.error("Error restoring project:", err);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to permanently delete this project? This action cannot be undone.")) {
      return;
    }

    try {
      await projectService.delete(projectId);
      setArchivedProjects(prev => prev.filter(p => p.Id !== projectId));
      toast.success("Project deleted permanently!");
    } catch (err) {
      toast.error("Failed to delete project");
      console.error("Error deleting project:", err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to permanently delete this task?")) {
      return;
    }

    try {
      await taskService.delete(taskId);
      setCompletedTasks(prev => prev.filter(t => t.Id !== taskId));
      toast.success("Task deleted permanently!");
    } catch (err) {
      toast.error("Failed to delete task");
      console.error("Error deleting task:", err);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadArchivedData} />;
  }

  const tabs = [
    { id: "projects", label: "Archived Projects", count: archivedProjects.length },
    { id: "tasks", label: "Completed Tasks", count: completedTasks.length }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">
            Archive
          </h1>
          <p className="text-gray-600 mt-1">
            View and manage your completed projects and tasks
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab.id
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
              <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === "projects" && (
        <div className="space-y-4">
          {archivedProjects.length === 0 ? (
            <Empty
              title="No Archived Projects"
              description="Projects you archive will appear here. You can restore them or delete them permanently."
              icon="Archive"
            />
          ) : (
            archivedProjects.map((project) => (
              <Card key={project.Id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: project.color }}
                      />
                      <h3 className="text-lg font-semibold text-gray-900 font-display">
                        {project.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 mb-3">
                      {project.description}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
                      Created {format(new Date(project.createdAt), "MMM dd, yyyy")}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      onClick={() => handleRestoreProject(project.Id)}
                      variant="outline"
                      size="sm"
                      icon="RotateCcw"
                    >
                      Restore
                    </Button>
                    <Button
                      onClick={() => handleDeleteProject(project.Id)}
                      variant="danger"
                      size="sm"
                      icon="Trash2"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === "tasks" && (
        <div className="space-y-4">
          {completedTasks.length === 0 ? (
            <Empty
              title="No Completed Tasks"
              description="Tasks you complete will appear here. You can review your accomplishments or delete them permanently."
              icon="CheckCircle"
            />
          ) : (
            completedTasks.map((task) => (
              <Card key={task.Id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <ApperIcon name="CheckCircle" className="w-5 h-5 text-green-500" />
                      <h3 className="font-medium text-gray-900">
                        {task.title}
                      </h3>
                      <Badge variant={task.priority} className="text-xs">
                        {task.priority}
                      </Badge>
                    </div>
                    {task.description && (
                      <p className="text-gray-600 text-sm mb-2 ml-8">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 text-sm text-gray-500 ml-8">
                      {task.completedAt && (
                        <div className="flex items-center">
                          <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
                          Completed {format(new Date(task.completedAt), "MMM dd, yyyy")}
                        </div>
                      )}
                      {task.dueDate && (
                        <div className="flex items-center">
                          <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
                          Due {format(new Date(task.dueDate), "MMM dd")}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={() => handleDeleteTask(task.Id)}
                    variant="ghost"
                    size="sm"
                    icon="Trash2"
                    className="text-gray-400 hover:text-red-600"
                  />
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ArchiveView;