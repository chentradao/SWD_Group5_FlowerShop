import axios from "axios"

const base_URL = `${import.meta.env.VITE_API_URL}/`

const instance = axios.create({
    baseURL: base_URL
})

const getAuthors = async () => {
    try {
        const res = await instance.get('authors/');
        return res.data;
    } catch (err) {
        console.error('Error fetching authors:', err);
        throw err;
    }
};

const getAuthorById = async (id) => {
    try {
        const res = await instance.get(`authors/${id}`);
        return res.data;
    } catch (err) {
        console.error('Error fetching author by ID:', err);
        throw err;
    }
};

const createAuthor = async (authorData) => {
    try {
        const res = await instance.post('authors/', authorData);
        return res.data;
    } catch (err) {
        console.error('Error creating author:', err);
        throw err;
    }
};

const updateAuthor = async (id, authorData) => {
    try {
        const res = await instance.put(`authors/${id}`, authorData);
        return res.data;
    } catch (err) {
        console.error('Error updating author:', err);
        throw err;
    }
};

const deleteAuthor = async (id) => {
    try {
        const res = await instance.delete(`authors/${id}`);
        return res.data;
    } catch (err) {
        console.error('Error deleting author:', err);
        throw err;
    }
};

const getAllBooksByAuthorId = async (authorId) => {
    try {
        const res = await instance.get(`authors/${authorId}/books`);
        return res.data;
    } catch (err) {
        console.error('Error fetching books by author ID:', err);
        throw err;
    }
}

export default {
    getAuthors,
    getAuthorById,
    createAuthor,
    updateAuthor,
    deleteAuthor,
    getAllBooksByAuthorId
};