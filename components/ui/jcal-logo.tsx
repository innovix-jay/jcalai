import React from 'react';

interface JCALLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export function JCALLogo({ className = '', size = 'md', showText = true }: JCALLogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* JCAL.ai Logo Symbol */}
      <div className={`${sizeClasses[size]} relative`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="jcal-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
          
          {/* Abstract intertwined symbol */}
          <path
            d="M20 30 Q30 20, 40 30 Q50 40, 60 30 Q70 20, 80 30 Q85 35, 80 40 Q70 50, 60 40 Q50 30, 40 40 Q30 50, 20 40 Q15 35, 20 30 Z"
            fill="url(#jcal-gradient)"
            stroke="url(#jcal-gradient)"
            strokeWidth="2"
            className="drop-shadow-sm"
          />
          
          {/* Inner accent */}
          <path
            d="M30 35 Q40 30, 50 35 Q60 40, 70 35 Q72 37, 70 39 Q60 44, 50 39 Q40 34, 30 39 Q28 37, 30 35 Z"
            fill="rgba(255,255,255,0.2)"
          />
        </svg>
      </div>
      
      {/* JCAL.ai Text */}
      {showText && (
        <div className={`font-bold ${textSizeClasses[size]} bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 bg-clip-text text-transparent`}>
          JCAL.ai
        </div>
      )}
    </div>
  );
}

export default JCALLogo;

