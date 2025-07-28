import React, { useEffect, useState } from "react";
import { assigneeService } from "@/services/api/assigneeService";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";


const AssigneeSelect = ({ value, onChange, className, error, onAddNew }) => {
  const [assignees, setAssignees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssignees();
  }, []);

  const loadAssignees = async () => {
    try {
      const assigneeList = await assigneeService.getAll();
      setAssignees(assigneeList);
    } catch (error) {
      console.error("Failed to load assignees:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === "add_new" && onAddNew) {
      onAddNew();
      return;
    }
    onChange(e);
  };

const selectedAssignee = assignees.find(a => a.Id.toString() === value);

  return (
    <div className={cn("relative", className)}>
      <select
        value={value}
        onChange={handleSelectChange}
        className={cn(
          "w-full px-4 py-3 bg-white border border-gray-200 rounded-xl",
          "text-gray-700 placeholder-gray-400",
          "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
          "transition-all duration-200 ease-in-out",
          "appearance-none cursor-pointer",
          error && "border-red-300 focus:ring-red-500 focus:border-red-500"
        )}
      >
<option value="">Unassigned</option>
        {assignees.map((assignee) => (
          <option key={assignee.Id} value={assignee.Id.toString()}>
            {assignee.name}
          </option>
        ))}
        {onAddNew && (
          <option value="add_new">➕ Add New Assignee</option>
        )}
      </select>
      
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <ApperIcon name="ChevronDown" size={20} className="text-gray-400" />
      </div>
      
      {selectedAssignee && selectedAssignee.avatar && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <span className="text-lg">{selectedAssignee.avatar}</span>
        </div>
      )}
      
      {selectedAssignee && selectedAssignee.avatar && (
        <style jsx>{`
          select {
            padding-left: 3rem;
          }
        `}</style>
      )}
    </div>
  );
}

export default AssigneeSelect;