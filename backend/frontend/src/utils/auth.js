// Authentication utility functions
import { useState, useEffect } from 'react';

export const getToken = () => {
  return localStorage.getItem('adminToken');
};

export const getRefreshToken = () => {
  return localStorage.getItem('adminRefreshToken');
};

export const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem('adminToken', accessToken);
  localStorage.setItem('adminRefreshToken', refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminRefreshToken');
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;
  
  // Check if token is expired (basic check)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp > currentTime;
  } catch (error) {
    return false;
  }
};

export const handleUnauthorized = () => {
  clearTokens();
  window.location.href = '/unauthorized';
};

export const handleLogout = () => {
  clearTokens();
  window.location.href = '/admin/login';
};

// React hook for authentication
export const useAuth = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsAuth(authenticated);
      setLoading(false);
    };

    checkAuth();

    // Listen for storage changes (when tokens are updated)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = (accessToken, refreshToken) => {
    setTokens(accessToken, refreshToken);
    setIsAuth(true);
  };

  const logout = () => {
    handleLogout();
    setIsAuth(false);
  };

  return {
    isAuthenticated: isAuth,
    loading,
    login,
    logout,
    getToken,
    getRefreshToken,
    clearTokens,
    handleUnauthorized
  };
};

// API request helper with authentication
export const apiRequest = async (url, options = {}) => {
  const token = getToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    
    if (response.status === 401) {
      handleUnauthorized();
      return null;
    }
    
    return response;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}; 