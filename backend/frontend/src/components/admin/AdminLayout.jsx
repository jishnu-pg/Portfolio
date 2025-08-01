import React, { useState, createContext, useContext, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import { ThemeProvider } from '../../context/ThemeContext';
import { clearTokens } from '../../utils/auth';

// Context to allow sidebar toggle from children if needed
const AdminSidebarContext = createContext();
export const useAdminSidebar = () => useContext(AdminSidebarContext);

const SIDEBAR_WIDTH = 256; // w-64
const SIDEBAR_COLLAPSED = 64; // w-16

const AdminLayout = ({ children, onLogout }) => {
  // Persist collapsed state in localStorage
  const [collapsed, setCollapsed] = useState(() => {
    const stored = localStorage.getItem('adminSidebarCollapsed');
    return stored === 'true';
  });

  useEffect(() => {
    localStorage.setItem('adminSidebarCollapsed', collapsed);
  }, [collapsed]);

  // Default logout handler if not provided
  const handleLogout = onLogout || (() => {
    clearTokens();
    window.location.href = '/admin/login';
  });

  return (
    <ThemeProvider>
      <AdminSidebarContext.Provider value={{ collapsed, setCollapsed }}>
        {/* Modern font for admin backend */}
        <div className="min-h-screen bg-white dark:bg-gray-900 font-sans" style={{ fontFamily: 'Nunito, system-ui, sans-serif' }}>
          {/* Google Fonts import for Nunito */}
          <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet" />
          <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} onLogout={handleLogout} />
          <main
            className="transition-all duration-300"
            style={{
              marginLeft: collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_WIDTH,
              minHeight: '100vh',
            }}
          >
            {children}
          </main>
        </div>
      </AdminSidebarContext.Provider>
    </ThemeProvider>
  );
};

export default AdminLayout; 