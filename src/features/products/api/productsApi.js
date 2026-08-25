import apiClient from "../../../lib/apiClient";

export async function fetchProducts({ categoryId, includeInactive = true, search } = {}) {
  const { data } = await apiClient.get("/products", {
    params: { categoryId, includeInactive, search },
  });
  return data.data.products;
}

export async function fetchProduct(id) {
  const { data } = await apiClient.get(`/products/${id}`);
  return data.data.product;
}

export async function createProduct(payload) {
  const { data } = await apiClient.post("/products", payload);
  return data.data.product;
}

export async function updateProduct(id, payload) {
  const { data } = await apiClient.put(`/products/${id}`, payload);
  return data.data.product;
}

export async function deleteProduct(id) {
  const { data } = await apiClient.delete(`/products/${id}`);
  return data.data;
}

export async function addVariant(productId, payload) {
  const { data } = await apiClient.post(`/products/${productId}/variants`, payload);
  return data.data.variant;
}

export async function updateVariant(variantId, payload) {
  const { data } = await apiClient.put(`/products/variants/${variantId}`, payload);
  return data.data.variant;
}

export async function deleteVariant(variantId) {
  const { data } = await apiClient.delete(`/products/variants/${variantId}`);
  return data.data;
}

export async function toggleVariantStock(variantId, isInStock) {
  const { data } = await apiClient.patch(`/products/variants/${variantId}/stock`, { isInStock });
  return data.data.variant;
}

export async function uploadProductImage(productId, file) {
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await apiClient.post(`/products/${productId}/image`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data.product;
}

export async function toggleProductStock(id, isInStock) {
  const { data } = await apiClient.patch(`/products/${id}/stock`, { isInStock });
  return data.data.product;
}

// ---------- Option groups & options ----------

export async function addOptionGroup(productId, payload) {
  const { data } = await apiClient.post(`/products/${productId}/option-groups`, payload);
  return data.data.group;
}

export async function updateOptionGroup(groupId, payload) {
  const { data } = await apiClient.put(`/products/option-groups/${groupId}`, payload);
  return data.data.group;
}

export async function deleteOptionGroup(groupId) {
  const { data } = await apiClient.delete(`/products/option-groups/${groupId}`);
  return data.data;
}

export async function addOption(groupId, payload) {
  const { data } = await apiClient.post(`/products/option-groups/${groupId}/options`, payload);
  return data.data.option;
}

export async function updateOption(optionId, payload) {
  const { data } = await apiClient.put(`/products/options/${optionId}`, payload);
  return data.data.option;
}

export async function deleteOption(optionId) {
  const { data } = await apiClient.delete(`/products/options/${optionId}`);
  return data.data;
}

export async function removeProductImage(productId) {
  const { data } = await apiClient.delete(`/products/${productId}/image`);
  return data.data.product;
}
