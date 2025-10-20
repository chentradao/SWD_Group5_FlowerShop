import React, { useEffect, useState } from 'react';
import axios from "../services/axiosConfig";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { useNavigate } from 'react-router-dom';

const CategoriesSection = () => {
    const [categories, setCategories] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/categories/get')
            .then(res => setCategories(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleCategoryClick = (id) => {
        navigate(`/shop?categoryId=${id}`);
    }

    return (
        <section className="px-10 py-12 bg-[#FFEFD5]">
            <div className="flex justify-center items-center mb-4 text-center">
                <h2 className="text-2xl font-bold tracking-wide text-gray-900 uppercase mb-4">
                    Danh Mục Sách
                </h2>
            </div>

            <Swiper
                modules={[Navigation]}
                navigation
                spaceBetween={20}
                slidesPerView={1}
                breakpoints={{
                    640: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                }}
                className="max-w-[1200px]"
            >
                {categories.map((cat) => (
                    <SwiperSlide key={cat.id}>
                        <div
                            onClick={() => handleCategoryClick(cat.id)}
                            className="cursor-pointer text-center bg-[#F3C469] p-4 rounded-lg shadow hover:shadow-lg transition flex flex-col items-center justify-center"
                        >
                            <div className="w-12 h-12 mb-2 bg-white rounded-full flex items-center justify-center">
                                <img
                                    src="/images/sach.png"
                                    alt="Biểu tượng danh mục"
                                    className="w-8 h-8 object-contain"
                                />
                            </div>
                            <h4 className="font-semibold">{cat.name}</h4>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default CategoriesSection;
