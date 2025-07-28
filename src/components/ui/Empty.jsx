import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const Empty = ({ 
  title = "No items found",
  description = "Get started by creating your first item.",
  actionText = "Create New",
  onAction,
  icon = "Plus",
  className 
}) => {
  return (
    <Card className={`p-12 text-center ${className}`}>
      <div className="flex flex-col items-center space-y-6">
        <div className="w-20 h-20 bg-gradient-to-br from-primary-50 to-primary-100 rounded-full flex items-center justify-center">
          <ApperIcon name={icon} className="w-10 h-10 text-primary-600" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900 font-display">
            {title}
          </h3>
          <p className="text-gray-600 max-w-md">
            {description}
          </p>
        </div>
        
        {onAction && (
          <Button 
            onClick={onAction}
            variant="primary"
            icon="Plus"
            className="mt-4"
          >
            {actionText}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default Empty;