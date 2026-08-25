import apiClient from "../../../lib/apiClient";

export async function fetchOrders({ status, search, page = 1, pageSize = 25 } = {}) {
  const { data } = await apiClient.get("/orders", { params: { status, search, page, pageSize } });
  return data.data; // { orders, total, page, pageSize, totalPages }
}

export async function fetchOrder(id) {
  const { data } = await apiClient.get(`/orders/${id}`);
  return data.data.order;
}

export async function createOrder(payload) {
  const { data } = await apiClient.post("/orders", payload);
  return data.data.order;
}

export async function updateOrderStatus(id, status) {
  const { data } = await apiClient.patch(`/orders/${id}/status`, { status });
  return data.data.order;
}

export async function cancelOrder(id) {
  const { data } = await apiClient.post(`/orders/${id}/cancel`);
  return data.data.order;
}

export async function verifyPayment(id, paymentStatus, paymentNote) {
  const { data } = await apiClient.patch(`/orders/${id}/payment`, { paymentStatus, paymentNote });
  return data.data.order;
}

export async function setDeliveryCharge(id, deliveryCharge) {
  const { data } = await apiClient.patch(`/orders/${id}/delivery-charge`, { deliveryCharge });
  return data.data.order;
}

export async function assignDeliveryPerson(id, deliveryPersonName) {
  const { data } = await apiClient.patch(`/orders/${id}/delivery-person`, { deliveryPersonName });
  return data.data.order;
}

export async function fetchDashboardStats() {
  const { data } = await apiClient.get("/orders/stats/summary");
  return data.data; // { todayOrdersCount, pendingCount, todayRevenue, lowStockCount }
}
