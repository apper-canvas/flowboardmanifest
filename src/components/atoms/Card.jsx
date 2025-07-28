import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  children, 
  className, 
  variant = "default",
  hoverable = false,
  ...props 
}, ref) => {
  const variants = {
    default: "bg-white shadow-card",
    elevated: "bg-white shadow-card-elevated",
    gradient: "bg-gradient-to-br from-white to-gray-50 shadow-card"
  };

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border border-gray-100 transition-all duration-200",
        variants[variant],
        hoverable && "hover:shadow-card-elevated hover:scale-[1.01] cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;