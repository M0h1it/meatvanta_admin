import apiClient from "../../../lib/apiClient";

export async function fetchAuditLog({ action, page = 1, pageSize = 25 } = {}) {
  const { data } = await apiClient.get("/audit-log", { params: { action, page, pageSize } });
  return data.data; // { logs, total, page, pageSize, totalPages }
}
