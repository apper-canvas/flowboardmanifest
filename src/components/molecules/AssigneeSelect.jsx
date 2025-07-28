import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';

const assigneeOptions = [
  { value: "", label: "Unassigned", avatar: null },
  { value: "john-doe", label: "John Doe", avatar: "👨‍💻" },
  { value: "jane-smith", label: "Jane Smith", avatar: "👩‍🎨" },
  { value: "mike-johnson", label: "Mike Johnson", avatar: "👨‍💼" },
  { value: "sarah-wilson", label: "Sarah Wilson", avatar: "👩‍🔬" },
  { value: "david-brown", label: "David Brown", avatar: "👨‍🚀" }
];

function AssigneeSelect({ value, onChange, className, error }) {
  const selectedAssignee = assigneeOptions.find(option => option.value === value);

  return (
    <div className={cn("relative", className)}>
      <select
        value={value}
        onChange={onChange}
        className={cn(
          "w-full px-4 py-3 bg-white border border-gray-200 rounded-xl",
          "text-gray-700 placeholder-gray-400",
          "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
          "transition-all duration-200 ease-in-out",
          "appearance-none cursor-pointer",
          error && "border-red-300 focus:ring-red-500 focus:border-red-500"
        )}
      >
        {assigneeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
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