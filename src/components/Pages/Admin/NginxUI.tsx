import React from 'react';

const NginxUI: React.FC = () => {
  return (
    <iframe
      src="https://n2g.cherryon.art/#/login"
      title="Nginx Admin"
      style={{
        width: '100%',
        height: '100%',
        border: 'none'
      }}
      sandbox="allow-scripts allow-forms allow-same-origin"
    />
  );
};

export default NginxUI;
