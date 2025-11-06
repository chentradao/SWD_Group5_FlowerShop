import api from "./axiosConfig";

const API_URL = import.meta.env.VITE_API_URL + "/flowers";

// Small helpers used across the app to normalize product/item shapes.
export function getProduct(item) {
  if (!item) return null;
  // common shapes: { flower: {...} } (order item), { book: {...} }, or the product itself
  if (item.flower) return item.flower;
  if (item.book) return item.book;
  // cart/order item sometimes includes product fields directly
  if (item.title || item.price || item.image) return item;
  return null;
}

export function getProductId(item) {
  const p = getProduct(item);
  if (p && p.id) return p.id;
  return item?.flowerId ?? item?.bookId ?? item?.id ?? null;
}

export function getProductImageUrl(path) {
  if (!path) return "/images/default.png";
  if (typeof path !== "string") return "/images/default.png";
  if (path.startsWith("http") || path.startsWith("/")) return path.startsWith("http") ? path : import.meta.env.VITE_API_URL + path;
  return `${import.meta.env.VITE_API_URL}/uploads/${path}`;
}

export function getProductPrice(item) {
  const p = getProduct(item);
  return (p && (p.price ?? p.amount)) ?? item?.price ?? 0;
}

const flowerService = {
  // Tạo hoa mới
  create: (data) => api.post(`${API_URL}/create-flower`, data),

  // Lấy hoa theo ID
  getById: (id) => api.get(`${API_URL}/${id}`),

  // Lấy tất cả hoa (có thể truyền filter qua query string)
  getAll: (params) => api.get(API_URL, { params }),

  // Lấy theo shop
  getByShopId: (shopId) => api.get(`${API_URL}/shop/${shopId}`),

  // Cập nhật hoa
  update: (id, data) => api.patch(`${API_URL}/${id}/update`, data),

  // Disable (soft delete) hoa
  disable: (id) => api.patch(`${API_URL}/${id}/disable`),
  updateStock(id, stock) {
    return api.patch(`${API_URL}/${id}/stock`, { stock });
  }

};

export default flowerService;