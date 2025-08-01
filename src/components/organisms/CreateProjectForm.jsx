import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import CreateAssigneeForm from "@/components/organisms/CreateAssigneeForm";
import { assigneeService } from "@/services/api/assigneeService";
const CreateProjectForm = ({ onSubmit, onCancel }) => {
const [formData, setFormData] = useState({
    title: "",
    description: "",
    color: "#5B6CFF",
    assignee: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [assignees, setAssignees] = useState([]);
  const [assigneeLoading, setAssigneeLoading] = useState(true);
  const [showAssigneeForm, setShowAssigneeForm] = useState(false);
useEffect(() => {
    loadAssignees();
  }, []);

  const loadAssignees = async () => {
    try {
      setAssigneeLoading(true);
      const assigneeList = await assigneeService.getAll();
      setAssignees(assigneeList);
    } catch (error) {
      toast.error("Failed to load assignees");
    } finally {
      setAssigneeLoading(false);
    }
  };

  const colorOptions = [
    "#5B6CFF", "#FF6B9D", "#2ECC71", "#F39C12", 
    "#E74C3C", "#9B59B6", "#3498DB", "#1ABC9C"
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (err) {
      console.error("Error creating project:", err);
    } finally {
      setLoading(false);
    }
  };

const handleChange = (field, value) => {
    if (field === "assignee" && value === "add_new") {
      setShowAssigneeForm(true);
      return;
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleAssigneeCreated = (newAssignee) => {
    setAssignees(prev => [...prev, newAssignee]);
    setFormData(prev => ({ ...prev, assignee: newAssignee.Id.toString() }));
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 font-display">
          Create New Project
        </h2>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <ApperIcon name="X" className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Project Title"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Enter project title..."
          error={errors.title}
          required
        />

<FormField
          label="Description"
          type="textarea"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Describe your project..."
          rows={3}
        />

<FormField
          label="Assignee"
          type="select"
          value={formData.assignee}
          onChange={(e) => handleChange("assignee", e.target.value)}
          placeholder="Select assignee..."
          options={[
            { value: "", label: "Select assignee..." },
            ...assignees.map(assignee => ({
              value: assignee.Id.toString(),
              label: assignee.name
            })),
            { value: "add_new", label: "➕ Add New Assignee" }
          ]}
          disabled={assigneeLoading}
        />
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Project Color
          </label>
          <div className="flex flex-wrap gap-2">
            {colorOptions.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => handleChange("color", color)}
                className={`w-8 h-8 rounded-full transition-all duration-200 ${
                  formData.color === color
                    ? "ring-2 ring-offset-2 ring-gray-400 scale-110"
                    : "hover:scale-105"
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            icon="Plus"
          >
            Create Project
          </Button>
        </div>
      </form>
<CreateAssigneeForm
        isOpen={showAssigneeForm}
        onClose={() => setShowAssigneeForm(false)}
        onAssigneeCreated={handleAssigneeCreated}
      />
    </div>
  );
};

export default CreateProjectForm;