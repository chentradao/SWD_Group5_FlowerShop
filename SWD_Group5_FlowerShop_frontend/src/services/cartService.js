import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/cart";

const cartService = {
  // Lấy giỏ hàng
  getCart: (userId) =>
    axios.get(`${API_URL}`, {
      params: { userId },
      withCredentials: true,
    }),

  // Thêm vào giỏ
  addToCart: (userId, bookId, quantity = 1) =>
    axios.post(
      `${API_URL}/add`,
      { userId, bookId, quantity },
      { withCredentials: true } // ✅ đúng vị trí
    ),

  // Cập nhật số lượng
  updateQuantity: (cartItemId, userId, quantity) =>
    axios.patch(
      `${API_URL}/${cartItemId}/quantity`,
      { userId, quantity },
      { withCredentials: true }
    ),

  // Xóa 1 item
  removeItem: (cartItemId, userId) =>
    axios.delete(`${API_URL}/${cartItemId}`, {
      data: { userId },
      withCredentials: true,
    }),

  // Xóa toàn bộ giỏ
  clearCart: (userId) =>
    axios.delete(`${API_URL}`, {
      params: { userId },
      withCredentials: true,
    }),
};

export default cartService;
