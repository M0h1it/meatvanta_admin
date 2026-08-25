import apiClient from "../../../lib/apiClient";

export async function fetchRoles() {
  const { data } = await apiClient.get("/roles");
  return data.data.roles;
}

export async function fetchPermissionCatalog() {
  const { data } = await apiClient.get("/roles/permission-catalog");
  return data.data; // { modules, allKeys }
}

export async function createRole(payload) {
  const { data } = await apiClient.post("/roles", payload);
  return data.data.role;
}

export async function updateRole(id, payload) {
  const { data } = await apiClient.put(`/roles/${id}`, payload);
  return data.data.role;
}

export async function deleteRole(id) {
  const { data } = await apiClient.delete(`/roles/${id}`);
  return data.data;
}
