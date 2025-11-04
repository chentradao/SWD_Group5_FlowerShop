import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/flowers";

const flowerService = {
  // Tạo hoa mới
  create: (data) => axios.post(`${API_URL}/create-flower`, data),

  // Lấy hoa theo ID
  getById: (id) => axios.get(`${API_URL}/${id}`),

  // Lấy tất cả hoa (có thể truyền filter qua query string)
  getAll: (params) => axios.get(API_URL, { params }),

  // Lấy theo shop
  getByShopId: (shopId) => axios.get(`${API_URL}/shop/${shopId}`),

  // Cập nhật hoa
  update: (id, data) => axios.patch(`${API_URL}/${id}/update`, data),

  // Disable (soft delete) hoa
  disable: (id) => axios.patch(`${API_URL}/${id}/disable`),
  updateStock(id, stock) {
    return axios.patch(`${API_URL}/${id}/stock`, { stock });
  }

};

export default flowerService;