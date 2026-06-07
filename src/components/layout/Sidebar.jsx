import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";
import { SidebarItem } from "../ui/SidebarItem";
import { menuItems } from "../ui/sidebarConstruction";
import { cn } from "../../lib/utils";

export default function Sidebar({ user, className }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <div>
            <h1 className="font-heading font-bold text-lg text-primary">ShipSource</h1>
            <p className="text-xs text-muted-foreground">Shipping & Sourcing</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-custom">
        {menuItems.map((item) => (
          <SidebarItem key={item.id} item={item} />
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-xs text-muted-foreground">Logged in as</p>
          <p className="text-sm font-medium mt-1">{user?.name || "User"}</p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-surface rounded-lg shadow-lg border border-border"
      >
        <HiMenu className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50 bg-black/50"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isMobileOpen ? 0 : 0 }}
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-72 bg-surface border-r border-border transform transition-transform duration-300",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          className
        )}
      >
        <div className="flex lg:hidden justify-end p-4">
          <button onClick={() => setIsMobileOpen(false)} className="p-2 hover:bg-muted rounded-lg">
            <HiX className="w-5 h-5" />
          </button>
        </div>
        <SidebarContent />
      </motion.aside>

      <aside className="hidden lg:block w-72 bg-surface border-r border-border">
        <SidebarContent />
      </aside>
    </>
  );
}
