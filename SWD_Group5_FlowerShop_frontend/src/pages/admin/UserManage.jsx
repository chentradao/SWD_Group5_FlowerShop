import React, { useState, useEffect } from 'react';
import userService from '../../services/userService';

const UserManage = () => {
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        role: 'USER',
        password: ''
    });

    // Lấy thông tin user hiện tại từ localStorage
    const currentUser = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await userService.getUsers();
            setUserList(Array.isArray(res) ? res : []);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
        setLoading(false);
    };

    const handleAdd = async (userData) => {
        try {
            await userService.createUser(userData);
            fetchUsers();
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    const handleOpenModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setNewUser({
                name: user.name || '',
                email: user.email || '',
                role: user.role || 'USER',
                password: ''
            });
        } else {
            setEditingUser(null);
            setNewUser({ name: '', email: '', role: 'USER', password: '' });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingUser(null);
        setNewUser({ name: '', email: '', role: 'USER', password: '' });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmitModal = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                await handleUpdate(editingUser.id, newUser);
            } else {
                await handleAdd(newUser);
            }
            handleCloseModal();
        } catch (error) {
            console.error('Error saving user:', error);
        }
    };

    const handleUpdate = async (id, userData) => {
        try {
            await userService.updateUser(id, userData);
            fetchUsers();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    return (
        <div className="p-6">
            <div className="bg-white rounded-2xl shadow-md p-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Quản lý Người dùng</h2>
                        <p className="text-gray-500 text-sm mt-1">
                            Danh sách tất cả người dùng trong hệ thống
                        </p>
                    </div>
                    <button
                        className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-2 rounded-lg focus:outline-none transition-colors"
                        onClick={() => handleOpenModal()}
                    >
                        Thêm người dùng
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tên người dùng
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Vai trò
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
                            ) : userList && userList.length > 0 ? (
                                userList.map((user, idx) => {
                                    // Điều kiện hiển thị nút chỉnh sửa
                                    const showEditButton =
                                        // Nếu là admin root thì ẩn nút của chính mình
                                        !(currentUser?.name === 'Admin User' && user.name === 'Admin User') &&
                                        (
                                            // Nếu là admin khác admin root → chỉ sửa được user thường
                                            (currentUser?.role === 'ADMIN' && currentUser?.name !== 'Admin User'
                                                ? user.role === 'USER'
                                                : true)
                                        );

                                    return (
                                        <tr key={user.id || idx} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-violet-100 flex items-center justify-center">
                                                            <span className="text-violet-600 font-semibold text-sm">
                                                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {user.name || 'Chưa có tên'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900 max-w-xs">
                                                    {user.email || <span className="text-gray-400 italic">Chưa có email</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {user.role === 'ADMIN' ? 'Quản trị viên' : 'Người dùng'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
    {!(currentUser?.name === 'Admin User' && user.name === 'Admin User') &&
     ( 
        (currentUser?.role === 'ADMIN' && currentUser?.name !== 'Admin User'
            ? user.role === 'USER'
            : true)
     ) && (
        <button
            className="text-violet-600 hover:text-violet-900 transition-colors"
            onClick={() => handleOpenModal(user)}
        >
            Chỉnh sửa vai trò
        </button>
    )}
</td>

                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={4} className="text-center py-8">
                                        <div className="text-gray-500">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 19 7.5 19s3.332-.523 4.5-1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 19 16.5 19c-1.746 0-3.332-.523-4.5-1.253" />
                                            </svg>
                                            <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có người dùng</h3>
                                            <p className="mt-1 text-sm text-gray-500">Bắt đầu bằng cách thêm người dùng đầu tiên.</p>
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
                                {editingUser ? 'Chỉnh sửa vai trò người dùng' : 'Thêm người dùng mới'}
                            </h3>
                            <form onSubmit={handleSubmitModal} className="space-y-4">
                                {!editingUser && (
                                    <>
                                        <div>
                                            <label className="block text-gray-700 mb-2 font-medium">
                                                Tên người dùng *
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={newUser.name}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
                                                placeholder="Nhập tên người dùng"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 mb-2 font-medium">
                                                Email *
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={newUser.email}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
                                                placeholder="Nhập email người dùng"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 mb-2 font-medium">
                                                Mật khẩu *
                                            </label>
                                            <input
                                                type="password"
                                                name="password"
                                                value={newUser.password}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
                                                placeholder="Nhập mật khẩu"
                                            />
                                        </div>
                                    </>
                                )}
                                <div>
                                    <label className="block text-gray-700 mb-2 font-medium">
                                        Vai trò
                                    </label>
                                    <select
                                        name="role"
                                        value={newUser.role}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
                                    >
                                        <option value="USER">Người dùng</option>
                                        <option value="ADMIN">Quản trị viên</option>
                                    </select>
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
                                        {editingUser ? 'Cập nhật' : 'Thêm'}
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

export default UserManage;