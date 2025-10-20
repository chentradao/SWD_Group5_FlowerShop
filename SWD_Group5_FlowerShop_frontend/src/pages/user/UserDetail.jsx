import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../services/axiosConfig";

const UserDetail = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem("user");
    return cached ? JSON.parse(cached) : null;
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [orders, setOrders] = useState([]);

  const fetchOrders = async (limit) => {
    try {
      const res = await axios.get("/order/get", {
        params: {
          userId: user.id,
          limit: limit,
        },
      });
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Lấy 5 đơn hàng gần nhất khi load trang
  useEffect(() => {
    fetchOrders(5);
  }, []);

  const handleClick = () => {
    navigate(`/deposit`);
  };

  const handleChangePassword = () => {
    navigate(`/change-password`);
  };

  const statusMap = {
  PENDING: "Chờ xử lý",
  CONFIRMED: "Đã xác nhận",
  SHIPPING: "Đang giao",
  DELIVERED: "Đã giao",
  CANCELLED: "Đã hủy",
};

  return (
    <>
      {/* Modal sửa thông tin */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative animate-fade-in">
            <h3 className="text-lg font-bold mb-4 text-center">Sửa thông tin người dùng</h3>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Tên</label>
              <input
                type="text"
                className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-violet-500"
                value={editName}
                onChange={e => setEditName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Email</label>
              <input
                type="email"
                className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-violet-500"
                value={editEmail}
                onChange={e => setEditEmail(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                className="px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700 text-white rounded font-semibold"
                onClick={() => {
                  const updatedUser = { ...user, name: editName, email: editEmail };
                  localStorage.setItem("user", JSON.stringify(updatedUser));
                  setUser(updatedUser);
                  setIsEditing(false);
                }}
              >
                Lưu
              </button>
              <button
                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded font-semibold"
                onClick={() => setIsEditing(false)}
              >
                Hủy
              </button>
            </div>
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl font-bold"
              onClick={() => setIsEditing(false)}
              aria-label="Đóng"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="flex item-center justify-between pt-6 w-full gap-6 flex-col md:flex-row p-8">
        {/* Left: User info */}
        <div className="md:w-1/3 w-full bg-gray-100 rounded-xl flex flex-col gap-4 shadow-sm p-6">
          <h2 className="text-xl font-bold mb-2">Thông tin người dùng</h2>
          <div className="space-y-2">
            <div>
              <span className="font-semibold">Tên: </span>
              <span>{user.name}</span>
            </div>
            <div>
              <span className="font-semibold">Email: </span>
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Số dư ví: </span>
              <span className="text-green-600 font-bold">
                {(user?.wallet ?? 0).toLocaleString()} đ
              </span>
              <button
                className="ml-2 px-3 py-1 bg-violet-600 text-white rounded hover:bg-violet-700 text-sm"
                onClick={handleClick}
              >
                Nạp ví
              </button>
            </div>
            <div>
              <span className="font-semibold">Mật khẩu: </span>
              <span>******</span>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded font-semibold"
              onClick={() => {
                setEditName(user.name);
                setEditEmail(user.email);
                setIsEditing(true);
              }}
            >
              Sửa thông tin
            </button>
            {!(user.passwordHash === "") && (
              <button
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded font-semibold"
                onClick={handleChangePassword}
              >
                Đổi mật khẩu
              </button>
            )}
          </div>
        </div>
        {/* Right: Orders list */}
        <div className="md:w-2/3 w-full bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Danh sách đơn hàng</h2>
            <button
              onClick={() => navigate("/user/order")}
              className="text-blue-500 hover:underline"
            >
              Xem tất cả
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Đơn hàng
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng tiền
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày đặt
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-2 font-semibold text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      {(order?.total ?? 0).toLocaleString()} đ
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={
                          order.status === "Đã giao"
                            ? "text-green-600 font-semibold"
                            : order.status === "Đã hủy"
                            ? "text-red-500 font-semibold"
                            : "text-yellow-600 font-semibold"
                        }
                      >
                        {statusMap[order.status] || order.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDetail;
