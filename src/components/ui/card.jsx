// src/components/ui/card.jsx
import React from 'react';

export function Card({ className = '', variant = 'default', hover = true, ...props }) {
  const variantClasses = {
    default: 'border-gray-200 bg-white shadow',
    primary: 'border-[#497D74] bg-white shadow',
    filled: 'border-transparent bg-[#f2f9f7]',
    elevated: 'border-gray-100 bg-white shadow-md'
  };

  const hoverEffect = hover ? 'hover:shadow-md hover:translate-y-[-2px]' : '';

  return (
    <div
      className={`rounded-xl border transition-all duration-300 ${variantClasses[variant]} ${hoverEffect} ${className}`}
      {...props}
    />
  );
}

export function CardHeader({ className = '', separator = false, ...props }) {
  return (
    <div
      className={`flex flex-col space-y-1.5 p-6 ${separator ? 'border-b border-gray-100 pb-3' : ''} ${className}`}
      {...props}
    />
  );
}

export function CardTitle({ className = '', size = 'default', color = 'default', ...props }) {
  const sizeClasses = {
    small: 'text-base',
    default: 'text-lg',
    large: 'text-xl'
  };

  const colorClasses = {
    default: 'text-gray-900',
    primary: 'text-[#497D74]',
    secondary: 'text-gray-600'
  };

  return (
    <h3
      className={`font-bold leading-tight ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      {...props}
    />
  );
}

export function CardDescription({ className = '', ...props }) {
  return (
    <p
      className={`text-sm text-gray-500 leading-relaxed mt-1 ${className}`}
      {...props}
    />
  );
}

export function CardContent({ className = '', noPadding = false, ...props }) {
  return (
    <div
      className={`${noPadding ? 'p-0' : 'px-6 pb-6 pt-0'} ${className}`}
      {...props}
    />
  );
}

export function CardFooter({ className = '', separator = false, ...props }) {
  return (
    <div
      className={`flex items-center justify-between px-6 pb-6 pt-0 ${separator ? 'border-t border-gray-100 mt-2 pt-4' : ''
        } ${className}`}
      {...props}
    />
  );
}

export function CardAction({ className = '', ...props }) {
  return (
    <div
      className={`absolute top-3 right-3 z-10 ${className}`}
      {...props}
    />
  );
}

export function CardImage({ src, alt = "", className = "", ...props }) {
  return (
    <div className="w-full overflow-hidden rounded-t-xl">
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${className}`}
        {...props}
      />
    </div>
  );
}