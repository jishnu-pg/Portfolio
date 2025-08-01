import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  // Walking avatar animation state
  React.useEffect(() => {
    const interval = setInterval(() => {
      // This effect is no longer needed as the walking avatar is removed.
      // Keeping it here for now, but it will be removed in a subsequent edit.
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Animated Background Text */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        {[...Array(10)].map((_, i) => (
          <span
            key={i}
            className={`absolute text-5xl md:text-7xl font-extrabold opacity-10 whitespace-nowrap animate-float${i % 3} text-red-500`}
            style={{
              top: `${Math.random() * 90}%`,
              left: `${Math.random() * 80}%`,
              animationDuration: `${6 + i % 4}s`,
              animationDelay: `${i * 0.7}s`,
            }}
          >
            You are not authorized
          </span>
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Main 401 Display */}
          <div className="mb-12">
            <div className="relative">
              <h1 className="text-[8rem] md:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 leading-none select-none">
                401
              </h1>
              <div className="absolute inset-0 text-[8rem] md:text-[12rem] font-black text-gray-100 leading-none select-none -z-10">
                401
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Access Denied
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto leading-relaxed">
              Sorry! This area is restricted. You need proper authentication to access this page. 
              Please log in with your credentials.
            </p>
          </div>

          {/* Security Illustration */}
          <div className="mb-12">
            <div className="relative w-40 h-40 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-orange-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                <div className="relative">
                  <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
                </div>
              </div>
              {/* Security Shield Elements */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce flex items-center justify-center">
                <span className="text-xs">🔒</span>
              </div>
              <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-red-400 rounded-full animate-bounce animation-delay-1000 flex items-center justify-center">
                <span className="text-xs">⚠️</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-6 mb-12">
            <Link
              to="/admin/login"
              className="inline-block bg-gradient-to-r from-red-600 to-orange-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-red-700 hover:to-orange-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              🔐 Login to Admin
            </Link>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="flex-1 bg-white border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-full font-medium hover:bg-gray-50 hover:border-red-300 transform hover:scale-105 transition-all duration-300 shadow-md"
              >
                🏠 Go Home
              </Link>
              <Link
                to="/contact"
                className="flex-1 bg-white border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-full font-medium hover:bg-gray-50 hover:border-orange-300 transform hover:scale-105 transition-all duration-300 shadow-md"
              >
                📧 Contact Support
              </Link>
            </div>
          </div>

          {/* Security Info */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mr-3">
                <span className="text-red-600 dark:text-red-400 text-sm">🔒</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">Security Notice</p>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              This area requires administrator privileges. If you believe this is an error, 
              please contact the system administrator.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link to="/" className="text-red-600 hover:text-red-700 hover:underline font-medium transition-colors">
                Home
              </Link>
              <span className="text-gray-300">•</span>
              <Link to="/about" className="text-orange-600 hover:text-orange-700 hover:underline font-medium transition-colors">
                About
              </Link>
              <span className="text-gray-300">•</span>
              <Link to="/projects" className="text-yellow-600 hover:text-yellow-700 hover:underline font-medium transition-colors">
                Projects
              </Link>
              <span className="text-gray-300">•</span>
              <Link to="/contact" className="text-red-600 hover:text-red-700 hover:underline font-medium transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Security Message */}
          <div className="mt-8">
            <p className="text-sm text-gray-400 dark:text-gray-500 italic">
              "Security is not a product, but a process! 🔐"
            </p>
          </div>
        </div>
      </div>

      {/* Keyframes for floating animation */}
      <style>{`
        @keyframes float0 {
          0% { transform: translateY(0); opacity: 0.1; }
          50% { transform: translateY(-30px); opacity: 0.18; }
          100% { transform: translateY(0); opacity: 0.1; }
        }
        @keyframes float1 {
          0% { transform: translateY(0); opacity: 0.1; }
          50% { transform: translateY(30px); opacity: 0.18; }
          100% { transform: translateY(0); opacity: 0.1; }
        }
        @keyframes float2 {
          0% { transform: translateY(0); opacity: 0.1; }
          50% { transform: translateY(-20px); opacity: 0.18; }
          100% { transform: translateY(0); opacity: 0.1; }
        }
        .animate-float0 { animation: float0 7s ease-in-out infinite; }
        .animate-float1 { animation: float1 8s ease-in-out infinite; }
        .animate-float2 { animation: float2 9s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default Unauthorized; 