import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiChevronDown, HiChevronRight } from "react-icons/hi";
import { cn } from "../../lib/utils";

export function SidebarItem({ item, level = 0 }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const hasChildren = item.children && item.children.length > 0;
  const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");

  return (
    <div>
      <NavLink
        to={hasChildren ? "#" : item.path}
        onClick={hasChildren ? (e) => { e.preventDefault(); setIsOpen(!isOpen); } : undefined}
        className={cn(
          "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
          isActive
            ? "bg-primary text-white shadow-md"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
          level > 0 && "ml-6 text-sm"
        )}
      >
        <span className="flex items-center gap-3">
          {item.icon && <item.icon className="w-5 h-5 flex-shrink-0" />}
          <span>{item.label}</span>
        </span>
        {hasChildren && (
          <span className="ml-2">
            {isOpen ? (
              <HiChevronDown className="w-4 h-4" />
            ) : (
              <HiChevronRight className="w-4 h-4" />
            )}
          </span>
        )}
      </NavLink>

      <AnimatePresence>
        {hasChildren && isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {item.children.map((child) => (
              <SidebarItem key={child.id} item={child} level={level + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
