import { useNode } from '@craftjs/core';
import React from 'react';

export interface ButtonProps {
  text?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Button = ({ 
  text = 'Button', 
  variant = 'primary',
  size = 'md',
  className = '' 
}: ButtonProps) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      ref={(ref) => {
        if (ref) connect(drag(ref));
      }}
      className={`rounded-lg font-medium transition-colors ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {text}
    </button>
  );
};

Button.craft = {
  displayName: 'Button',
  props: {
    text: 'Button',
    variant: 'primary',
    size: 'md',
  },
  related: {
    toolbar: () => <div>Button Settings</div>,
  },
};


