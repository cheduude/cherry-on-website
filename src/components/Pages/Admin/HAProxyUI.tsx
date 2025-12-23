import React from 'react';

const HAProxyUI: React.FC = () => {
  return (
    <iframe
      src="https://rx.cherryon.art/"
      title="HAProxy Admin"
      style={{
        width: '100%',
        height: '100%',
        border: 'none'
      }}
      sandbox="allow-scripts allow-forms allow-same-origin"
    />
  );
};

export default HAProxyUI;
