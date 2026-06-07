import { Navigate, Outlet } from "react-router";
import { useUser } from "../context/UserContext";
import { useSwitch } from "../context/SwitchContext";
import { DataLoader } from "../components/ui/DataLoader";

export function PrivateRoute() {
  const { user, loading } = useUser();

  if (loading) {
    return <DataLoader />;
  }

  return user ? <Outlet /> : <Navigate to="/signin" replace />;
}

export function RoleGuard({ allowedRoles }) {
  const { user } = useUser();

  if (!user) return <Navigate to="/signin" replace />;
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/access-denied" replace />;
  }

  return <Outlet />;
}

export function SuperGuard() {
  const { user } = useUser();
  if (!user) return <Navigate to="/signin" replace />;
  if (user.role !== "ERP_OWNER") return <Navigate to="/access-denied" replace />;
  return <Outlet />;
}

export function CompanyGuard() {
  const { user } = useUser();
  const { switchContext } = useSwitch();
  if (!user) return <Navigate to="/signin" replace />;
  if (user.role !== "COMPANY_OWNER" && user.role !== "ERP_OWNER") {
    return <Navigate to="/access-denied" replace />;
  }
  return <Outlet />;
}

export function PermissionRoute({ permission, children }) {
  const { user } = useUser();

  if (!user?.permissions?.includes(permission)) {
    return <Navigate to="/access-denied" replace />;
  }

  return children || <Outlet />;
}
