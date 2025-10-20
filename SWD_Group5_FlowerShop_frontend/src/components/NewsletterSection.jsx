import React from 'react';

const NewsletterSection = () => {
    return (
        <section className="px-10 py-12 bg-[#C1462F] text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Luôn Cập Nhật</h3>
            <p className="mb-6">Đăng ký nhận bản tin để nhận tin tức và ưu đãi mới nhất</p>
            <div className="flex justify-center">
                <input 
                    type="email" 
                    placeholder="Nhập email của bạn" 
                    className="px-4 py-2 rounded-l border-none text-black" 
                />
                <button className="bg-[#a53b28] px-6 py-2 rounded-r hover:bg-[#8c3222] transition">
                    Đăng ký
                </button>
            </div>
        </section>
    );
};

export default NewsletterSection;
