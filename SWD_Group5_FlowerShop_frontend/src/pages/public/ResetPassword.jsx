import React, { useState } from "react";
import axios from "../../services/axiosConfig";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
    const [step, setStep] = useState("email"); // email -> otp -> newPassword
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const nav = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await axios.post("/auth/request-reset-password", { email });
            setMessage("Mã OTP đã được gửi về email.");
            setStep("otp");
        } catch (err) {
            setError(err.response?.data?.message || "Gửi mã OTP thất bại.");
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await axios.post("/auth/verify-reset-otp", { email, otp });
            setStep("newPassword");
        } catch (err) {
            setError(err.response?.data?.message || "Mã OTP không hợp lệ.");
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp.");
            return;
        }

        try {
            await axios.post("/auth/reset-password", { email, otp, password });
            setMessage("Đổi mật khẩu thành công. Đang chuyển hướng...");
            setTimeout(() => nav("/login"), 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Đổi mật khẩu thất bại.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-tr from-yellow-100 via-orange-200 to-orange-200 flex justify-center items-center">
            <form
                onSubmit={
                    step === "email"
                        ? handleSendOtp
                        : step === "otp"
                            ? handleVerifyOtp
                            : handleResetPassword
                }
                className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-4 text-center">Đặt lại mật khẩu</h2>

                {message && <p className="text-green-600 mb-2">{message}</p>}
                {error && <p className="text-red-600 mb-2">{error}</p>}

                {step === "email" && (
                    <div>
                        <label className="block mb-1 font-medium">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="email@gmail.com"
                            required
                        />
                    </div>
                )}

                {step === "otp" && (
                    <div>
                        <label className="block mb-1 font-medium">Mã OTP</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Nhập mã OTP"
                            required
                            maxLength={6}
                        />
                    </div>
                )}

                {step === "newPassword" && (
                    <>
                        <div>
                            <label className="block mb-1 font-medium">Mật khẩu mới</label>
                            <input
                                type="password"
                                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <div className="mt-3">
                            <label className="block mb-1 font-medium">Xác nhận mật khẩu</label>
                            <input
                                type="password"
                                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </>
                )}

                <button
                    type="submit"
                    className="mt-4 w-full rounded-xl bg-orange-400 hover:bg-orange-600 text-white font-semibold transition py-2"
                >
                    {step === "email"
                        ? "Gửi mã OTP"
                        : step === "otp"
                            ? "Xác nhận OTP"
                            : "Đổi mật khẩu"}
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;
