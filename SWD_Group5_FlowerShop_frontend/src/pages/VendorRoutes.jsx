import React from 'react';
import { Route } from 'react-router-dom';
import VendorLayout from '../components/VendorLayout';
import VendorProductsPage from './vendor/VendorProductsPage';
import BookForm from '../components/BookForm';
import ProtectedRoute from '../components/ProtectedRoute';

const VendorRoutes = () => {
  return (
    <Route
      path="/vendor-dashboard"
      element={
        <ProtectedRoute allowedRoles={['vendor']}>
          <VendorLayout />
        </ProtectedRoute>
      }
    >
      <Route path="products" element={<VendorProductsPage />} />
      <Route path="products/new" element={<BookForm />} />
      <Route path="products/edit/:id" element={<BookForm isEdit={true} />} />
      <Route path="orders" element={<div>Quản lý đơn hàng</div>} />
      <Route path="shop-profile" element={<div>Thông tin shop</div>} />
      <Route path="revenue" element={<div>Thống kê doanh thu</div>} />
    </Route>
  );
};

export default VendorRoutes;