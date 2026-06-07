import { useState, useEffect, useCallback } from "react";
import { HiX } from "react-icons/hi";
import { cn } from "../../lib/utils";
import { Button } from "./button";

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  showCloseButton = true,
  footer,
  className,
}) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsAnimating(false);
    setTimeout(onClose, 200);
  }, [onClose]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, handleClose]);

  if (!isOpen && !isAnimating) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-[90vw]",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className={cn(
          "absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={handleClose}
      />
      <div
        className={cn(
          "relative w-full mx-4 bg-surface rounded-xl shadow-2xl transform transition-all duration-200",
          sizes[size],
          isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
          className
        )}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              {title && <h2 className="text-xl font-heading font-semibold">{title}</h2>}
              {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
            </div>
            {showCloseButton && (
              <Button variant="ghost" size="icon" onClick={handleClose} className="ml-4">
                <HiX className="w-5 h-5" />
              </Button>
            )}
          </div>
        )}
        <div className="p-6">{children}</div>
        {footer && <div className="p-6 pt-0 border-t border-border">{footer}</div>}
      </div>
    </div>
  );
}
