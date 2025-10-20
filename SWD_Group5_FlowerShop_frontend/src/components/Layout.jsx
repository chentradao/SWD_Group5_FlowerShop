import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';
import { FaBars, FaTimes } from 'react-icons/fa';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    // Đóng sidebar khi chuyển route
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location]);

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-tr from-yellow-100 via-orange-200 to-orange-200">
            <div className="flex flex-1">
                {/* Main content */}
                <div className="flex-1 flex flex-col">
                    {/* Header with toggle button */}
                    <div className="relative">
                        <Header />
                        {/* Toggle button for sidebar */}
                        <button
                            onClick={toggleSidebar}
                            className="fixed top-4 right-4 z-50 hover:bg-gray-700 hover:text-white text-black p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                            aria-label="Toggle sidebar"
                        >
                            {isSidebarOpen ? <FaTimes size={20} color='white' /> : <FaBars size={20} />}
                        </button>
                    </div>

                    {/* Content */}
                    <main className="flex-1">
                        <Outlet />
                    </main>

                    {/* Footer */}
                    <Footer />
                </div>
            </div>

            {/* Offcanvas Sidebar */}
            <div className={`fixed inset-0 z-40 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                {/* Overlay */}
                <div 
                    className="absolute inset-0 bg-black bg-opacity-50"
                    onClick={closeSidebar}
                ></div>
                
                {/* Sidebar */}
                <div className={`absolute top-0 right-0 h-full w-80 bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="h-full flex flex-col">
                        {/* Sidebar Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-700">
                            <h2 className="text-xl font-bold text-white">Menu</h2>                            
                        </div>
                        
                        {/* Sidebar Content */}
                        <div className="flex-1 overflow-y-auto">
                            <Sidebar onClose={closeSidebar} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Layout;