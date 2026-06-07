import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiUserCircle, HiLogout, HiCog } from "react-icons/hi";
import { cn } from "../../lib/utils";
import { useUser } from "../../context/UserContext";

export function UserAvatarDropdown({ className }) {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
      >
        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-medium text-sm">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            getInitials(user?.name || user?.email)
          )}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium">{user?.name || "User"}</p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
        </div>
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute right-0 mt-2 w-56 rounded-lg border border-border bg-surface shadow-lg py-1 z-50"
        >
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <Link
            to="/dashboard/settings"
            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted/50 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <HiCog className="w-4 h-4" />
            Settings
          </Link>
          <Link
            to="/dashboard/profile"
            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted/50 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <HiUserCircle className="w-4 h-4" />
            Profile
          </Link>
          <div className="border-t border-border mt-1 pt-1">
            <button
              onClick={logout}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
            >
              <HiLogout className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

import { motion } from "framer-motion";
