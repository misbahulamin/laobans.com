import { forwardRef } from "react";
import { cn } from "../../lib/utils";

const variants = {
  default: "bg-primary text-white hover:bg-primary/90",
  outline: "border-2 border-primary text-primary hover:bg-primary/10",
  ghost: "text-primary hover:bg-primary/10",
  destructive: "bg-destructive text-white hover:bg-destructive/90",
  success: "bg-success text-white hover:bg-success/90",
  warning: "bg-warning text-white hover:bg-warning/90",
  info: "bg-info text-white hover:bg-info/90",
  link: "text-primary underline-offset-4 hover:underline",
};

const sizes = {
  xs: "h-7 px-2 text-xs",
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
  xl: "h-14 px-8 text-lg",
  icon: "h-10 w-10",
};

const Button = forwardRef(
  ({ className, variant = "default", size = "md", asChild = false, isLoading = false, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          "active:scale-[0.98]",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };
