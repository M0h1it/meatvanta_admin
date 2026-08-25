import apiClient from "../../../lib/apiClient";

export async function loginRequest(email, password) {
  const { data } = await apiClient.post("/auth/login", { email, password });
  return data.data.admin; // { id, name, email, role }
}

export async function logoutRequest() {
  await apiClient.post("/auth/logout");
}

export async function getCurrentAdminRequest() {
  const { data } = await apiClient.get("/auth/me");
  return data.data.admin;
}

/** Merges partial preferences into the logged-in admin's saved settings (e.g. { showAuditLog: false }). */
export async function updateMyPreferencesRequest(partialPreferences) {
  const { data } = await apiClient.patch("/auth/me/preferences", partialPreferences);
  return data.data.preferences;
}
