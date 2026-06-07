import { useState } from "react";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import { cn } from "../../lib/utils";

export function FilterSection({ title, children, defaultOpen = true, className }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={cn("border border-border rounded-lg bg-surface", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors"
      >
        <span className="font-medium text-sm">{title}</span>
        {isOpen ? (
          <HiChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <HiChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      {isOpen && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}
