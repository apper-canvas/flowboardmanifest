import { useState } from "react";
import { format } from "date-fns";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import EditTaskForm from "@/components/organisms/EditTaskForm";

const TaskCard = ({ task, onDragStart, onDragEnd, onUpdate, onDelete }) => {
  const [showEditForm, setShowEditForm] = useState(false);

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case "high": return "high";
      case "medium": return "medium";
      case "low": return "low";
      default: return "default";
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "done";

  const handleEdit = () => {
    setShowEditForm(true);
  };

  const handleUpdate = async (updates) => {
    await onUpdate(task.Id, updates);
    setShowEditForm(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      onDelete(task.Id);
    }
  };

  return (
    <>
      <Card 
        className="p-3 cursor-move hover:shadow-card-elevated transition-all duration-200 group"
        draggable
        onDragStart={(e) => onDragStart(e, task)}
        onDragEnd={onDragEnd}
      >
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h4 className="font-medium text-gray-900 text-sm leading-tight flex-1 pr-2">
              {task.title}
            </h4>
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={handleEdit}
                className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors duration-150"
                title="Edit task"
              >
                <ApperIcon name="Edit2" className="w-3 h-3" />
              </button>
              <button
                onClick={handleDelete}
                className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors duration-150"
                title="Delete task"
              >
                <ApperIcon name="Trash2" className="w-3 h-3" />
              </button>
            </div>
          </div>

          {task.description && (
            <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}

<div className="flex items-center justify-between">
            <Badge variant={getPriorityVariant(task.priority)} className="text-xs">
              {task.priority}
            </Badge>
            
            {task.dueDate && (
              <div className={`flex items-center space-x-1 text-xs ${
                isOverdue ? "text-red-600" : "text-gray-500"
              }`}>
                <ApperIcon name="Calendar" className="w-3 h-3" />
                <span>
                  {format(new Date(task.dueDate), "MMM dd")}
                </span>
                {isOverdue && (
                  <ApperIcon name="AlertCircle" className="w-3 h-3 text-red-500" />
                )}
              </div>
            )}
          </div>
          
          {/* Assignee Section */}
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <ApperIcon name="User" className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500">
                {task.assignee ? (
                  <span className="flex items-center space-x-1">
                    <span className="text-xs">
                      {task.assignee === 'john-doe' && '👨‍💻 John Doe'}
                      {task.assignee === 'jane-smith' && '👩‍🎨 Jane Smith'}
                      {task.assignee === 'mike-johnson' && '👨‍💼 Mike Johnson'}
                      {task.assignee === 'sarah-wilson' && '👩‍💻 Sarah Wilson'}
                      {task.assignee === 'david-brown' && '👨‍🔧 David Brown'}
                    </span>
                  </span>
                ) : (
                  <span className="text-gray-400">Unassigned</span>
                )}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Edit Task Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <EditTaskForm
              task={task}
              onSubmit={handleUpdate}
              onCancel={() => setShowEditForm(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default TaskCard;