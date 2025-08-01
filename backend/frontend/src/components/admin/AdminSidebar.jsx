import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '../Logo';
import {
  LayoutDashboard, Rocket, FileText, Zap, Briefcase, File, Star, Mail, LogOut, Menu, ChevronLeft, ChevronRight
} from 'lucide-react';
import ThemeToggleAdmin from './ThemeToggleAdmin';

const AdminSidebar = ({ onLogout, collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: LayoutDashboard,
      color: 'text-blue-500'
    },
    {
      name: 'Projects',
      path: '/admin/projects',
      icon: Rocket,
      color: 'text-purple-500'
    },
    {
      name: 'Blog Posts',
      path: '/admin/blogs',
      icon: FileText,
      color: 'text-green-500'
    },
    {
      name: 'Skills',
      path: '/admin/skills',
      icon: Zap,
      color: 'text-yellow-500'
    },
    {
      name: 'Experience',
      path: '/admin/experience',
      icon: Briefcase,
      color: 'text-orange-500'
    },
    {
      name: 'Resumes',
      path: '/admin/resumes',
      icon: File,
      color: 'text-indigo-500'
    },
    {
      name: 'Testimonials',
      path: '/admin/testimonials',
      icon: Star,
      color: 'text-pink-500'
    },
    {
      name: 'Messages',
      path: '/admin/messages',
      icon: Mail,
      color: 'text-red-500'
    }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`h-screen fixed left-0 top-0 z-40 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className={`flex items-center justify-between px-6 py-6 border-b border-gray-100 dark:border-gray-800 ${collapsed ? 'justify-center' : ''}`}>
        {!collapsed && <span className="text-lg text-gray-700 dark:text-gray-200 font-bold tracking-wide">Admin</span>}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 focus:outline-none"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
      <nav className="mt-4 flex-1 flex flex-col">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 group
                    ${isActive(item.path)
                      ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-semibold'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-200'}
                  `}
                >
                  <Icon className={`w-5 h-5 ${item.color} ${isActive(item.path) ? 'opacity-100' : 'opacity-70'} group-hover:opacity-100 transition-opacity`} />
                  {!collapsed && <span className="truncate text-sm">{item.name}</span>}
                  {isActive(item.path) && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-200" />}
                </button>
              </li>
            );
          })}
        </ul>
        <div className="flex-1" />
        <div className={`px-2 pb-4 pt-2 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-3 ${collapsed ? 'items-center' : ''}`}>
          <ThemeToggleAdmin collapsed={collapsed} />
          <a
            href="http://127.0.0.1:8000/admin/"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors shadow-sm ${collapsed ? 'justify-center' : ''}`}
            style={{ minWidth: collapsed ? 0 : 120, justifyContent: collapsed ? 'center' : 'flex-start' }}
          >
            <FileText className="w-4 h-4" />
            {!collapsed && <span>Django Admin</span>}
          </a>
          <button
            onClick={onLogout}
            className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-800 transition-colors shadow-sm ${collapsed ? 'justify-center' : ''}`}
            style={{ minWidth: collapsed ? 0 : 120, justifyContent: collapsed ? 'center' : 'flex-start' }}
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </nav>
    </div>
  );
};

export default AdminSidebar; 