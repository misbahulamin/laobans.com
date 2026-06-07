import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useUser } from "./UserContext";
import { useSwitch } from "./SwitchContext";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { getToken, user } = useUser();
  const { switchContext } = useSwitch();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    
    const token = getToken();
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_API}/notifications/`, {
        headers: { Authorization: `Token ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        const results = data.results || data || [];
        setNotifications(results);
        setUnreadCount(results.filter(n => !n.is_read).length);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [user, getToken]);

  const markAsRead = async (id) => {
    const token = getToken();
    if (!token) return;

    try {
      await fetch(`${import.meta.env.VITE_BASE_API}/notifications/${id}/read/`, {
        method: "POST",
        headers: { Authorization: `Token ${token}` },
      });
      
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    const token = getToken();
    if (!token) return;

    try {
      await fetch(`${import.meta.env.VITE_BASE_API}/notifications/read-all/`, {
        method: "POST",
        headers: { Authorization: `Token ${token}` },
      });
      
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
    if (!notification.is_read) {
      setUnreadCount(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [user, fetchNotifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        addNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};
