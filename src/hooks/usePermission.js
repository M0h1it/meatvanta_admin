import { useCallback } from "react";
import { useAuth } from "./useAuth";

/**
 * Client-side permission check - for UI purposes only (hiding buttons, disabling
 * nav links, blocking route entry). This is NOT security - the backend
 * re-checks every permission on every request regardless of what the UI shows.
 * Permissions come straight from the logged-in admin's Role, returned by
 * /auth/login and /auth/me - roles are DB-backed and can be custom, so there's
 * no static file to mirror anymore (that was the bug: a role created through
 * the UI wouldn't exist in a local JSON copy).
 */
export function usePermission() {
  const { admin } = useAuth();

  const hasPermission = useCallback(
    (requiredPermission) => {
      const permissions = admin?.permissions;
      if (!Array.isArray(permissions)) return false;

      if (permissions.includes("*")) return true;
      if (permissions.includes(requiredPermission)) return true;

      const [requiredModule] = requiredPermission.split(":");
      if (permissions.includes(`${requiredModule}:*`)) return true;

      return false;
    },
    [admin]
  );

  return { hasPermission };
}
