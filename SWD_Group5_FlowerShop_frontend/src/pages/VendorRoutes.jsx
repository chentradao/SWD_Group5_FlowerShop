import React from 'react';
import { Route } from 'react-router-dom';
import VendorLayout from '../components/VendorLayout';
import ManageBookPage from './admin/ManageBookPage';
import AdminOrderPage from './admin/AdminOrderPage';
import AdminOrderDetailPage from './admin/AdminOrderDetailPage';
import FlowerForm from '../components/FlowerForm';
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
  <Route path="products" element={<ManageBookPage vendorMode={true} />} />
      <Route path="products/new" element={<FlowerForm />} />
      <Route path="products/edit/:id" element={<FlowerForm isEdit={true} />} />
  <Route path="orders" element={<AdminOrderPage vendorMode={true} />} />
  <Route path="orders/detail/:id" element={<AdminOrderDetailPage vendorMode={true} />} />
      {/* Removed placeholder routes for shop profile and revenue to keep vendor dashboard focused */}
    </Route>
  );
};

export default VendorRoutes;