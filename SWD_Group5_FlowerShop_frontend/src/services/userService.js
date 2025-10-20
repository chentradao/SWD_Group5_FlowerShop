import axios from "axios";

const base_URL = `${import.meta.env.VITE_API_URL}/`;

const instance = axios.create({
  baseURL: base_URL,
});

const getUsers = async () => {
  try {
    const res = await instance.get("users/");
    return res.data;
  } catch (err) {
    console.error("Error fetching users:", err);
    throw err;
  }
};

const getUserById = async (id) => {
  try {
    const res = await instance.get(`users/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching user by ID:", err);
    throw err;
  }
};

const createUser = async (userData) => {
  try {
    const res = await instance.post("users/", userData);
    return res.data;
  } catch (err) {
    console.error("Error creating user:", err);
    throw err;
  }
};

const updateUser = async (id, userData) => {
  try {
    // Chỉ giữ các field cho phép update
    const { name, email, role } = userData;
    const res = await instance.put(`users/${id}`, { name, email, role });
    return res.data;
  } catch (err) {
    console.error("Error updating user:", err);
    throw err;
  }
};

const deleteUser = async (id) => {
  try {
    const res = await instance.delete(`users/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error deleting user:", err);
    throw err;
  }
};

const getAllBooksByUserId = async (userId) => {
  try {
    const res = await instance.get(`users/${userId}/books`);
    return res.data;
  } catch (err) {
    console.error("Error fetching books by user ID:", err);
    throw err;
  }
};

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getAllBooksByUserId,
};
