import axios from "axios";

const base_URL = `${import.meta.env.VITE_API_URL}/`;

const instance = axios.create({
  baseURL: base_URL,
});

const getOrders = async () => {
  try {
    const res = await instance.get('order/');
    return res.data;
  } catch (err) {
    console.error('Error fetching orders:', err);
    throw err;
  }
};

const getOrderById = async (id) => {
  try {
    const res = await instance.get(`order/${id}`);
    return res.data;
  } catch (err) {
    console.error('Error fetching order by ID:', err);
    throw err;
  }
};

const updateOrder = async (id, orderData) => {
  try {
    const res = await instance.put(`order/${id}`, orderData);
    return res.data;
  } catch (err) {
    console.error('Error updating order:', err);
    throw err;
  }
};

const deleteOrder = async (id) => {
  try {
    const res = await instance.delete(`order/${id}`);
    return res.data;
  } catch (err) {
    console.error('Error deleting order:', err);
    throw err;
  }
};

const getOrderByUserId = async (id) => {
  try {
    const res = await instance.get(`order/user-orders/${id}`);
    console.log(res.data);
    return res.data;
  } catch (err) {
    console.error('Error fetching order by ID:', err);
    throw err;
  }
};


export default {
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getOrderByUserId
};
