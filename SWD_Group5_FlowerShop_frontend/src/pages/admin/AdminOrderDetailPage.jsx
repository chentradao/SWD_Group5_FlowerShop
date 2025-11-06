import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from "../../services/axiosConfig";
import { FaRegClock } from 'react-icons/fa';
import { MdOutlinePayment } from 'react-icons/md';
import { BiSolidUser, BiSolidPhone } from 'react-icons/bi';
import { PiMapPinLineBold } from 'react-icons/pi';

const AdminOrderDetailPage = ({ vendorMode = false }) => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);

    const [address, setAddress] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null); // Modal image
    const [setShowUserDropdown] = useState(false);
    const dropdownContainerRef = useRef(null);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleClickOutside = (event) => {
        if (
            dropdownContainerRef.current &&
            !dropdownContainerRef.current.contains(event.target)
        ) {
            setShowUserDropdown(false);
        }
    };

    useEffect(() => {
        const endpoint = vendorMode ? `/vendor/order/detail/${id}` : `/admin/order/detail/${id}`;
        axios
            .get(endpoint)
            .then(res => {
                setOrder(res.data);
                console.log(res.data);

                try {
                    const address = res.data.userAddress;
                    setAddress(address);
                } catch (err) {
                    console.error('Lỗi parse địa chỉ:', err);
                    setParsedAddress(null);
                }
            })
            .catch(err => console.error(err));
    }, [id, vendorMode]);
    if (!order) return <div className="text-center mt-20 text-xl">Đang tải đơn hàng...</div>;

    return (
        <div className="flex bg-gray-100 h-screen">

            <div className="flex-1 p-6  overflow-y-auto">
                <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold mb-6 text-center">Chi tiết đơn hàng #{order.id}</h2>

                    <div className="grid grid-cols-2 gap-4 mb-6 text-gray-700">
                        <div className="flex items-center gap-2">
                            <BiSolidUser className="text-blue-500" />
                            <span><strong>Người nhận:</strong> {address.fullName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <BiSolidPhone className="text-green-500" />
                            <span><strong>SĐT:</strong> {address.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 col-span-2">
                            <PiMapPinLineBold className="text-red-500" />
                            <span>
                                <strong>Địa chỉ:</strong>{' '}
                                {address
                                    ? `${address.addressDetail}, ${address.ward}, ${address.district}, ${address.province}`
                                    : order.userAddress}
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
                            <span><strong>Ngày đặt:</strong> {new Date(order.createdAt).toLocaleString()}</span>
                        </div>
                    </div>

                    <h3 className="text-lg font-semibold mb-3 border-b pb-1">Sản phẩm trong đơn:</h3>
                    <div className="space-y-4">
                        {order.items.map((item, index) => (

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
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm">Số lượng: <strong>{item.quantity}</strong></p>
                                    <p className="text-sm">Giá: <strong>{item.price?.toLocaleString() || '---'}₫</strong></p>
                                </div>
                            </div>
                        ))}
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

export default AdminOrderDetailPage;
