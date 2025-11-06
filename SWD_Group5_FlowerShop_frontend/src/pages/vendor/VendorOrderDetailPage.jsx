import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from "../../services/axiosConfig";
import { FaRegClock } from 'react-icons/fa';
import { MdOutlinePayment } from 'react-icons/md';
import { BiSolidUser, BiSolidPhone } from 'react-icons/bi';
import { PiMapPinLineBold } from 'react-icons/pi';

const VendorOrderDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [address, setAddress] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        axios
            .get(`/vendor/order/detail/${id}`)
            .then(res => {
                setOrder(res.data);
                try {
                    const address = res.data.userAddress;
                    setAddress(address);
                } catch (err) {
                    console.error('Lỗi parse địa chỉ:', err);
                }
            })
            .catch(err => {
                console.error(err);
                navigate('/vendor-dashboard/orders');
            });
    }, [id, navigate]);

    if (!order) return <div className="text-center mt-20 text-xl">Đang tải đơn hàng...</div>;

    return (
        <div className="flex bg-gray-100 h-screen">
            <div className="flex-1 p-6 overflow-y-auto">
                <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Chi tiết đơn hàng #{order.id.substring(0, 8)}...</h2>
                        <button
                            onClick={() => navigate('/vendor-dashboard/orders')}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            Quay lại
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6 text-gray-700">
                        <div className="flex items-center gap-2">
                            <BiSolidUser className="text-blue-500" />
                            <span><strong>Người nhận:</strong> {address?.fullName || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <BiSolidPhone className="text-green-500" />
                            <span><strong>SĐT:</strong> {address?.phone || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2 col-span-2">
                            <PiMapPinLineBold className="text-red-500" />
                            <span>
                                <strong>Địa chỉ:</strong>{' '}
                                {address
                                    ? `${address.addressDetail}, ${address.ward}, ${address.district}, ${address.province}`
                                    : 'N/A'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MdOutlinePayment className="text-purple-500" />
                            <span><strong>Thanh toán:</strong> {order.payment === "Wallet"
                                ? "Thanh toán ví"
                                : order.payment === "COD"
                                    ? "Thanh toán khi nhận hàng"
                                    : order.payment}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaRegClock className="text-orange-500" />
                            <span><strong>Ngày đặt:</strong> {new Date(order.createdAt).toLocaleString('vi-VN')}</span>
                        </div>
                    </div>

                    <h3 className="text-lg font-semibold mb-3 border-b pb-1">Sản phẩm trong đơn:</h3>
                    <div className="space-y-4">
                        {order.items && order.items.length > 0 ? (
                            order.items.map((item, index) => (
                                <div key={index} className="flex items-center justify-between bg-gray-50 border rounded-lg p-4">
                                    <div className="flex items-center gap-4">
                                        {item.flower?.image && (
                                            <img
                                                src={`${import.meta.env.VITE_API_URL}${item.flower.image}`}
                                                alt={item.flower.title}
                                                className="w-20 h-20 object-cover cursor-pointer hover:scale-105 transition-transform duration-200 rounded"
                                                onClick={() => setSelectedImage(`${import.meta.env.VITE_API_URL}${item.flower.image}`)}
                                            />
                                        )}
                                        <div>
                                            <p className="font-semibold">{item.flower?.title || 'N/A'}</p>
                                            <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm">Giá: <strong>{item.price?.toLocaleString('vi-VN') || '---'}₫</strong></p>
                                        <p className="text-sm font-semibold text-red-600">
                                            Tổng: {(item.price * item.quantity)?.toLocaleString('vi-VN')}₫
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">Không có sản phẩm nào</p>
                        )}
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <p className="text-lg font-semibold text-gray-800">
                            Tổng tiền đơn hàng: <span className="text-red-600 text-xl">
                                {order.shopTotal ? order.shopTotal.toLocaleString('vi-VN') : order.total?.toLocaleString('vi-VN')}₫
                            </span>
                        </p>
                    </div>
                </div>
            </div>
            {/* Modal hiển thị ảnh */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
                    onClick={() => setSelectedImage(null)}
                >
                    <img
                        src={selectedImage}
                        alt="Ảnh sản phẩm"
                        className="max-w-[90%] max-h-[80%] object-contain rounded shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
};

export default VendorOrderDetailPage;

