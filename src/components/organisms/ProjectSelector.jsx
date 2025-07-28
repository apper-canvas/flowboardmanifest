import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { projectService } from "@/services/api/projectService";

const ProjectSelector = ({ selectedProject, onProjectSelect, onCreateProject }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await projectService.getAll();
      const activeProjects = data.filter(p => !p.archived);
      setProjects(activeProjects);
      
      // Auto-select first project if none selected
      if (activeProjects.length > 0 && !selectedProject) {
        onProjectSelect(activeProjects[0]);
      }
    } catch (err) {
      setError("Failed to load projects");
      console.error("Error loading projects:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-4 mb-6">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-gray-200 rounded w-32"></div>
          <div className="flex space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-10 bg-gray-200 rounded w-24"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4 mb-6 text-center">
        <div className="flex flex-col items-center space-y-2">
          <ApperIcon name="AlertCircle" className="w-8 h-8 text-red-500" />
          <p className="text-red-600 text-sm">{error}</p>
          <Button onClick={loadProjects} variant="outline" size="sm">
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  if (projects.length === 0) {
    return (
      <Card className="p-8 mb-6 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-50 to-primary-100 rounded-full flex items-center justify-center">
            <ApperIcon name="FolderPlus" className="w-8 h-8 text-primary-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 font-display">
              No Projects Yet
            </h3>
            <p className="text-gray-600">
              Create your first project to start organizing your tasks
            </p>
          </div>
          <Button onClick={onCreateProject} variant="primary" icon="Plus">
            Create Your First Project
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 font-display">
          Projects
        </h2>
        <Button 
          onClick={onCreateProject} 
          variant="outline" 
          size="sm" 
          icon="Plus"
        >
          New Project
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {projects.map(project => (
            <motion.button
              key={project.Id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onProjectSelect(project)}
              className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedProject?.Id === project.Id
                  ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: project.color }}
              />
              <span className="truncate max-w-[120px]">{project.title}</span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </Card>
  );
};

export default ProjectSelector;