import { useState } from "react";
import { cn } from "../../lib/utils";

export function Tabs({ defaultValue, value, onValueChange, children, className }) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = value !== undefined ? value : internalValue;
  const handleValueChange = (val) => {
    if (value === undefined) setInternalValue(val);
    onValueChange?.(val);
  };

  const tabs = Array.isArray(children) 
    ? children.map((child, index) => {
        const tabValue = child.props?.value || `tab-${index}`;
        return { value: tabValue, label: child.props?.label, disabled: child.props?.disabled };
      })
    : [];

  return (
    <div className={className}>
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            disabled={tab.disabled}
            onClick={() => handleValueChange(tab.value)}
            className={cn(
              "px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors",
              currentValue === tab.value
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30",
              tab.disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {Array.isArray(children)
          ? children.map((child, index) => {
              const tabValue = child.props?.value || `tab-${index}`;
              if (tabValue !== currentValue) return null;
              return child;
            })
          : children}
      </div>
    </div>
  );
}

export function TabsList({ children, className }) {
  return <div className={cn("flex gap-2", className)}>{children}</div>;
}

export function TabsTrigger({ value, label, disabled, className }) {
  return <div data-value={value} data-label={label} data-disabled={disabled}>{label}</div>;
}

export function TabsContent({ value, children, className }) {
  return <div data-value={value} className={className}>{children}</div>;
}
