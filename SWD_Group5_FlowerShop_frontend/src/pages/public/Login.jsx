import React, { useState } from "react";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "../../services/axiosConfig";
import { useAuth } from "../../contexts/AuthContext";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!validate()) return;

    try {
      const res = await axios.post("/auth/login", form);
      const user = res.data.data.user;

      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      setError("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-yellow-100 via-orange-200 to-orange-200 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Đăng nhập</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-gray-600 mb-1 font-medium">Email</label>
            <input
              type="text"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 ${
                errors.email ? "border-red-500 focus:ring-red-300" : "focus:ring-orange-400"
              }`}
              placeholder="email@gmail.com"
              id="email"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Mật khẩu */}
          <div className="relative">
            <label htmlFor="password" className="block text-gray-600 mb-1 font-medium">Mật khẩu</label>
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

          <button type="submit" className="w-full py-2 rounded-xl bg-orange-400 hover:bg-orange-600 text-white font-semibold transition">
            Đăng nhập
          </button>
        </form>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-gray-400 text-sm">hoặc</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 border py-2 rounded-xl hover:bg-gray-50 transition"
        >
          <FcGoogle className="text-2xl" />
          <span className="font-medium text-gray-600">Tiếp tục với Google</span>
        </button>

        <p className="mt-6 text-sm text-center text-gray-500">
          Chưa có tài khoản?
          <Link to="/register" className="text-orange-500 hover:underline ml-1">Đăng ký</Link>
        </p>
        <p className="mt-2 text-sm text-center text-gray-500">
          Quên mật khẩu?
          <Link to="/reset-password" className="text-orange-500 hover:underline ml-1">Khôi phục mật khẩu</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
