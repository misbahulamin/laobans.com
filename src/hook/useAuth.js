import { useCallback } from "react";
import { useUser } from "../context/UserContext";

export function useAuth() {
  const { user, loading, login, logout, getToken, fetchUser } = useUser();

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "ERP_OWNER" || user?.role === "COMPANY_OWNER";

  const hasPermission = useCallback(
    (permission) => {
      if (!user) return false;
      if (isAdmin) return true;
      return user.permissions?.includes(permission) || false;
    },
    [user, isAdmin]
  );

  const hasRole = useCallback(
    (roles) => {
      if (!user) return false;
      const roleArray = Array.isArray(roles) ? roles : [roles];
      return roleArray.includes(user.role);
    },
    [user]
  );

  return {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    getToken,
    fetchUser,
    hasPermission,
    hasRole,
  };
}
