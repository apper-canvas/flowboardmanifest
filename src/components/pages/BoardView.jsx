import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ProjectSelector from "@/components/organisms/ProjectSelector";
import KanbanBoard from "@/components/organisms/KanbanBoard";
import CreateProjectForm from "@/components/organisms/CreateProjectForm";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import { projectService } from "@/services/api/projectService";

const BoardView = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError("");
      const projects = await projectService.getAll();
      const activeProjects = projects.filter(p => !p.archived);
      
      if (activeProjects.length > 0) {
        setSelectedProject(activeProjects[0]);
      }
    } catch (err) {
      setError("Failed to load projects. Please try again.");
      console.error("Error loading projects:", err);
    } finally {
      setLoading(false);
    }
  };

const handleCreateProject = async (projectData) => {
  try {
    const newProject = await projectService.create(projectData);
    setSelectedProject(newProject);
    setShowCreateProject(false);
    toast.success("Project created successfully!");
    
    // Reload projects to show the newly created project
    await loadInitialData();
  } catch (err) {
    toast.error("Failed to create project");
    console.error("Error creating project:", err);
  }
};

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadInitialData} />;
  }

  return (
    <div className="space-y-6">
      <ProjectSelector
        selectedProject={selectedProject}
        onProjectSelect={handleProjectSelect}
        onCreateProject={() => setShowCreateProject(true)}
      />

      {selectedProject ? (
        <KanbanBoard
          projectId={selectedProject.Id}
          searchQuery={searchQuery}
        />
      ) : (
        <Empty
          title="Select a Project"
          description="Choose a project from above to view and manage its tasks on the kanban board."
          actionText="Create First Project"
          onAction={() => setShowCreateProject(true)}
          icon="Kanban"
        />
      )}

      {/* Create Project Modal */}
      {showCreateProject && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <CreateProjectForm
              onSubmit={handleCreateProject}
              onCancel={() => setShowCreateProject(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardView;