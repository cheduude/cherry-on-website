import React from 'react';

const MailUI: React.FC = () => {
  return (
    <iframe
      src="https://cow.cherryon.art/"
      title="CherryOn Mail"
      style={{
        width: '100%',
        height: '100%',
        border: 'none'
      }}
      sandbox="allow-scripts allow-forms allow-same-origin"
    />
  );
};

export default MailUI;
