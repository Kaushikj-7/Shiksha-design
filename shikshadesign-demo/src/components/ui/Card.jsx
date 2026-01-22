import React from 'react';

const Card = ({ children, className = '', hover = false, ...props }) => {
  return (
    <div 
      className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-6 ${hover ? 'hover:shadow-md transition-shadow duration-200' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
