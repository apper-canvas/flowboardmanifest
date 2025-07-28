import { cn } from "@/utils/cn";
import Badge from "@/components/atoms/Badge";

const PrioritySelect = ({ 
  value, 
  onChange, 
  className 
}) => {
  const priorities = [
    { value: "low", label: "Low", variant: "low" },
    { value: "medium", label: "Medium", variant: "medium" },
    { value: "high", label: "High", variant: "high" }
  ];

  return (
    <div className={cn("space-y-2", className)}>
      <label className="block text-sm font-medium text-gray-700">Priority</label>
      <div className="flex gap-2">
        {priorities.map((priority) => (
          <button
            key={priority.value}
            type="button"
            onClick={() => onChange(priority.value)}
            className={cn(
              "transition-all duration-200",
              value === priority.value ? "scale-110" : "opacity-70 hover:opacity-90"
            )}
          >
            <Badge variant={priority.variant}>
              {priority.label}
            </Badge>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PrioritySelect;