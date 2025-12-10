import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass';
  onClick?: () => void;
}

export function Card({ children, className = '', variant = 'glass', onClick }: CardProps) {
  const baseClasses = 'rounded-2xl p-6';
  const variantClasses = {
    default: 'bg-white shadow-xl border border-gray-200',
    glass: 'glass-effect',
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
