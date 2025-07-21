import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Main 404 Display */}
          <div className="mb-12">
            <div className="relative">
              <h1 className="text-[12rem] md:text-[16rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 leading-none select-none">
                404
              </h1>
              <div className="absolute inset-0 text-[12rem] md:text-[16rem] font-black text-gray-100 leading-none select-none -z-10">
                404
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Oops! Page Not Found
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto leading-relaxed">
              The page you're looking for seems to have wandered off into the digital wilderness. 
              Don't worry, let's get you back on track!
            </p>
          </div>

          {/* Illustration */}
          <div className="mb-12">
            <div className="relative w-48 h-48 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-bounce"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-yellow-500 rounded-full animate-bounce animation-delay-1000"></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-6 mb-12">
            <Link
              to="/"
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              🏠 Take Me Home
            </Link>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/projects"
                className="flex-1 bg-white border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-full font-medium hover:bg-gray-50 hover:border-blue-300 transform hover:scale-105 transition-all duration-300 shadow-md"
              >
                💼 View Projects
              </Link>
              <Link
                to="/contact"
                className="flex-1 bg-white border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-full font-medium hover:bg-gray-50 hover:border-purple-300 transform hover:scale-105 transition-all duration-300 shadow-md"
              >
                📧 Contact Me
              </Link>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 font-medium">Quick Navigation</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link to="/about" className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors">
                About Me
              </Link>
              <span className="text-gray-300">•</span>
              <Link to="/blog" className="text-purple-600 hover:text-purple-700 hover:underline font-medium transition-colors">
                Blog Posts
              </Link>
              <span className="text-gray-300">•</span>
              <Link to="/projects" className="text-green-600 hover:text-green-700 hover:underline font-medium transition-colors">
                Projects
              </Link>
              <span className="text-gray-300">•</span>
              <Link to="/contact" className="text-pink-600 hover:text-pink-700 hover:underline font-medium transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Fun Message */}
          <div className="mt-8">
            <p className="text-sm text-gray-400 dark:text-gray-500 italic">
              "Not all who wander are lost, but this page definitely is! 🗺️"
            </p>
          </div>
        </div>
      </div>


    </div>
  );
};

export default NotFound; 