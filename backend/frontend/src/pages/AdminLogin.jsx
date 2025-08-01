import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Logo from '../components/Logo';
import { setTokens } from '../utils/auth';
import api from '../utils/axios';
import { ThemeProvider } from '../context/ThemeContext';

const AdminLogin = () => {
  const { t } = useTranslation();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [animateError, setAnimateError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/token/', credentials);
      setTokens(response.data.access, response.data.refresh);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
      setAnimateError(true);
      setTimeout(() => setAnimateError(false), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
        {/* Animated SVG/Blob Illustration Left */}
        <div className="hidden md:flex w-1/2 items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 z-0 pointer-events-none select-none">
            <svg className="absolute top-[-80px] left-[-80px] w-[500px] h-[500px] opacity-40 animate-spin-slow" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="250" cy="250" rx="250" ry="250" fill="url(#blob1)" />
              <defs>
                <radialGradient id="blob1" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
                  <stop offset="0%" stopColor="#a5b4fc" />
                  <stop offset="100%" stopColor="#6366f1" />
                </radialGradient>
              </defs>
            </svg>
            <svg className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] opacity-30 animate-spin-reverse" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="200" cy="200" rx="200" ry="200" fill="url(#blob2)" />
              <defs>
                <radialGradient id="blob2" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a5b4fc" />
                </radialGradient>
              </defs>
            </svg>
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-10">
            <Logo className="text-6xl mb-6" />
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 mb-2">Welcome Back, Admin!</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md text-center mb-8">Manage your portfolio, projects, and more with a beautiful, secure dashboard. Please sign in to continue.</p>
            <img src="/src/assets/login-illustration.svg" alt="Admin Illustration" className="w-72 h-72 object-contain drop-shadow-xl" onError={e => e.target.style.display='none'} />
          </div>
        </div>
        {/* Login Card Right */}
        <div className="flex flex-1 items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Floating gradient ring behind card */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-blue-400 via-purple-400 to-indigo-400 opacity-30 rounded-full blur-3xl animate-fade-in pointer-events-none" />
          <div className="w-full max-w-md mx-auto bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/40 dark:border-gray-800/70 p-10 flex flex-col items-center relative overflow-hidden animate-fade-in">
            {/* Avatar with shadow */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 flex items-center justify-center shadow-xl mb-6 border-4 border-white dark:border-gray-900 relative z-10">
              <img src="/src/assets/profile.png" alt="Admin Avatar" className="w-16 h-16 rounded-full object-cover" onError={e => e.target.style.display='none'} />
            </div>
            <Logo className="text-4xl md:text-5xl mb-2 z-10" />
            <span className="text-lg text-gray-500 dark:text-gray-300 font-medium tracking-wide mb-2 z-10">Admin Portal</span>
            <h1 className="text-2xl font-extrabold text-center bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-1 z-10">{t('admin.login')}</h1>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-6 z-10">{t('admin.welcome')}</p>
            {/* Error Message */}
            {error && (
              <div className={`bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl mb-4 backdrop-blur-sm transform transition-all duration-300 ${animateError ? 'scale-105' : 'scale-100'} z-10`}> 
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </div>
            )}
            {/* Login Form */}
            <form className="w-full space-y-7 z-10" onSubmit={handleSubmit} autoComplete="off">
              <div className="relative">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={credentials.username}
                  onChange={handleChange}
                  className="peer w-full px-5 pt-7 pb-3 border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 focus:border-blue-400 dark:focus:border-blue-500 shadow-md transition-all duration-200"
                  placeholder="Username"
                />
                <label htmlFor="username" className="absolute left-5 top-2 text-gray-500 dark:text-gray-400 text-base font-semibold pointer-events-none transition-all duration-200 peer-placeholder-shown:top-5 peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-400 dark:peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-base peer-focus:text-blue-600 dark:peer-focus:text-blue-400">
                  {t('admin.username')}
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={credentials.password}
                  onChange={handleChange}
                  className="peer w-full px-5 pt-7 pb-3 border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 focus:border-blue-400 dark:focus:border-blue-500 shadow-md transition-all duration-200"
                  placeholder="Password"
                />
                <label htmlFor="password" className="absolute left-5 top-2 text-gray-500 dark:text-gray-400 text-base font-semibold pointer-events-none transition-all duration-200 peer-placeholder-shown:top-5 peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-400 dark:peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-base peer-focus:text-blue-600 dark:peer-focus:text-blue-400">
                  {t('admin.password')}
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors duration-200"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center">
                  <input id="remember" name="remember" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  <label htmlFor="remember" className="ml-2 block text-sm text-gray-600 dark:text-gray-300">Remember me</label>
                </div>
                <button type="button" className="text-sm text-blue-600 dark:text-blue-400 hover:underline focus:outline-none">Forgot password?</button>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-6 border-none rounded-2xl shadow-xl text-base font-semibold text-white bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 mt-2"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    {t('admin.signingIn')}...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    {t('admin.loginButton')}
                  </div>
                )}
              </button>
            </form>
            {/* Footer */}
            <div className="mt-10 text-center w-full z-10">
              <p className="text-xs text-gray-400 dark:text-gray-500">&copy; {new Date().getFullYear()} Portfolio Admin. All rights reserved.</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Secure access for authorized users only.</p>
            </div>
            {/* Decorative blurred gradient ring in card corner */}
            <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-gradient-to-br from-blue-400 via-purple-400 to-indigo-400 opacity-30 rounded-full blur-2xl pointer-events-none" />
          </div>
        </div>
        {/* Custom Animations */}
        <style>{`
          .animate-spin-slow { animation: spin 18s linear infinite; }
          .animate-spin-reverse { animation: spin 22s linear reverse infinite; }
          .animate-fade-in { animation: fadeIn 0.8s cubic-bezier(0.4,0,0.2,1) both; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(40px);} to { opacity: 1; transform: none; } }
        `}</style>
      </div>
    </ThemeProvider>
  );
};

export default AdminLogin; 