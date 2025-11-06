import React from 'react';
import AdminLayout from './AdminLayout';
 
import { FaBook } from 'react-icons/fa';

const VendorLayout = () => {
  

  const menuItems = [
    { label: 'Sản phẩm', path: '/vendor-dashboard/products' },
    { label: 'Đơn hàng', path: '/vendor-dashboard/orders' },
    // Removed placeholder menu items (shop-profile, revenue) to keep vendor UI focused
  ];

  return (
    <AdminLayout
      navigationItemsOverride={menuItems.map(m => ({ id: m.path, name: m.label, icon: FaBook, path: m.path }))}
      title="Vendor Dashboard"
    />
  );
};

export default VendorLayout;