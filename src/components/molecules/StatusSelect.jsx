import { cn } from "@/utils/cn";

const StatusSelect = ({ 
  value, 
  onChange, 
  className 
}) => {
  const statuses = [
    { value: "todo", label: "To Do", color: "text-gray-600" },
    { value: "in-progress", label: "In Progress", color: "text-blue-600" },
    { value: "done", label: "Done", color: "text-green-600" }
  ];

  return (
    <div className={cn("space-y-2", className)}>
      <label className="block text-sm font-medium text-gray-700">Status</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-body focus:outline-none focus:ring-2 focus:ring-offset-1 focus:border-primary-500 focus:ring-primary-500 transition-all duration-200"
      >
        {statuses.map((status) => (
          <option key={status.value} value={status.value}>
            {status.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default StatusSelect;