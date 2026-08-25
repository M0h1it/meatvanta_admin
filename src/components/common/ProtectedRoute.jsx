import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { usePermission } from "../../hooks/usePermission";

function AccessDenied() {
  const navigate = useNavigate();
  return (
    <div className="flex h-screen items-center justify-center bg-surface-container-low px-md">
      <div className="w-full max-w-sm bg-surface-container-lowest rounded-lg border border-outline-variant p-xl text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-error-container flex items-center justify-center mb-md">
          <span className="material-symbols-outlined text-error text-3xl">lock</span>
        </div>
        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-2">Access Denied</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mb-lg">
          Your account does not have the necessary permissions to view this section. Please contact your
          administrator for assistance.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-primary-container text-on-primary rounded px-lg py-2.5 font-label-bold text-label-bold hover:opacity-90 transition-opacity"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}

/**
 * Usage:
 *   <ProtectedRoute><DashboardPage /></ProtectedRoute>
 *   <ProtectedRoute requiredPermission="products:view"><ProductsPage /></ProtectedRoute>
 */
export default function ProtectedRoute({ children, requiredPermission }) {
  const { isAuthenticated, isLoading } = useAuth();
  const { hasPermission } = usePermission();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface-container-low text-on-surface-variant">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <AccessDenied />;
  }

  return children;
}
