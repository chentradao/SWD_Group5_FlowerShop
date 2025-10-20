import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc'; // icon Google

function GoogleLoginSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const email = params.get('email');
    const token = params.get('token');

    if (!email || !token) {
      console.error('Thiếu email hoặc token trong URL');
      navigate('/login');
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/users/email/${encodeURIComponent(email)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Không thể lấy thông tin user');
        return res.json();
      })
      .then(data => {
        localStorage.setItem('user', JSON.stringify(data));
        localStorage.setItem('token', token);
        navigate('/');
      })
      .catch(err => {
        console.error('Lỗi khi lấy thông tin user:', err);
        navigate('/login');
      });
  }, [navigate, location.search]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#FFEFD5] text-white">
      {/* Google icon */}
      <FcGoogle className="text-7xl mb-6 animate-bounce" />

      {/* Spinner */}
      <div className="relative w-16 h-16">
        <div className="absolute w-full h-full border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute w-10 h-10 top-3 left-3 border-4 border-yellow-300 border-t-transparent rounded-full animate-spin-slow"></div>
      </div>

      {/* Text */}
      <p className="mt-8 text-xl font-semibold animate-pulse">
        Đang đăng nhập bằng Google...
      </p>

      {/* Sub text */}
      <p className="mt-2 text-sm opacity-80">
        Vui lòng chờ trong giây lát
      </p>
    </div>
  );
}

export default GoogleLoginSuccess;