import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/public/HomePage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import Authors from "./pages/admin/AuthorManage";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import GoogleLoginSuccess from "./components/GoogleLoginSuccess";
import ResetPassword from "./pages/public/ResetPassword";
import ManageBookPage from "./pages/admin/ManageBookPage";
import AddNewBookPage from "./pages/admin/AddNewBookPage";
import EditBookPage from "./pages/admin/EditBookPage";
import UserDetail from "./pages/user/UserDetail";
import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";
import DepositPage from "./pages/user/DepositPage";
import ManageCategoryPage from "./pages/admin/ManageCategoryPage";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedRedirect from "./components/RoleBasedRedirect";
import UserOrdersPage from "./pages/user/UserOrdersPage";
import UserManage from "./pages/admin/UserManage"
import AboutPage from "./pages/public/AboutPage";
import ContactPage from "./pages/public/ContactPage";
import AdminOrderPage from "./pages/admin/AdminOrderPage";
import AdminOrderDetailPage from "./pages/admin/AdminOrderDetailPage";
import RevenuePage from "./pages/admin/RevenuePage";
import BookDetail from "./pages/public/BookDetail";
import ShopBookPage from "./pages/public/ShopPage";
import CheckoutPage from "./pages/user/CheckoutPage";
import ChangePassword from "./pages/user/ChangePassword";
import Error404 from "./pages/public/Error404";
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<RoleBasedRedirect />} />
        <Route path="/shop" element={<ShopBookPage />} />
        <Route
          path="/userdetail"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserDetail />
            </ProtectedRoute>
          }
        />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        
        <Route
          path="/deposit"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <DepositPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/change-password"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <ChangePassword />
            </ProtectedRoute>
          }
        />

        <Route path="/book/:id" element={<BookDetail />} />
        <Route
          path="/user/order"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserOrdersPage />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/login-success" element={<GoogleLoginSuccess />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Error404 />} />
      <Route
          path="/reset-password"
          element={
              <ResetPassword />
          }
        />
      

      <Route
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin-dashboard" element={<RevenuePage />} />
        <Route path="/admin-dashboard/authors" element={<Authors />} />
        <Route path="/admin-dashboard/users" element={<UserManage />} />
        <Route path="/admin-dashboard/books" element={<ManageBookPage />} />
        <Route path="/admin-dashboard/books/new" element={<AddNewBookPage />} />
        <Route path="/admin-dashboard/books/edit/:id" element={<EditBookPage />} />
        <Route path="/admin-dashboard/categories" element={<ManageCategoryPage />} />
        <Route path="/admin-dashboard/orders" element={<AdminOrderPage />} />
        <Route path="/admin-dashboard/order/detail/:id" element={<AdminOrderDetailPage />} />
        <Route
          path="/admin-dashboard/books/edit/:id"
          element={<EditBookPage />}
        />
        <Route
          path="/admin-dashboard/categories"
          element={<ManageCategoryPage />}
        />
      </Route>
    </Routes>
  );
}

export default App;
