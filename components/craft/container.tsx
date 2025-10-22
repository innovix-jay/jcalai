import { useNode } from '@craftjs/core';
import React from 'react';

export interface ContainerProps {
  children?: React.ReactNode;
  className?: string;
  background?: string;
  padding?: number;
}

export const Container = ({ children, className = '', background = 'transparent', padding = 4 }: ContainerProps) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <div
      ref={(ref) => connect(drag(ref!))}
      className={className}
      style={{
        background,
        padding: `${padding * 0.25}rem`,
        minHeight: '50px',
      }}
    >
      {children}
    </div>
  );
};

Container.craft = {
  displayName: 'Container',
  props: {
    className: 'container',
    background: 'transparent',
    padding: 4,
  },
  related: {
    toolbar: () => <div>Container Settings</div>,
  },
};


