import React from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import CategoriesSection from '../../components/CategoriesSection';
import PopularBooksSection from '../../components/PopularBooksSection';
import NewsletterSection from '../../components/NewsletterSection';
import NewArrivalsSection from '../../components/NewArrivalsSection';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/shop`);
    };
    return (
        <div className="bg-[#FFEFD5] text-[#2F2F2F] font-sans">
            {/* Header */}

            {/* Banner */}
            <section className="bg-[#F3C469] px-4 sm:px-6 md:px-10 py-10 md:py-16 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="md:w-1/2 text-center md:text-left">
                    <h1 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-wide mb-2">
                        KHÁM PHÁ CUỐN SÁCH TIẾP THEO CỦA BẠN
                    </h1>
                    <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight mb-6">
                        YÊU THÍCH NHẤT
                    </h2>
                    <button
                        className="bg-[#C1462F] text-white px-5 sm:px-6 py-2 rounded hover:bg-[#a53b28] transition"
                        onClick={handleClick}
                    >
                        MUA NGAY
                    </button>
                </div>
                <div className="md:w-1/2 flex justify-center gap-4 sm:gap-6 flex-wrap">
                    <img src="/images/demenphieuluuky.png" alt="Sách 1" className="w-24 sm:w-28 md:w-32 h-auto" />
                    <img src="/images/consetugiac.png" alt="Sách 2" className="w-24 sm:w-28 md:w-32 h-auto" />
                    <img src="/images/tietkiemchotuonglai.png" alt="Sách 3" className="w-24 sm:w-28 md:w-32 h-auto" />
                </div>
            </section>

            <CategoriesSection />

            <NewArrivalsSection />

            <PopularBooksSection />

            <NewsletterSection />
        </div>
    );
};

export default HomePage;
