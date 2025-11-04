import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../contexts/AuthContext';

const VendorLayout = () => {
  const { user } = useAuth();

  const menuItems = [
    { label: 'Sản phẩm', path: '/vendor-dashboard/products' },
    { label: 'Đơn hàng', path: '/vendor-dashboard/orders' },
    { label: 'Thông tin shop', path: '/vendor-dashboard/shop-profile' },
    { label: 'Doanh thu', path: '/vendor-dashboard/revenue' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar menuItems={menuItems} userRole="vendor" />
      <div className="flex-1">
        <div className="p-4">
          <div className="mb-4">
            <h1 className="text-2xl font-semibold">Shop Dashboard</h1>
            <p className="text-gray-600">{user?.shop?.name || 'Shop của bạn'}</p>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default VendorLayout;