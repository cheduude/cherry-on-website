import React from 'react';

const MonitorUI: React.FC = () => {
  return (
    <iframe
      src="https://monitor.cherryon.art/stats"
      title="CherryOn Monitor"
      style={{
        width: '100%',
        height: '100%',
        border: 'none'
      }}
      sandbox="allow-scripts allow-forms allow-same-origin"
    />
  );
};

export default MonitorUI;
