import React, { useState, useEffect } from "react";
import axios from "../services/axiosConfig";
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { BookOpenIcon } from '@heroicons/react/24/solid';
import {
  FaHome,
  FaBook,
  FaUserEdit,
  FaTags,
  FaUserFriends,
  FaShoppingCart,
  FaSignOutAlt,
} from "react-icons/fa";

const AdminLayout = ({ navigationItemsOverride = null, title = 'Quản trị' }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState("dashboard");
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(false);

  const navigate = useNavigate();


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const [user] = useState(() => {
    const cached = localStorage.getItem("user");
    return cached ? JSON.parse(cached) : null;
  });

  // Best sellers removed - products are now managed by vendors

  const defaultNavigation = [
    { id: "dashboard", name: "Bảng điều khiển", icon: FaHome, path: "/admin-dashboard" },
    { id: "category", name: "Thể loại", icon: FaTags, path: "/admin-dashboard/categories" },
    { id: "user", name: "Người dùng", icon: FaUserFriends, path: "/admin-dashboard/users" },
  ];

  const navigationItems = navigationItemsOverride || defaultNavigation;

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout", {}, { withCredentials: true });
      localStorage.removeItem("user");
      navigate(`/`);
    } catch (error) {
      console.error("Đăng xuất thất bại:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${isSidebarOpen ? "w-64" : "w-16"} bg-gray-900 text-white transition-all duration-300 ease-in-out flex flex-col`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              {isSidebarOpen && (
                <span className="ml-3 text-xl font-bold">{title}</span>
              )}
            </div>
          </div>

          {/* Menu */}
          <nav className="flex-1 px-4 py-6">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={() => setActiveItem(item.id)}
                    className={`flex items-center px-3 py-2 rounded-lg transition-colors ${activeItem === item.id
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    {isSidebarOpen && <span className="ml-3">{item.name}</span>}
                  </Link>
                );
              })}
            </div>

            {/* Best Sellers - Removed as products are now managed by vendors */}
          </nav>

          {/* Đăng xuất */}
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
            >
              <FaSignOutAlt />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>

      {/* Nội dung chính */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center flex-1">
              <button
                onClick={toggleSidebar}
                className="mr-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title={isSidebarOpen ? "Đóng thanh bên" : "Mở thanh bên"}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>

            {/* Thông tin người dùng */}
            <div className="flex items-center space-x-4">
              <div className="w-px h-6 bg-gray-300"></div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-700 font-semibold text-sm">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-700">
                    {user?.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Nội dung */}
        <main className="flex-1 overflow-auto bg-gray-100">
          <div className="p-6">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm min-h-[calc(100vh-200px)]">
              <div className="p-8">
                <Outlet />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
