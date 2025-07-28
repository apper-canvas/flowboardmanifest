import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Textarea from "@/components/atoms/Textarea";
import Input from "@/components/atoms/Input";
import { cn } from "@/utils/cn";

function FormField({ 
  label, 
  error, 
  className, 
  type = "text",
  options,
  ...props 
}) {
  const renderInput = () => {
    if (type === "select") {
      return (
        <div className="relative">
          <select
            className={cn(
              "w-full px-4 py-3 bg-white border border-gray-200 rounded-xl",
              "text-gray-700 placeholder-gray-400",
              "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
              "transition-all duration-200 ease-in-out",
              "appearance-none cursor-pointer",
              error && "border-red-300 focus:ring-red-500 focus:border-red-500"
            )}
            {...props}
          >
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <ApperIcon name="ChevronDown" size={20} className="text-gray-400" />
          </div>
        </div>
      );
    }
    
    const Component = type === "textarea" ? Textarea : Input;
    return (
      <Component
        type={type === "textarea" ? undefined : type}
        className={cn(
          error && "border-red-300 focus:ring-red-500 focus:border-red-500"
        )}
        {...props}
      />
    );
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      {renderInput()}
{error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

export default FormField;