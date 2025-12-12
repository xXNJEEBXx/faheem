import React, { useState, useEffect } from 'react';

const FaheemAvatar = ({ state = 'idle', size = 'md', className = '' }) => {
  const [currentImage, setCurrentImage] = useState('/assets/images/idle.png');

  useEffect(() => {
    switch (state) {
      case 'thinking':
        setCurrentImage('/assets/images/thinking.png');
        break;
      case 'wink':
        setCurrentImage('/assets/images/wink.png');
        break;
      default:
        setCurrentImage('/assets/images/idle.png');
    }
  }, [state]);

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-24 h-24',
    lg: 'w-48 h-48',
    xl: 'w-64 h-64'
  };

  return (
    <div className={`relative ${className}`}>
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-4 border-absher-green shadow-lg bg-white transition-all duration-300`}>
        <img 
          src={currentImage} 
          alt="Faheem Avatar" 
          className="w-full h-full object-cover"
        />
      </div>
      {state === 'thinking' && (
        <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md animate-bounce">
          <span className="text-2xl">🤔</span>
        </div>
      )}
    </div>
  );
};

export default FaheemAvatar;
