import React from 'react';

const CloudUI: React.FC = () => {
  return (
    <iframe
      src="https://cloud.cherryon.art/"
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

export default CloudUI;
