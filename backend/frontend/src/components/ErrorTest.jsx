import React from 'react';
import { Link } from 'react-router-dom';

const ErrorTest = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Error Page Testing</h1>
        
        <div className="space-y-4">
          <Link
            to="/nonexistent-page"
            className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Test 404 Page
          </Link>
          
          <Link
            to="/unauthorized"
            className="block w-full bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Test Unauthorized Page
          </Link>
          
          <Link
            to="/admin/dashboard"
            className="block w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Test Protected Route (will redirect to unauthorized if not logged in)
          </Link>
          
          <Link
            to="/"
            className="block w-full bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorTest; 