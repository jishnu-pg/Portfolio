import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles } from 'lucide-react';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';

export default function Navbar() {
  const { t } = useTranslation();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const navLinks = [
    { name: t('nav.home'), to: '/', icon: '🏠' },
    { name: t('nav.about'), to: '/about', icon: '👤' },
    { name: t('nav.projects'), to: '/projects', icon: '💼' },
    { name: t('nav.skills'), to: '/skills', icon: '⚡' },
    { name: t('nav.blog'), to: '/blog', icon: '📝' },
    { name: t('nav.contact'), to: '/contact', icon: '📧' },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/30 shadow-lg' 
          : 'bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border-b border-white/10 dark:border-gray-700/20'
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link 
            to="/" 
            className="flex items-center gap-2 group" 
            aria-label="Home"
            onClick={closeMenu}
          >
            <div className="relative">
              <Logo />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="hidden sm:flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Portfolio
              </span>
            </div>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-1">
          {navLinks.map((link, index) => (
            <motion.div
              key={link.to}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `relative flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 group ${
                    isActive 
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 shadow-md' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-gray-800/50'
                  }`
                }
                aria-current={location.pathname === link.to ? 'page' : undefined}
              >
                <span className="text-sm">{link.icon}</span>
                <span>{link.name}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </NavLink>
            </motion.div>
          ))}
          
          {/* Admin Link */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link
              to="/admin/login"
              className="relative flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-300 group"
            >
              <span className="text-sm">🔐</span>
              <span>{t('nav.admin')}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </motion.div>
          
          {/* Controls */}
          <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-200 dark:border-gray-700">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <LanguageToggle />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <ThemeToggle />
            </motion.div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center gap-3">
          {/* Language Toggle for Mobile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <LanguageToggle />
          </motion.div>
          
          {/* Theme Toggle for Mobile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <ThemeToggle />
          </motion.div>
          
          {/* Hamburger Menu Button */}
          <motion.button
            onClick={toggleMenu}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 rounded-xl text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            aria-label={t('accessibility.menuToggle')}
            aria-expanded={isMenuOpen}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={closeMenu}
            >
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 right-0 w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl border-l border-white/20 dark:border-gray-700/30"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-col h-full">
                  {/* Mobile Menu Header */}
                  <div className="flex justify-between items-center p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex items-center gap-3">
                      <Logo />
                      <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Menu
                      </span>
                    </div>
                    <motion.button
                      onClick={closeMenu}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-xl text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-300"
                      aria-label={t('accessibility.closeMenu')}
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  </div>

                  {/* Mobile Navigation Links */}
                  <nav className="flex-1 px-6 py-8 space-y-2">
                    {navLinks.map((link, index) => (
                      <motion.div
                        key={link.to}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <NavLink
                          to={link.to}
                          end={link.to === '/'}
                          onClick={closeMenu}
                          className={({ isActive }) =>
                            `flex items-center gap-3 py-4 px-4 rounded-xl font-medium transition-all duration-300 group ${
                              isActive 
                                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 shadow-md' 
                                : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-gray-800/50'
                            }`
                          }
                          aria-current={location.pathname === link.to ? 'page' : undefined}
                        >
                          <span className="text-lg">{link.icon}</span>
                          <span>{link.name}</span>
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </NavLink>
                      </motion.div>
                    ))}
                    
                    {/* Admin Link */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.6 }}
                    >
                      <Link
                        to="/admin/login"
                        onClick={closeMenu}
                        className="flex items-center gap-3 py-4 px-4 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-300 group"
                      >
                        <span className="text-lg">🔐</span>
                        <span>{t('nav.admin')}</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </Link>
                    </motion.div>
                  </nav>

                  {/* Mobile Menu Footer */}
                  <div className="p-6 border-t border-gray-200/50 dark:border-gray-700/50">
                    <div className="text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Built with ❤️ by Jishnu
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
} 