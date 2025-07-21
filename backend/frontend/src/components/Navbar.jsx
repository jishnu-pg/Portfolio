import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';

export default function Navbar() {
  const { t } = useTranslation();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navLinks = [
    { name: t('nav.home'), to: '/' },
    { name: t('nav.about'), to: '/about' },
    { name: t('nav.projects'), to: '/projects' },
    { name: t('nav.skills'), to: '/skills' },
    { name: t('nav.blog'), to: '/blog' },
    { name: t('nav.contact'), to: '/contact' },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-700">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-4 md:px-10 py-4 md:py-6">
        {/* Logo */}
        <Link 
          to="/" 
          className="hover:scale-105 transition-transform duration-200 z-50" 
          aria-label="Home"
          onClick={closeMenu}
        >
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium ${
                  isActive ? 'text-blue-600 dark:text-blue-400' : ''
                }`
              }
              aria-current={location.pathname === link.to ? 'page' : undefined}
            >
              {link.name}
            </NavLink>
          ))}
          <Link
            to="/admin/login"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
          >
            {t('nav.admin')}
          </Link>
          
          {/* Language Toggle */}
          <div className="ml-2">
            <LanguageToggle />
          </div>
          
          {/* Theme Toggle */}
          <div className="ml-2">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          {/* Language Toggle for Mobile */}
          <LanguageToggle />
          
          {/* Theme Toggle for Mobile */}
          <ThemeToggle />
          
          {/* Hamburger Menu Button */}
          <button
            onClick={toggleMenu}
            className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={t('accessibility.menuToggle')}
            aria-expanded={isMenuOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={closeMenu}>
            <div className="fixed inset-y-0 right-0 w-64 bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out">
              <div className="flex flex-col h-full">
                {/* Mobile Menu Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {t('nav.menu')}
                  </span>
                  <button
                    onClick={closeMenu}
                    className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                    aria-label={t('accessibility.closeMenu')}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Mobile Navigation Links */}
                <nav className="flex-1 px-4 py-6 space-y-4">
                  {navLinks.map(link => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      end={link.to === '/'}
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        `block py-3 px-4 rounded-lg text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors duration-200 font-medium ${
                          isActive ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-800' : ''
                        }`
                      }
                      aria-current={location.pathname === link.to ? 'page' : undefined}
                    >
                      {link.name}
                    </NavLink>
                  ))}
                  <Link
                    to="/admin/login"
                    onClick={closeMenu}
                    className="block py-3 px-4 rounded-lg text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors duration-200 font-medium"
                  >
                    {t('nav.admin')}
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 