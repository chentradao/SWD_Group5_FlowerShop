import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaCcVisa, FaCcMastercard, FaCcPaypal } from 'react-icons/fa';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';

const Footer = () => {
    return (
        <footer className="bg-[#2C2C2C] text-white px-10 py-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">
                
                {/* Hỗ trợ khách hàng */}
                <div>
                    <h5 className="font-semibold text-lg mb-4">HỖ TRỢ KHÁCH HÀNG</h5>
                    <ul className="space-y-2 text-gray-300">
                        <li><a href="#" className="hover:text-white transition">Trợ giúp & Câu hỏi thường gặp</a></li>
                        <li><a href="#" className="hover:text-white transition">Vận chuyển</a></li>
                        <li><a href="#" className="hover:text-white transition">Đổi trả</a></li>
                    </ul>
                </div>

                {/* Về chúng tôi */}
                <div>
                    <h5 className="font-semibold text-lg mb-4">VỀ CHÚNG TÔI</h5>
                    <ul className="space-y-2 text-gray-300">
                        <li><a href="#" className="hover:text-white transition">Câu chuyện của chúng tôi</a></li>
                        <li><a href="#" className="hover:text-white transition">Tuyển dụng</a></li>
                        <li><a href="#" className="hover:text-white transition">Điều khoản & Điều kiện</a></li>
                        <li><a href="#" className="hover:text-white transition">Chính sách bảo mật</a></li>
                    </ul>
                </div>

                {/* Thông tin liên hệ */}
                <div>
                    <h5 className="font-semibold text-lg mb-4">LIÊN HỆ</h5>
                    <ul className="space-y-2 text-gray-300">
                        <li className="flex items-start"><MdLocationOn className="mr-2 mt-0.5" /> 123 Đường Sách, Hà Nội, Việt Nam</li>
                        <li className="flex items-center"><MdPhone className="mr-2" /> +84 123 456 789</li>
                        <li className="flex items-center"><MdEmail className="mr-2" /> support@fuhusu.com</li>
                    </ul>
                </div>

                {/* Mạng xã hội */}
                <div>
                    <h5 className="font-semibold text-lg mb-4">KẾT NỐI VỚI CHÚNG TÔI</h5>
                    <div className="flex space-x-4 text-xl text-gray-300 mb-4">
                        <a href="#"><FaFacebookF className="hover:text-white transition" /></a>
                        <a href="#"><FaInstagram className="hover:text-white transition" /></a>
                        <a href="#"><FaTwitter className="hover:text-white transition" /></a>
                    </div>

                    <h5 className="font-semibold text-sm mb-2">FUHUSU Bookstore</h5>
                    <p className="text-gray-300 text-sm">
                        Sách hay, giá tốt, giao tận tay.
                    </p>
                </div>
            </div>

            <hr className="my-6 border-gray-600" />

            {/* Bản quyền */}
            <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
                <p>© 2025 FUHUSU Bookstore. Mọi quyền được bảo lưu.</p>
                <div className="flex space-x-4 mt-2 md:mt-0 text-2xl">
                    <FaCcVisa />
                    <FaCcMastercard />
                    <FaCcPaypal />
                </div>
            </div>
        </footer>
    );
};

export default Footer;
