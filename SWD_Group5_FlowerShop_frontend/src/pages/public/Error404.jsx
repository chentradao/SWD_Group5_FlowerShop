import React from 'react';
import { Link } from 'react-router-dom';

const Error404 = () => {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-[#FFE4B5]">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-lg border-2 border-orange-600 p-10 flex flex-col items-center">
        <h1 className="text-[6rem] font-extrabold tracking-widest text-orange-700 font-sans drop-shadow-lg mb-2">
          404
        </h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Trang không tìm thấy
        </h2>
        <p className="text-gray-800 text-lg mb-8 text-center">
          Xin lỗi, trang bạn đang tìm kiếm đã lạc mất đâu đó rồi.<br />
          Vui lòng kiểm tra lại URL hoặc quay lại trang chủ.
        </p>
        <Link
          to="/"
          className="bg-gradient-to-r from-orange-700 to-yellow-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:scale-105 transition-transform text-lg"
        >
          Quay lại trang chủ
        </Link>
      </div>
    </div>
  );
};

export default Error404;
