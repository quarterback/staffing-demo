import { useState } from "react";

interface NautilusLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function NautilusLogo({ size = 'md', showText = true, className = '' }: NautilusLogoProps) {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div 
      className={`flex items-center space-x-2 transition-all duration-200 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-blue-500 to-teal-600 rounded-lg flex items-center justify-center relative overflow-hidden transform transition-transform duration-200 ${isHovered ? 'scale-105' : ''}`}>
        {/* Nautilus shell spiral */}
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          className="w-3/4 h-3/4 text-white"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer shell */}
          <path 
            d="M12 2C17.5 2 22 6.5 22 12C22 17.5 17.5 22 12 22C6.5 22 2 17.5 2 12C2 6.5 6.5 2 12 2Z" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            fill="none"
          />
          {/* Inner spiral chambers */}
          <path 
            d="M12 5C15.3 5 18 7.7 18 11C18 14.3 15.3 17 12 17C8.7 17 6 14.3 6 11C6 7.7 8.7 5 12 5Z" 
            stroke="currentColor" 
            strokeWidth="1.2" 
            fill="none"
            opacity="0.8"
          />
          <path 
            d="M12 8C13.7 8 15 9.3 15 11C15 12.7 13.7 14 12 14C10.3 14 9 12.7 9 11C9 9.3 10.3 8 12 8Z" 
            stroke="currentColor" 
            strokeWidth="1" 
            fill="none"
            opacity="0.6"
          />
          {/* Center dot */}
          <circle cx="12" cy="11" r="2" fill="currentColor" opacity="0.4" />
        </svg>
        
        {/* Subtle shimmer effect on hover */}
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse" />
        )}
      </div>
      
      {/* Text */}
      {showText && (
        <span className={`font-semibold text-gray-900 ${textSizeClasses[size]} transition-colors duration-200 ${isHovered ? 'text-blue-600' : ''}`}>
          Nautilus
        </span>
      )}
    </div>
  );
}