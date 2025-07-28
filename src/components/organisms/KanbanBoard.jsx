import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import TaskCard from "@/components/organisms/TaskCard";
import CreateTaskForm from "@/components/organisms/CreateTaskForm";
import ApperIcon from "@/components/ApperIcon";
import { taskService } from "@/services/api/taskService";

const KanbanBoard = ({ projectId, searchQuery }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [draggedTask, setDraggedTask] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState({ show: false, status: null });

  const columns = [
    { id: "todo", title: "To Do", color: "from-gray-500 to-gray-600" },
    { id: "in-progress", title: "In Progress", color: "from-blue-500 to-blue-600" },
    { id: "done", title: "Done", color: "from-green-500 to-green-600" }
  ];

  useEffect(() => {
    if (projectId) {
      loadTasks();
    }
  }, [projectId]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await taskService.getByProjectId(projectId);
      setTasks(data);
    } catch (err) {
      setError("Failed to load tasks. Please try again.");
      console.error("Error loading tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return task.title.toLowerCase().includes(query) || 
           task.description.toLowerCase().includes(query);
  });

  const getTasksByStatus = (status) => {
    return filteredTasks.filter(task => task.status === status);
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
    e.target.classList.add("dragging");
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove("dragging");
    setDraggedTask(null);
    
    // Remove drag-over class from all columns
    document.querySelectorAll(".kanban-column").forEach(col => {
      col.classList.remove("drag-over");
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add("drag-over");
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      e.currentTarget.classList.remove("drag-over");
    }
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    e.currentTarget.classList.remove("drag-over");
    
    if (!draggedTask || draggedTask.status === newStatus) return;

    try {
      const updatedTask = await taskService.updateStatus(draggedTask.Id, newStatus);
      setTasks(prev => prev.map(task => 
        task.Id === draggedTask.Id ? updatedTask : task
      ));
      
      toast.success(`Task moved to ${columns.find(col => col.id === newStatus)?.title}`);
    } catch (err) {
      toast.error("Failed to update task status");
      console.error("Error updating task:", err);
    }
  };

const handleCreateTask = async (taskData) => {
    try {
      const newTask = await taskService.create({
        ...taskData,
        projectId: parseInt(projectId),
        assignee: taskData.assignee || ""
      });
      setTasks(prev => [...prev, newTask]);
      setShowCreateForm({ show: false, status: null });
      toast.success("Task created successfully!");
    } catch (err) {
      toast.error("Failed to create task");
      console.error("Error creating task:", err);
    }
  };

const handleUpdateTask = async (taskId, updates) => {
    try {
      const updatedTask = await taskService.update(taskId, {
        ...updates,
        assignee: updates.assignee !== undefined ? updates.assignee : undefined
      });
      setTasks(prev => prev.map(task => 
        task.Id === taskId ? updatedTask : task
      ));
      toast.success("Task updated successfully!");
    } catch (err) {
      toast.error("Failed to update task");
      console.error("Error updating task:", err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(task => task.Id !== taskId));
      toast.success("Task deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete task");
      console.error("Error deleting task:", err);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(column => (
          <Card key={column.id} className="p-4">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-20"></div>
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-gray-100 rounded-lg p-3 space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center space-y-4">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500" />
          <p className="text-red-600">{error}</p>
          <button
            onClick={loadTasks}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            Try Again
          </button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(column => {
          const columnTasks = getTasksByStatus(column.id);
          
          return (
            <Card
              key={column.id}
              className="kanban-column p-4 min-h-[500px] transition-all duration-200"
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${column.color}`}></div>
                  <h3 className="font-semibold text-gray-900 font-display">
                    {column.title}
                  </h3>
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                    {columnTasks.length}
                  </span>
                </div>
                <button
                  onClick={() => setShowCreateForm({ show: true, status: column.id })}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors duration-200"
                  title="Add new task"
                >
                  <ApperIcon name="Plus" className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <AnimatePresence>
                  {columnTasks.map(task => (
                    <motion.div
                      key={task.Id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                    >
<TaskCard
                        task={task}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onUpdate={handleUpdateTask}
                        onDelete={handleDeleteTask}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>

                {columnTasks.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <ApperIcon name="Plus" className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No tasks yet</p>
                    <p className="text-xs">Drop tasks here or click + to add</p>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Create Task Modal */}
      {showCreateForm.show && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <CreateTaskForm
              initialStatus={showCreateForm.status}
              onSubmit={handleCreateTask}
              onCancel={() => setShowCreateForm({ show: false, status: null })}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;