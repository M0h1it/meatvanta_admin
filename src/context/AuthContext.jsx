import { createContext, useEffect, useState, useCallback } from "react";
import {
  loginRequest,
  logoutRequest,
  getCurrentAdminRequest,
  updateMyPreferencesRequest,
} from "../features/auth/api/authApi";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // true while we check for an existing session on load

  useEffect(() => {
    getCurrentAdminRequest()
      .then(setAdmin)
      .catch(() => setAdmin(null))
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const loggedInAdmin = await loginRequest(email, password);
    setAdmin(loggedInAdmin);
    return loggedInAdmin;
  }, []);

  const logout = useCallback(async () => {
    await logoutRequest();
    setAdmin(null);
  }, []);

  /**
   * Updates one or more preferences server-side, then merges the result into
   * the in-memory admin object so the Sidebar/BottomNav react immediately -
   * no page reload or re-fetch of /me needed.
   */
  const updatePreferences = useCallback(async (partialPreferences) => {
    const updatedPreferences = await updateMyPreferencesRequest(partialPreferences);
    setAdmin((current) => (current ? { ...current, preferences: updatedPreferences } : current));
    return updatedPreferences;
  }, []);

  const value = { admin, isAuthenticated: !!admin, isLoading, login, logout, updatePreferences };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
