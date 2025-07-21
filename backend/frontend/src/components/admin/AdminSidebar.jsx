import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '../Logo';

const AdminSidebar = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: '📊',
      color: 'text-blue-600'
    },
    {
      name: 'Projects',
      path: '/admin/projects',
      icon: '🚀',
      color: 'text-blue-600'
    },
    {
      name: 'Blog Posts',
      path: '/admin/blogs',
      icon: '📝',
      color: 'text-green-600'
    },
    {
      name: 'Skills',
      path: '/admin/skills',
      icon: '⚡',
      color: 'text-purple-600'
    },
    {
      name: 'Experience',
      path: '/admin/experience',
      icon: '💼',
      color: 'text-orange-600'
    },
    {
      name: 'Resumes',
      path: '/admin/resumes',
      icon: '📄',
      color: 'text-indigo-600'
    },
    {
      name: 'Testimonials',
      path: '/admin/testimonials',
      icon: '⭐',
      color: 'text-yellow-600'
    },
    {
      name: 'Messages',
      path: '/admin/messages',
      icon: '📧',
      color: 'text-red-600'
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 z-40">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Logo />
          <span className="text-sm text-gray-500">Admin</span>
        </div>
      </div>

      <nav className="mt-6">
        <div className="px-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <a
              href="http://127.0.0.1:8000/admin/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              Django Admin
            </a>
            <button
              onClick={onLogout}
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default AdminSidebar; 