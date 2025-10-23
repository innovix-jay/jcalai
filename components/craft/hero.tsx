import { useNode } from '@craftjs/core';
import React from 'react';

export interface HeroProps {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  className?: string;
}

export const Hero = ({
  title = 'Welcome to Your App',
  subtitle = 'Build amazing things with JCAL.ai',
  backgroundImage = '',
  backgroundColor = '#f3f4f6',
  className = '',
}: HeroProps) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <div
      ref={(ref) => {
        if (ref) connect(drag(ref));
      }}
      className={`relative py-20 px-4 ${className}`}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundColor: backgroundImage ? 'transparent' : backgroundColor,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">{title}</h1>
        <p className="text-xl text-gray-600">{subtitle}</p>
      </div>
    </div>
  );
};

Hero.craft = {
  displayName: 'Hero',
  props: {
    title: 'Welcome to Your App',
    subtitle: 'Build amazing things with JCAL.ai',
    backgroundImage: '',
    backgroundColor: '#f3f4f6',
  },
  related: {
    toolbar: () => <div>Hero Settings</div>,
  },
};


