import React, { useState } from 'react';
import Sidebar from './Sidebar';
import NginxUI from './NginxUI';
import HAProxyUI from './HAProxyUI';
import './ServerManagement.css';

const ServerManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'nginx' | 'haproxy'>('nginx');

  return (
    <div className="server-management">
      <div className="container">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="main-content">
          {activeTab === 'nginx' ? <NginxUI /> : <HAProxyUI />}
        </main>
      </div>
    </div>
  );
};

export default ServerManagementPage;