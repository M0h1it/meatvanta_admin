import apiClient from "../../../lib/apiClient";

export async function fetchAdminUsers() {
  const { data } = await apiClient.get("/admin-users");
  return data.data.admins;
}

export async function createAdminUser(payload) {
  const { data } = await apiClient.post("/admin-users", payload);
  return data.data.admin;
}

export async function updateAdminUser(id, payload) {
  const { data } = await apiClient.put(`/admin-users/${id}`, payload);
  return data.data.admin;
}
