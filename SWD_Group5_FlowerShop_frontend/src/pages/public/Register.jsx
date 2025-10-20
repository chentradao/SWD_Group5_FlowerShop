import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../services/axiosConfig";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Swal from 'sweetalert2';

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Vui lòng nhập họ tên.";

    if (!form.email) {
      newErrors.email = "Vui lòng nhập email.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email không hợp lệ.";
    }

    if (!form.password) {
      newErrors.password = "Vui lòng nhập mật khẩu.";
    } else if (form.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu.";
    } else if (form.confirmPassword.length < 6) {
      newErrors.confirmPassword = "Xác nhận mật khẩu phải có ít nhất 6 ký tự.";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const registerData = {
      name: form.name,
      email: form.email,
      password: form.password,
    };

    try {
      setLoading(true);
      await axios.post("/auth/register", registerData);

      await Swal.fire({
        title: 'Đăng ký thành công!',
        text: 'Bạn đã có thể đăng nhập.',
        icon: 'success',
        confirmButtonText: 'OK',
      });

      navigate("/login");
    } catch (err) {
      if (err.response?.status === 409) {
        setErrors({ email: "Email đã tồn tại!" });
      } else if (err.response?.status === 400) {
        Swal.fire({
          title: 'Thông tin không hợp lệ',
          text: 'Vui lòng kiểm tra lại thông tin bạn đã nhập.',
          icon: 'warning',
        });
      } else {
        Swal.fire({
          title: 'Lỗi hệ thống',
          text: 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
          icon: 'error',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-yellow-100 via-orange-200 to-orange-200 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Đăng ký</h2>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-gray-600 mb-1 font-medium" htmlFor="name">Họ tên</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 ${
                errors.name ? "border-red-500 focus:ring-red-300" : "focus:ring-orange-400"
              }`}
              placeholder="Nhập họ tên"
              id="name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-gray-600 mb-1 font-medium" htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 ${
                errors.email ? "border-red-500 focus:ring-red-300" : "focus:ring-orange-400"
              }`}
              placeholder="you@example.com"
              id="email"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="relative">
            <label className="block text-gray-600 mb-1 font-medium" htmlFor="password">Mật khẩu</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 pr-10 ${
                errors.password ? "border-red-500 focus:ring-red-300" : "focus:ring-orange-400"
              }`}
              placeholder="••••••••"
              id="password"
            />
            <div
              className="absolute right-3 top-[40px] cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div className="relative">
            <label className="block text-gray-600 mb-1 font-medium" htmlFor="cf-password">Xác nhận mật khẩu</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 pr-10 ${
                errors.confirmPassword ? "border-red-500 focus:ring-red-300" : "focus:ring-orange-400"
              }`}
              placeholder="••••••••"
              id="cf-password"
            />
            <div
              className="absolute right-3 top-[40px] cursor-pointer text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-xl bg-orange-400 hover:bg-orange-600 text-white font-semibold transition"
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-500">
          Bạn đã có tài khoản?
          <Link to="/login" className="text-orange-500 hover:underline ml-1">Đăng nhập tại đây</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
