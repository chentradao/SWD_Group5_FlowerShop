import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Homepage from '../pages/public/HomePage';

const RoleBasedHome = () => {
  const { isLoading } = useAuth();
  const navigate = useNavigate();
  const [redirected, setRedirected] = useState(false);

  const [user] = useState(() => {
    const cached = localStorage.getItem("user");
    return cached ? JSON.parse(cached) : null;
  });

  useEffect(() => {
    if (!isLoading && user?.role) {
      const role = user.role.toLowerCase();
      if (role === 'admin') {
        navigate('/admin-dashboard', { replace: true });
        setRedirected(true);
      } else if (role === 'vendor') {
        navigate('/vendor-dashboard/orders', { replace: true });
        setRedirected(true);
      }
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Nếu không có user hoặc user role là 'user', vẫn hiển thị Homepage
  if (!user || user.role?.toLowerCase() === 'user') {
    return <Homepage />;
  }

  // Nếu đã redirect thì không render gì nữa
  return null;
};

export default RoleBasedHome;