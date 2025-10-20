import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../services/axiosConfig";
import { FiEye, FiEyeOff } from "react-icons/fi";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      return setError("Vui lòng nhập đầy đủ thông tin.");
    }
    if (form.newPassword !== form.confirmPassword) {
      return setError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
    }
    if (form.newPassword.length < 6) {
      return setError("Mật khẩu phải có ít nhất 6 ký tự.");
    }

    try {
      await axios.post("/auth/change-password", {
        userId: user.id,
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      });
      setSuccess("Đổi mật khẩu thành công! Đang chuyển hướng...");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#FFEFD5] px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
          Đổi mật khẩu
        </h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-600 mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Mật khẩu hiện tại */}
          <div className="relative">
            <label htmlFor="currentPassword" className="block text-gray-600 mb-1 font-medium">
              Mật khẩu hiện tại
            </label>
            <input
              type={showCurrentPassword ? "text" : "password"}
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 pr-10"
              placeholder="Nhập mật khẩu hiện tại"
              id="currentPassword"
            />
            <div
              className="absolute right-3 top-[40px] cursor-pointer text-gray-500"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
            </div>
          </div>

          {/* Mật khẩu mới */}
          <div className="relative">
            <label htmlFor="newPassword" className="block text-gray-600 mb-1 font-medium">
              Mật khẩu mới
            </label>
            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 pr-10"
              placeholder="Nhập mật khẩu mới"
              id="newPassword"
            />
            <div
              className="absolute right-3 top-[40px] cursor-pointer text-gray-500"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <FiEyeOff /> : <FiEye />}
            </div>
          </div>

          {/* Xác nhận mật khẩu mới */}
          <div className="relative">
            <label htmlFor="confirmPassword" className="block text-gray-600 mb-1 font-medium">
              Xác nhận mật khẩu mới
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 pr-10"
              placeholder="Nhập lại mật khẩu mới"
              id="confirmPassword"
            />
            <div
              className="absolute right-3 top-[40px] cursor-pointer text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-400 text-white font-semibold py-2 rounded-xl hover:bg-orange-600 transition"
          >
            Đổi mật khẩu
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
