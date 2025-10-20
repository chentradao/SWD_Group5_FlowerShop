import React, { useState, useEffect } from 'react';
import authorServices from '../../services/authorServices';

const AuthorManage = () => {
    const [authorList, setAuthorList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingAuthor, setEditingAuthor] = useState(null);
    const [newAuthor, setNewAuthor] = useState({ name: '', bio: '' });

    useEffect(() => {
        fetchAuthors();
    }, []);

    const fetchAuthors = async () => {
        setLoading(true);
        try {
            const res = await authorServices.getAuthors();
            setAuthorList(Array.isArray(res) ? res : []);
        } catch (error) {
            console.error('Error fetching authors:', error);
        }
        setLoading(false);
    };

    const handleAdd = async (authorData) => {
        try {
            await authorServices.createAuthor(authorData);
            fetchAuthors();
        } catch (error) {
            console.error('Error creating author:', error);
        }
    };

    const handleOpenModal = (author = null) => {
        if (author) {
            setEditingAuthor(author);
            setNewAuthor({ name: author.name || '', bio: author.bio || '' });
        } else {
            setEditingAuthor(null);
            setNewAuthor({ name: '', bio: '' });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingAuthor(null);
        setNewAuthor({ name: '', bio: '' });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAuthor((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmitModal = async (e) => {
        e.preventDefault();
        try {
            if (editingAuthor) {
                await handleUpdate(editingAuthor.id, newAuthor);
            } else {
                await handleAdd(newAuthor);
            }
            handleCloseModal();
        } catch (error) {
            console.error('Error saving author:', error);
        }
    };

    const handleUpdate = async (id, authorData) => {
        try {
            await authorServices.updateAuthor(id, authorData);
            fetchAuthors();
        } catch (error) {
            console.error('Error updating author:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa tác giả này?')) {
            try {
                await authorServices.deleteAuthor(id);
                fetchAuthors();
            } catch (error) {
                console.error('Error deleting author:', error);
            }
        }
    };

    return (
        <div className="p-6">
            <div className="bg-white rounded-2xl shadow-md p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Quản lý Tác giả</h2>
                        <p className="text-gray-500 text-sm mt-1">
                            Danh sách tất cả tác giả trong hệ thống
                        </p>
                    </div>
                    <button
                        className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-2 rounded-lg focus:outline-none transition-colors"
                        onClick={() => handleOpenModal()}
                    >
                        Thêm tác giả
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tên tác giả
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tiểu sử
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Số sách
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-8">
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
                                            <span className="ml-2 text-gray-500">Đang tải...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : authorList.length > 0 ? (
                                authorList.map((author, idx) => (
                                    <tr key={author.id || idx} className="hover:bg-gray-50">
                                        {/* Name */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-full bg-violet-100 flex items-center justify-center">
                                                        <span className="text-violet-600 font-semibold text-sm">
                                                            {author.name?.charAt(0).toUpperCase() || 'A'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {author.name || 'Chưa có tên'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Bio */}
                                        <td className="px-6 py-4 max-w-xs">
                                            {author.bio ? (
                                                <div
                                                    className="text-sm text-gray-900 line-clamp-2"
                                                    title={author.bio}
                                                >
                                                    {author.bio}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 italic">
                                                    Chưa có tiểu sử
                                                </span>
                                            )}
                                        </td>

                                        {/* Book count */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {author.bookCount || 0} sách
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                className="text-violet-600 hover:text-violet-900 mr-4 transition-colors"
                                                onClick={() => handleOpenModal(author)}
                                            >
                                                Chỉnh sửa
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="text-center py-8">
                                        <div className="text-gray-500">
                                            <svg
                                                className="mx-auto h-12 w-12 text-gray-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 19 7.5 19s3.332-.523 4.5-1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 19 16.5 19c-1.746 0-3.332-.523-4.5-1.253"
                                                />
                                            </svg>
                                            <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có tác giả</h3>
                                            <p className="mt-1 text-sm text-gray-500">Bắt đầu bằng cách thêm tác giả đầu tiên.</p>
                                        </div>
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
                                {editingAuthor ? 'Chỉnh sửa tác giả' : 'Thêm tác giả mới'}
                            </h3>
                            <form onSubmit={handleSubmitModal} className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 mb-2 font-medium">
                                        Tên tác giả *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={newAuthor.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
                                        placeholder="Nhập tên tác giả"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2 font-medium">
                                        Tiểu sử
                                    </label>
                                    <textarea
                                        name="bio"
                                        value={newAuthor.bio}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent resize-none"
                                        placeholder="Nhập tiểu sử tác giả (tùy chọn)"
                                    />
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition-colors"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-semibold transition-colors"
                                    >
                                        {editingAuthor ? 'Cập nhật' : 'Thêm'}
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

export default AuthorManage;
