import React from 'react';

const Logo = ({ className = "" }) => {
  return (
    <div className={`font-bold text-2xl md:text-3xl ${className}`}>
              <span 
          className="bg-gradient-to-r from-blue-500 via-blue-400 to-purple-600 bg-clip-text text-transparent"
        >
          Jishnu
        </span>
    </div>
  );
};

export default Logo; 