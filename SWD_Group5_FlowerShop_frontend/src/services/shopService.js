import axiosConfig from './axiosConfig';

const shopService = {
  create: (data) => axiosConfig.post('/shops', data),
  update: (id, data) => axiosConfig.put(`/shops/${id}`, data),
  getById: (id) => axiosConfig.get(`/shops/${id}`),
  getCurrentShop: () => axiosConfig.get('/shops/current'),
  updateProfile: (data) => axiosConfig.put('/shops/profile', data),
  getRevenue: (params) => axiosConfig.get('/shops/revenue', { params }),
  getProducts: () => axiosConfig.get('/shops/products'),
};

export default shopService;