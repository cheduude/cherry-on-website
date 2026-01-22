import React from 'react';

const PanelUI: React.FC = () => {
  return (
    <iframe
      src="https://service.cherryon.art/auth/login"
      title="CherryOn Cloud"
      style={{
        width: '100%',
        height: '100%',
        border: 'none'
      }}
      sandbox="allow-scripts allow-forms allow-same-origin"
    />
  );
};

export default PanelUI;
