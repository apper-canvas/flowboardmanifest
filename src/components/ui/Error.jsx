import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const Error = ({ 
  message = "Something went wrong. Please try again.", 
  onRetry,
  className 
}) => {
  return (
    <Card className={`p-8 text-center ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <ApperIcon name="AlertCircle" className="w-8 h-8 text-red-600" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 font-display">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-600 max-w-md">
            {message}
          </p>
        </div>
        
        {onRetry && (
          <Button 
            onClick={onRetry}
            variant="primary"
            icon="RefreshCw"
            className="mt-4"
          >
            Try Again
          </Button>
        )}
      </div>
    </Card>
  );
};

export default Error;