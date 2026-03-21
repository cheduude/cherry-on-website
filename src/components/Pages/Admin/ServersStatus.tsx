import React from 'react';

const ServersStatusUI: React.FC = () => {
  return (
    <iframe
      src="https://up.statuser.cloud/s/cherrycdnstatus"
      title="CherryOn Servers status"
      style={{
        width: '100%',
        height: '100%',
        border: 'none'
      }}
      sandbox="allow-scripts allow-forms allow-same-origin"
    />
  );
};

export default ServersStatusUI;
