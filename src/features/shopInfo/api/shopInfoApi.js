import apiClient from "../../../lib/apiClient";

export async function fetchShopInfo() {
  const { data } = await apiClient.get("/shop-info");
  return data.data.shopInfo;
}

export async function updateShopInfo(payload) {
  const { data } = await apiClient.put("/shop-info", payload);
  return data.data.shopInfo;
}
