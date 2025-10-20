import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setIsLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login'; // hoặc navigate('/login')
  };

  const isAuthenticated = !!user;

  const getRoleBasedRoute = () => {
    if (!user?.role) return '/';
    switch (user.role.toLowerCase()) {
      case 'admin':
        return '/admin-dashboard/books';
      case 'user':
        return '/';
      default:
        return '/';
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, logout, getRoleBasedRoute, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
