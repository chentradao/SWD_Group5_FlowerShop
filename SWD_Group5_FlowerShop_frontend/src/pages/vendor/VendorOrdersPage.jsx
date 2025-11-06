import React, { useEffect, useState } from 'react';
import axios from "../../services/axiosConfig";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { FaEye, FaShippingFast, FaBox, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const MySwal = withReactContent(Swal);

const TABS = [
    { label: "Tất cả", value: "" },
    { label: "Chờ xử lý", value: "PENDING" },
    { label: "Đã xác nhận", value: "CONFIRMED" },
    { label: "Đang giao", value: "SHIPPING" },
    { label: "Đã giao", value: "DELIVERED" },
    { label: "Đã hủy", value: "CANCELLED" },
];

const statusMap = {
    PENDING: {
        label: "Chờ xử lý",
        icon: <FaBox className="inline mr-1" />,
        color: "bg-yellow-100 text-yellow-800",
    },
    CONFIRMED: {
        label: "Đã xác nhận",
        icon: <FaCheckCircle className="inline mr-1" />,
        color: "bg-blue-100 text-blue-800",
    },
    SHIPPING: {
        label: "Đang giao",
        icon: <FaShippingFast className="inline mr-1" />,
        color: "bg-purple-100 text-purple-800",
    },
    DELIVERED: {
        label: "Đã giao",
        icon: <FaCheckCircle className="inline mr-1" />,
        color: "bg-green-100 text-green-800",
    },
    CANCELLED: {
        label: "Đã hủy",
        icon: <FaTimesCircle className="inline mr-1" />,
        color: "bg-red-100 text-red-800",
    },
    default: {
        label: "Không rõ",
        icon: <FaBox className="inline mr-1" />,
        color: "bg-gray-100 text-gray-800",
    },
};

const VendorOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [filterStatus, setFilterStatus] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, [filterStatus]);

    const fetchOrders = async () => {
        try {
            const res = await axios.get(`/vendor/order/get`, {
                params: { status: filterStatus }
            });
            setOrders(res.data);
        } catch (err) {
            console.error('Lỗi khi lấy danh sách đơn hàng:', err);
            MySwal.fire('Lỗi', 'Không thể tải danh sách đơn hàng', 'error');
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        const statusLabels = {
            CONFIRMED: 'Xác nhận',
            SHIPPING: 'Giao hàng',
        };
        
        const result = await MySwal.fire({
            title: `${statusLabels[newStatus]} đơn hàng?`,
            text: `Bạn có chắc muốn ${statusLabels[newStatus].toLowerCase()} đơn hàng này?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: statusLabels[newStatus],
            cancelButtonText: 'Hủy',
        });

        if (result.isConfirmed) {
            try {
                await axios.put(`/vendor/order/${orderId}/status`, { status: newStatus });
                MySwal.fire('Thành công', `Đơn hàng đã được ${statusLabels[newStatus].toLowerCase()}.`, 'success');
                fetchOrders();
            } catch (error) {
                console.error('Lỗi cập nhật trạng thái:', error);
                MySwal.fire('Lỗi', 'Không thể cập nhật trạng thái đơn hàng.', 'error');
            }
        }
    };

    const handleView = (orderId) => {
        const order = orders.find(o => o.id === orderId);
        if (order) {
            setSelectedOrder(order);
        } else {
            navigate(`/vendor-dashboard/orders/detail/${orderId}`);
        }
    };

    const closeModal = () => {
        setSelectedOrder(null);
    };

    return (
        <div className="flex h-screen">
            <main className="flex-1 py-6 overflow-auto">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Quản lý đơn hàng</h2>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-2">
                    {TABS.map(tab => (
                        <button
                            key={tab.value}
                            onClick={() => setFilterStatus(tab.value)}
                            className={`px-4 py-2 text-sm rounded-full transition-all duration-200 ${
                                filterStatus === tab.value
                                    ? "bg-blue-600 text-white"
                                    : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Order Table */}
                {orders.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Không có đơn hàng nào</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border rounded-lg shadow-sm">
                            <thead>
                                <tr className="bg-gray-100 text-left text-sm text-gray-700">
                                    <th className="py-3 px-4 border-b">Mã đơn</th>
                                    <th className="py-3 px-4 border-b">Người nhận</th>
                                    <th className="py-3 px-4 border-b">SĐT</th>
                                    <th className="py-3 px-4 border-b">Địa chỉ</th>
                                    <th className="py-3 px-4 border-b">Thời gian</th>
                                    <th className="py-3 px-4 border-b">Tổng tiền</th>
                                    <th className="py-3 px-4 border-b">Trạng thái</th>
                                    <th className="py-3 px-4 border-b text-center">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => {
                                    const address = order.userAddress;
                                    const items = order.items || [];
                                    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
                                    return (
                                        <tr key={order.id} className="odd:bg-gray-50 hover:bg-gray-100 transition">
                                            <td className="py-3 px-4 border-b">
                                              <div>{order.id.substring(0, 8)}...</div>
                                              <div className="text-xs text-gray-500">{totalItems} sản phẩm</div>
                                            </td>
                                            <td className="py-3 px-4 border-b">
                                              <div>{address?.fullName || 'N/A'}</div>
                                              {order.user && <div className="text-xs text-gray-500">Email: {order.user.email}</div>}
                                            </td>
                                            <td className="py-3 px-4 border-b">{address?.phone || 'N/A'}</td>
                                            <td className="py-3 px-4 border-b">
                                                {address ? `${address.addressDetail}, ${address.ward}, ${address.district}, ${address.province}` : 'N/A'}
                                            </td>
                                            <td className="py-3 px-4 border-b whitespace-nowrap">
                                                {new Date(order.createdAt).toLocaleString('vi-VN')}
                                            </td>
                                            <td className="py-3 px-4 border-b text-red-600 font-semibold whitespace-nowrap">
                                                {order.shopTotal ? order.shopTotal.toLocaleString('vi-VN') : order.total?.toLocaleString('vi-VN')} ₫
                                            </td>
                                            <td className="py-3 px-4 border-b whitespace-nowrap">
                                                {(() => {
                                                    const status = statusMap[order.status] || statusMap.default;
                                                    return (
                                                        <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap flex items-center gap-1 w-fit ${status.color}`}>
                                                            {status.icon}
                                                            {status.label}
                                                        </span>
                                                    );
                                                })()}
                                            </td>
                                            <td className="py-2 px-3 border-b">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleView(order.id)}
                                                        className="text-blue-500 hover:text-blue-700 text-base"
                                                        title="Xem chi tiết"
                                                    >
                                                        <FaEye />
                                                    </button>

                                                    {order.status === "PENDING" && (
                                                        <button
                                                            onClick={() => handleUpdateStatus(order.id, 'CONFIRMED')}
                                                            className="text-green-600 hover:text-green-800 text-base"
                                                            title="Xác nhận đơn hàng"
                                                        >
                                                            ✔️
                                                        </button>
                                                    )}
                                                    {order.status === "CONFIRMED" && (
                                                        <button
                                                            onClick={() => handleUpdateStatus(order.id, 'SHIPPING')}
                                                            className="text-blue-600 hover:text-blue-800 text-base"
                                                            title="Bắt đầu giao hàng"
                                                        >
                                                            <FaShippingFast />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            {/* Quick View Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Chi tiết đơn hàng #{selectedOrder.id.substring(0, 8)}</h3>
                            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">✕</button>
                        </div>

                        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium mb-2">Thông tin người nhận</h4>
                            <p>Họ tên: {selectedOrder.userAddress?.fullName}</p>
                            <p>SĐT: {selectedOrder.userAddress?.phone}</p>
                            <p>Địa chỉ: {selectedOrder.userAddress ? 
                                `${selectedOrder.userAddress.addressDetail}, ${selectedOrder.userAddress.ward}, ${selectedOrder.userAddress.district}, ${selectedOrder.userAddress.province}`
                                : 'N/A'}</p>
                        </div>

                        <div className="overflow-x-auto mb-4">
                            <table className="min-w-full bg-white">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="py-2 px-4 text-left">Sản phẩm</th>
                                        <th className="py-2 px-4 text-left">Số lượng</th>
                                        <th className="py-2 px-4 text-right">Đơn giá</th>
                                        <th className="py-2 px-4 text-right">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedOrder.items?.map((item, idx) => (
                                        <tr key={idx} className="border-b">
                                            <td className="py-2 px-4">
                                                <div className="flex items-center gap-2">
                                                    <img 
                                                        src={`${import.meta.env.VITE_API_URL}${item.flower?.image || ''}`}
                                                        alt={item.flower?.title}
                                                        className="w-12 h-12 object-cover rounded"
                                                    />
                                                    <div>
                                                        <p className="font-medium">{item.flower?.title}</p>
                                                        <p className="text-sm text-gray-500">#{item.flowerId.substring(0, 8)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-2 px-4">{item.quantity}</td>
                                            <td className="py-2 px-4 text-right">{item.price?.toLocaleString('vi-VN')}₫</td>
                                            <td className="py-2 px-4 text-right">{(item.price * item.quantity).toLocaleString('vi-VN')}₫</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="font-bold">
                                        <td colSpan="3" className="py-2 px-4 text-right">Tổng cộng:</td>
                                        <td className="py-2 px-4 text-right">{selectedOrder.shopTotal?.toLocaleString('vi-VN')}₫</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Thời gian đặt: {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Phương thức thanh toán: {selectedOrder.payment === 'COD' ? 'Tiền mặt khi nhận hàng' : 'Ví điện tử'}
                                </p>
                            </div>
                            {(selectedOrder.status === "PENDING" || selectedOrder.status === "CONFIRMED") && (
                                <div className="flex gap-2">
                                    {selectedOrder.status === "PENDING" && (
                                        <button
                                            onClick={() => {
                                                handleUpdateStatus(selectedOrder.id, 'CONFIRMED');
                                                closeModal();
                                            }}
                                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                        >
                                            Xác nhận
                                        </button>
                                    )}
                                    {selectedOrder.status === "CONFIRMED" && (
                                        <button
                                            onClick={() => {
                                                handleUpdateStatus(selectedOrder.id, 'SHIPPING');
                                                closeModal();
                                            }}
                                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        >
                                            Giao hàng
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VendorOrdersPage;

