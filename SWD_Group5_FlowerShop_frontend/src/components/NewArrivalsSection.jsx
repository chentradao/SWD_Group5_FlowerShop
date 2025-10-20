import React, { useEffect, useState } from 'react';
import axios from '../services/axiosConfig';
import { useNavigate } from 'react-router-dom';

const NewArrivalsSection = () => {
    const [newArrivals, setNewArrivals] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/books/new-arrivals')
            .then(res => {
                setNewArrivals(res.data.slice(0, 4)); // lấy tối đa 4 sách
            })
            .catch(err => console.error(err));
    }, []);

    const handleBookClick = (id) => {
        navigate(`/book/${id}`);
    };

    return (
        <section className="px-4 sm:px-6 md:px-10 py-10 bg-[#FFE4B5]">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight">Sách Mới Ra Mắt</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {newArrivals.map((book) => (
                    <div 
                        key={book.id} 
                        className="text-center cursor-pointer"
                        onClick={() => handleBookClick(book.id)}
                    >
                        <img
                            src={`${import.meta.env.VITE_API_URL}${book.image}` || '/images/placeholder.png'}
                            alt={book.title}
                            className="mx-auto w-24 sm:w-28 md:w-32 h-32 sm:h-36 md:h-44 object-cover mb-3"
                        />
                        <h4 className="font-semibold text-sm sm:text-base">{book.title}</h4>
                        <p className="text-xs sm:text-sm text-gray-600">{book.author}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default NewArrivalsSection;
