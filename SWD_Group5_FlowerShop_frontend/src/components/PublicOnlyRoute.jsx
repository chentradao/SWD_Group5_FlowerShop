import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PublicOnlyRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      const role = user.role?.toLowerCase();
      const target = role === 'admin' ? '/admin-dashboard/books' : '/';
      navigate(target, { replace: true });
      window.location.reload();
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return !user ? children : null;
};

export default PublicOnlyRoute;
