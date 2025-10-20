import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  } else {
    if (!user) {
      return <Navigate to="/" replace />;
    }

    if (allowedRoles?.length > 0) {
      const userRole = user.role?.toLowerCase() || "";
      const hasAccess = allowedRoles.some(
        (role) => role.toLowerCase() === userRole
      );

      if (!hasAccess) {
        const redirectPath = userRole === "admin" ? "/admin-dashboard" : "/";
        return <Navigate to={redirectPath} replace />;
      }
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
