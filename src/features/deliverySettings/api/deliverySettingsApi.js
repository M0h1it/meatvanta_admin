import apiClient from "../../../lib/apiClient";

export async function fetchDeliverySettings() {
  const { data } = await apiClient.get("/delivery-settings");
  return data.data.settings;
}

export async function updateDeliverySettings(payload) {
  const { data } = await apiClient.put("/delivery-settings", payload);
  return data.data.settings;
}
