import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format, parseISO, startOfWeek, endOfWeek, eachDayOfInterval, isWithinInterval, addDays, subDays } from "date-fns";
import ProjectSelector from "@/components/organisms/ProjectSelector";
import CreateProjectForm from "@/components/organisms/CreateProjectForm";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { projectService } from "@/services/api/projectService";
import { taskService } from "@/services/api/taskService";
import { cn } from "@/utils/cn";

const TimelineView = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timelineStart, setTimelineStart] = useState(new Date());
  const [timelineEnd, setTimelineEnd] = useState(addDays(new Date(), 30));

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      loadProjectTasks();
    }
  }, [selectedProject]);

  async function loadInitialData() {
    try {
      setLoading(true);
      const projects = await projectService.getAll();
      const activeProjects = projects.filter(p => p.status === "active");
      setProjects(activeProjects);
      
      if (activeProjects.length > 0) {
        setSelectedProject(activeProjects[0]);
      }
    } catch (err) {
      setError("Failed to load projects. Please try again.");
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  }

  async function loadProjectTasks() {
    if (!selectedProject) return;
    
    try {
      const projectTasks = await taskService.getByProject(selectedProject.Id);
      setTasks(projectTasks);
    } catch (err) {
      toast.error("Failed to load project tasks");
    }
  }

  async function handleCreateProject(projectData) {
    try {
      const newProject = await projectService.create(projectData);
      setProjects(prev => [...prev, newProject]);
      setSelectedProject(newProject);
      setShowCreateProject(false);
      toast.success("Project created successfully!");
    } catch (err) {
      toast.error("Failed to create project");
    }
  }

  function handleProjectSelect(project) {
    setSelectedProject(project);
  }

  function getPriorityColor(priority) {
    switch (priority) {
      case 'high': return 'from-red-500 to-red-600';
      case 'medium': return 'from-orange-500 to-orange-600';
      case 'low': return 'from-blue-500 to-blue-600';
      default: return 'from-gray-500 to-gray-600';
    }
  }

  function getStatusColor(status) {
    switch (status) {
      case 'done': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'todo': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  }

  function getTaskPosition(dueDate) {
    if (!dueDate) return 0;
    
    const taskDate = parseISO(dueDate);
    const totalDays = Math.ceil((timelineEnd - timelineStart) / (1000 * 60 * 60 * 24));
    const daysPassed = Math.ceil((taskDate - timelineStart) / (1000 * 60 * 60 * 24));
    
    return Math.max(0, Math.min(100, (daysPassed / totalDays) * 100));
  }

  function generateTimelineDates() {
    return eachDayOfInterval({
      start: timelineStart,
      end: timelineEnd
    });
  }

  const timelineDates = generateTimelineDates();
  const tasksWithDueDates = tasks.filter(task => task.dueDate);

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div className="space-y-6">
      <ProjectSelector
        selectedProject={selectedProject}
        onProjectSelect={handleProjectSelect}
        onCreateProject={() => setShowCreateProject(true)}
      />

      {showCreateProject && (
        <CreateProjectForm
          onSubmit={handleCreateProject}
          onCancel={() => setShowCreateProject(false)}
        />
      )}

      {selectedProject ? (
        <div className="space-y-6">
          {/* Timeline Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Timeline View</h2>
              <p className="text-gray-600 mt-1">
                Project: <span className="font-medium">{selectedProject.name}</span>
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-red-600 rounded"></div>
                  <span>High</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded"></div>
                  <span>Medium</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded"></div>
                  <span>Low</span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Container */}
          <Card className="p-6 overflow-x-auto">
            {tasksWithDueDates.length > 0 ? (
              <div className="min-w-[800px]">
                {/* Date Axis */}
                <div className="relative mb-8">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                    {timelineDates.map((date, index) => {
                      if (index % Math.ceil(timelineDates.length / 8) === 0) {
                        return (
                          <div key={date.toISOString()} className="text-sm text-gray-600 font-medium">
                            {format(date, 'MMM d')}
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>

                {/* Tasks Timeline */}
                <div className="relative h-96 overflow-y-auto">
                  {tasksWithDueDates.map((task, index) => {
                    const leftPosition = getTaskPosition(task.dueDate);
                    const topPosition = (index % 8) * 45 + 20;
                    
                    return (
                      <div
                        key={task.Id}
                        className="absolute group cursor-pointer transform hover:scale-105 transition-all duration-200"
                        style={{
                          left: `${leftPosition}%`,
                          top: `${topPosition}px`,
                          width: '200px',
                          zIndex: tasksWithDueDates.length - index
                        }}
                      >
                        {/* Task Block */}
                        <div className={cn(
                          "bg-gradient-to-r rounded-lg p-3 shadow-md border border-white/20",
                          getPriorityColor(task.priority)
                        )}>
                          <div className="text-white">
                            <div className="font-medium text-sm truncate mb-1">
                              {task.title}
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="text-xs opacity-90">
                                {format(parseISO(task.dueDate), 'MMM d')}
                              </div>
                              <div className="flex items-center space-x-1">
                                {/* Status Indicator */}
                                <div className={cn(
                                  "w-2 h-2 rounded-full",
                                  getStatusColor(task.status)
                                )}></div>
                                {/* Priority Badge */}
                                <ApperIcon 
                                  name={task.priority === 'high' ? 'AlertTriangle' : task.priority === 'medium' ? 'AlertCircle' : 'Minus'} 
                                  size={12} 
                                  className="text-white opacity-90"
                                />
                              </div>
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="mt-2 bg-white/20 rounded-full h-1">
                              <div 
                                className="bg-white rounded-full h-1 transition-all duration-300"
                                style={{
                                  width: task.status === 'done' ? '100%' : 
                                         task.status === 'in-progress' ? '60%' : '10%'
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                          <div className="bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg min-w-[250px]">
                            <div className="font-medium mb-1">{task.title}</div>
                            {task.description && (
                              <div className="text-gray-300 mb-2 text-xs">
                                {task.description.length > 100 
                                  ? task.description.substring(0, 100) + '...'
                                  : task.description
                                }
                              </div>
                            )}
                            <div className="flex items-center justify-between text-xs">
                              <span>Due: {format(parseISO(task.dueDate), 'MMM d, yyyy')}</span>
                              <Badge 
                                variant={task.status === 'done' ? 'success' : task.status === 'in-progress' ? 'info' : 'secondary'}
                                className="text-xs"
                              >
                                {task.status.replace('-', ' ')}
                              </Badge>
                            </div>
                            {/* Tooltip Arrow */}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <ApperIcon name="Calendar" size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Tasks with Due Dates</h3>
                <p className="text-gray-600">
                  Tasks with due dates will appear on the timeline. Add due dates to your tasks to see them here.
                </p>
              </div>
            )}
          </Card>
        </div>
      ) : (
        <Empty
          title="Select a Project"
          description="Choose a project from above to view its tasks on the timeline."
          actionText="Create First Project"
          onAction={() => setShowCreateProject(true)}
          icon="Calendar"
        />
      )}
    </div>
  );
};

export default TimelineView;