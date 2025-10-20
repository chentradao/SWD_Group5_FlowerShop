import axios from "axios";
const base_URL = `${import.meta.env.VITE_API_URL}/`

const instance = axios.create({
    baseURL : base_URL,
}
)

const getCategories = async () => {
    try {
        const res = await instance.get('categories/');
        return res.data;
    } catch (err) {
        console.error('Error fetching categories:', err);
        throw err;
    }
};


const createCategory = async (categoryData) => {
    try {
        const res = await instance.post('categories/', categoryData);
        return res.data;
    } catch (err) {
        console.error('Error creating category:', err);
        throw err;
    }
};

const updateCategory = async (id, categoryData) => {
    try {
        const res = await instance.put(`categories/${id}`, categoryData);
        return res.data;
    } catch (err) {
        console.error('Error updating category:', err);
        throw err;
    }
};

const deleteCategory = async (id) => {
    try {
        const res = await instance.delete(`categories/${id}`);
        return res.data;
    } catch (err) {
        console.error('Error deleting category:', err);
        throw err;
    }
};

export default {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
}