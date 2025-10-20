// axiosConfig.js
import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`, // thay đổi nếu cần
  withCredentials: true, // BẮT BUỘC để gửi cookie
});

export default api;
