import React from 'react';
import { MdLocationOn, MdEmail, MdPhone } from 'react-icons/md';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';

const ContactPage = () => {
  return (
    <div className="px-6 md:px-16 py-12 bg-[#FFEFD5] text-[#2F2F2F] font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Liên hệ với chúng tôi</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
          {/* Thông tin liên hệ */}
          <div className="space-y-5 text-sm text-gray-700">
            <div className="flex items-start">
              <MdLocationOn className="text-2xl text-[#B84D36] mr-3 mt-1" />
              <p>123 Book Street, Hanoi, Vietnam</p>
            </div>
            <div className="flex items-center">
              <MdEmail className="text-2xl text-[#B84D36] mr-3" />
              <p>support@fuhusu.vn</p>
            </div>
            <div className="flex items-center">
              <MdPhone className="text-2xl text-[#B84D36] mr-3" />
              <p>+84 123 456 789</p>
            </div>

            <div className="flex space-x-4 text-xl mt-4 text-gray-600">
              <a href="#"><FaFacebookF className="hover:text-[#B84D36] transition" /></a>
              <a href="#"><FaInstagram className="hover:text-[#B84D36] transition" /></a>
              <a href="#"><FaTwitter className="hover:text-[#B84D36] transition" /></a>
            </div>
          </div>

          {/* Form liên hệ */}
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Tên của bạn"
              className="w-full border border-gray-300 px-4 py-2 rounded text-sm focus:outline-none focus:border-[#B84D36]"
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 px-4 py-2 rounded text-sm focus:outline-none focus:border-[#B84D36]"
              required
            />
            <textarea
              placeholder="Nội dung tin nhắn"
              rows="5"
              className="w-full border border-gray-300 px-4 py-2 rounded text-sm focus:outline-none focus:border-[#B84D36]"
              required
            ></textarea>
            <button
              type="submit"
              className="bg-[#B84D36] text-white px-6 py-2 rounded hover:bg-[#a23f2c] transition text-sm"
            >
              Gửi tin nhắn
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500">
          Chúng tôi sẽ phản hồi email của bạn trong vòng 24 giờ làm việc.
        </p>
      </div>
    </div>
  );
};

export default ContactPage;
