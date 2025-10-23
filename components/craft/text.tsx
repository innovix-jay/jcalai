import { useNode } from '@craftjs/core';
import React, { useState } from 'react';
import ContentEditable from 'react-contenteditable';

export interface TextProps {
  text?: string;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  textAlign?: 'left' | 'center' | 'right';
  className?: string;
}

export const Text = ({
  text = 'Text',
  fontSize = 16,
  fontWeight = 400,
  color = '#000000',
  textAlign = 'left',
  className = '',
}: TextProps) => {
  const {
    connectors: { connect, drag },
    actions: { setProp },
  } = useNode();

  const [editable, setEditable] = useState(false);

  return (
    <div
      ref={(ref) => {
        if (ref) connect(drag(ref));
      }}
      onClick={() => setEditable(true)}
      onBlur={() => setEditable(false)}
    >
      <ContentEditable
        html={text}
        disabled={!editable}
        onChange={(e) => {
          setProp((props: TextProps) => (props.text = e.target.value), 500);
        }}
        tagName="p"
        className={className}
        style={{
          fontSize: `${fontSize}px`,
          fontWeight,
          color,
          textAlign,
          cursor: editable ? 'text' : 'pointer',
        }}
      />
    </div>
  );
};

Text.craft = {
  displayName: 'Text',
  props: {
    text: 'Text',
    fontSize: 16,
    fontWeight: 400,
    color: '#000000',
    textAlign: 'left',
  },
  related: {
    toolbar: () => <div>Text Settings</div>,
  },
};


