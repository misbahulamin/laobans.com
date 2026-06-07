import { cn } from "../../lib/utils";

const variants = {
  default: "bg-primary text-white",
  info: "pill-gradient-info",
  success: "pill-gradient-success",
  warning: "pill-gradient-warning",
  danger: "pill-gradient-danger",
  outline: "border-2 border-border text-foreground bg-transparent",
  secondary: "bg-muted text-muted-foreground",
};

export function Badge({ className, variant = "default", children, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
