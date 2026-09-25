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

// --- Password reset (all unauthenticated - the admin is locked out) ---

export async function forgotPasswordRequest(phone) {
  const { data } = await apiClient.post("/auth/forgot-password", { phone });
  return data.data; // { expiresInMinutes, devOtp? }
}

export async function verifyResetOtpRequest({ phone, otp }) {
  const { data } = await apiClient.post("/auth/verify-reset-otp", { phone, otp });
  return data.data; // { resetToken }
}

export async function resetPasswordRequest({ resetToken, newPassword }) {
  const { data } = await apiClient.post("/auth/reset-password", { resetToken, newPassword });
  return data;
}