import React from 'react';

export const Label = ({ children, required, className = '', ...props }) => (
  <label className={`block text-sm font-semibold text-gray-800 mb-2 ${className}`} {...props}>
    {children}
    {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

export const Input = ({ className = '', error, ...props }) => (
  <div className="relative">
    <input
      className={`w-full px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:text-gray-500
        ${error 
          ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50' 
          : 'border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-blue-100 bg-white'
        } ${className}`}
      {...props}
    />
    {error && <p className="mt-1.5 text-sm text-red-600 font-medium">{error}</p>}
  </div>
);

export const Textarea = ({ className = '', error, ...props }) => (
  <div className="relative">
    <textarea
      className={`w-full px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:text-gray-500 resize-y min-h-[120px]
        ${error 
          ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50' 
          : 'border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-blue-100 bg-white'
        } ${className}`}
      {...props}
    />
    {error && <p className="mt-1.5 text-sm text-red-600 font-medium">{error}</p>}
  </div>
);
