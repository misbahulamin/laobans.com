import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiBell } from "react-icons/hi";
import { cn } from "../../lib/utils";
import { useNotification } from "../../context/NotificationContext";
import { formatRelativeTime } from "../../utils/dateUtils";

export function NotificationBell({ className }) {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();
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

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-muted/50 transition-colors"
      >
        <HiBell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute right-0 mt-2 w-80 rounded-lg border border-border bg-surface shadow-lg z-50"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="font-medium">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-xs text-primary hover:underline">
                Mark all as read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <p className="text-sm">No notifications</p>
              </div>
            ) : (
              notifications.slice(0, 5).map((notification) => (
                <Link
                  key={notification.id}
                  to={notification.link || "#"}
                  onClick={() => {
                    markAsRead(notification.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "block px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border last:border-0",
                    !notification.is_read && "bg-primary/5"
                  )}
                >
                  <p className="text-sm font-medium">{notification.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatRelativeTime(notification.created_at)}
                  </p>
                </Link>
              ))
            )}
          </div>
          <Link
            to="/dashboard/notifications"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-3 text-center text-sm text-primary hover:bg-muted/50 transition-colors border-t border-border"
          >
            View all notifications
          </Link>
        </motion.div>
      )}
    </div>
  );
}

import { motion } from "framer-motion";
