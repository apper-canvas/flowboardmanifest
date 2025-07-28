import { useState } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { assigneeService } from "@/services/api/assigneeService";

const CreateAssigneeForm = ({ isOpen, onClose, onAssigneeCreated }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Member",
    avatar: "👤"
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const roleOptions = [
    { value: "Developer", label: "Developer" },
    { value: "Designer", label: "Designer" },
    { value: "Manager", label: "Manager" },
    { value: "Tester", label: "Tester" },
    { value: "DevOps", label: "DevOps" },
    { value: "Member", label: "Member" }
  ];

  const avatarOptions = [
    "👤", "👨‍💻", "👩‍💻", "👨‍🎨", "👩‍🎨", "👨‍💼", "👩‍💼", 
    "👨‍🔬", "👩‍🔬", "👨‍🚀", "👩‍🚀", "🧑‍💼", "🧑‍🎨", "🧑‍💻"
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.role) {
      newErrors.role = "Role is required";
    }

    return newErrors;
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const newAssignee = await assigneeService.create(formData);
      toast.success(`Assignee ${newAssignee.name} created successfully!`);
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        role: "Member",
        avatar: "👤"
      });
      setErrors({});
      
      // Notify parent and close modal
      onAssigneeCreated(newAssignee);
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to create assignee");
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      email: "",
      role: "Member",
      avatar: "👤"
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Add New Assignee</h2>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Full Name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter full name..."
              error={errors.name}
              required
            />

            <FormField
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Enter email address..."
              error={errors.email}
              required
            />

            <FormField
              label="Role"
              type="select"
              value={formData.role}
              onChange={(e) => handleChange("role", e.target.value)}
              options={roleOptions}
              error={errors.role}
              required
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Avatar
              </label>
              <div className="grid grid-cols-7 gap-2">
                {avatarOptions.map((avatar) => (
                  <button
                    key={avatar}
                    type="button"
                    onClick={() => handleChange("avatar", avatar)}
                    className={`
                      w-10 h-10 rounded-lg border-2 flex items-center justify-center text-xl
                      transition-all duration-200 hover:scale-110
                      ${formData.avatar === avatar 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>

            {errors.submit && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancel}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                className="flex-1"
              >
                {loading ? "Creating..." : "Create Assignee"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAssigneeForm;