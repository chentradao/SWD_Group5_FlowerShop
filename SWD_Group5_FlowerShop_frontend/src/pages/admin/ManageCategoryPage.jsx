import React, { useState, useEffect } from 'react';
import categoryServices from '../../services/categoryServices';

const CategoryManage = () => {
    const [categoryList, setCategoryList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [newCategory, setNewCategory] = useState({ name: '' });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await categoryServices.getCategories();
            setCategoryList(Array.isArray(res) ? res : []);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
        setLoading(false);
    };

    const handleAdd = async (categoryData) => {
        try {
            await categoryServices.createCategory(categoryData);
            fetchCategories();
        } catch (error) {
            console.error('Error creating category:', error);
        }
    };

    const handleOpenModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setNewCategory({ name: category.name || '' });
        } else {
            setEditingCategory(null);
            setNewCategory({ name: '' });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingCategory(null);
        setNewCategory({ name: '' });
    };

    const handleInputChange = (e) => {
        setNewCategory({ name: e.target.value });
    };

    const handleSubmitModal = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await handleUpdate(editingCategory.id, newCategory);
            } else {
                await handleAdd(newCategory);
            }
            handleCloseModal();
        } catch (error) {
            console.error('Error saving category:', error);
        }
    };

    const handleUpdate = async (id, categoryData) => {
        try {
            await categoryServices.updateCategory(id, categoryData);
            fetchCategories();
        } catch (error) {
            console.error('Error updating category:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa thể loại này?')) {
            try {
                await categoryServices.deleteCategory(id);
                fetchCategories();
            } catch (error) {
                console.error('Lỗi khi xóa thể loại:', error);
            }
        }
    };

    return (
        <div className="p-6">
            <div className="bg-white rounded-2xl shadow-md p-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Quản lý Thể loại</h2>
                        <p className="text-gray-500 text-sm mt-1">Danh sách thể loại trong hệ thống</p>
                    </div>
                    <button
                        className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
                        onClick={() => handleOpenModal()}
                    >
                        Thêm thể loại
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên thể loại</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={2} className="text-center py-8">
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
                                            <span className="ml-2 text-gray-500">Đang tải...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : categoryList.length > 0 ? (
                                categoryList.map((category, idx) => (
                                    <tr key={category.id || idx} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-900">{category.name}</td>
                                        <td className="px-6 py-4 text-right text-sm font-medium">
                                            <button
                                                className="text-violet-600 hover:text-violet-900 mr-4"
                                                onClick={() => handleOpenModal(category)}
                                            >
                                                Chỉnh sửa
                                            </button>
                                            {/* <button
                                                className="text-red-600 hover:text-red-900"
                                                onClick={() => handleDelete(category.id)}
                                            >
                                                Xóa
                                            </button> */}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={2} className="text-center py-8 text-gray-500 italic">
                                        Chưa có thể loại nào.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
                            <h3 className="text-xl font-bold mb-4">
                                {editingCategory ? 'Chỉnh sửa thể loại' : 'Thêm thể loại mới'}
                            </h3>
                            <form onSubmit={handleSubmitModal} className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 mb-2 font-medium">Tên thể loại *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={newCategory.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400"
                                        placeholder="Nhập tên thể loại"
                                    />
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-semibold"
                                    >
                                        {editingCategory ? 'Cập nhật' : 'Thêm'}
                                    </button>
                                </div>
                            </form>
                            <button
                                onClick={handleCloseModal}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryManage;
