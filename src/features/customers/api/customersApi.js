import apiClient from "../../../lib/apiClient";

export async function fetchCustomers({ search, page = 1, pageSize = 25 } = {}) {
  const { data } = await apiClient.get("/customers", { params: { search, page, pageSize } });
  return data.data; // { customers, total, page, totalPages }
}

export async function fetchCustomer(id) {
  const { data } = await apiClient.get(`/customers/${id}`);
  return data.data.customer;
}
