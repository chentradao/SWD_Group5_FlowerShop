import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/books";

const bookService = {
  // Tạo sách mới
  create: (data) => axios.post(`${API_URL}/create-book`, data),

  // Lấy sách theo ID
  getById: (id) => axios.get(`${API_URL}/${id}`),

  // Lấy tất cả sách (có thể truyền filter qua query string)
  getAll: (params) => axios.get(API_URL, { params }),

  // Cập nhật sách
  update: (id, data) => axios.patch(`${API_URL}/${id}/update-book`, data),

  // Disable (soft delete) sách
  disable: (id) => axios.patch(`${API_URL}/${id}/disable`),
  updateStock(id, stock) {
  return axios.patch(`${API_URL}/${id}/stock`, { stock });
}

};

export default bookService;
