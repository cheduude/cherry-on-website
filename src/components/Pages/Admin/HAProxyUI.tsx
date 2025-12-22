import React, { useState } from 'react';
import './ServerManagement.css';

const HAProxyUI: React.FC = () => {
  const [backends, setBackends] = useState([
    { id: 1, name: 'web-backend', status: 'active', servers: 3, algorithm: 'roundrobin' },
    { id: 2, name: 'api-backend', status: 'active', servers: 2, algorithm: 'leastconn' },
    { id: 3, name: 'static-backend', status: 'warning', servers: 1, algorithm: 'source' },
  ]);

  const [frontends, setFrontends] = useState([
    { id: 1, name: 'http-frontend', port: 80, backends: ['web-backend'], ssl: false },
    { id: 2, name: 'https-frontend', port: 443, backends: ['web-backend', 'api-backend'], ssl: true },
    { id: 3, name: 'admin-frontend', port: 8080, backends: ['static-backend'], ssl: true },
  ]);

  const [haproxyConfig, setHaproxyConfig] = useState(`global
    daemon
    maxconn 256

defaults
    mode http
    timeout connect 5000ms
    timeout client 50000ms
    timeout server 50000ms

frontend http_front
    bind *:80
    default_backend web_servers

backend web_servers
    balance roundrobin
    server web1 192.168.1.10:80 check
    server web2 192.168.1.11:80 check`);

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h1><i className="fas fa-exchange-alt"></i> HAProxy Management</h1>
        <p>Управление балансировкой нагрузки и прокси-правилами</p>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#4ecdc4' }}>
            <i className="fas fa-sitemap"></i>
          </div>
          <div className="stat-info">
            <h3>{frontends.length}</h3>
            <p>Frontend правил</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#ff6b6b' }}>
            <i className="fas fa-server"></i>
          </div>
          <div className="stat-info">
            <h3>{backends.length}</h3>
            <p>Backend групп</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#45b7d1' }}>
            <i className="fas fa-balance-scale"></i>
          </div>
          <div className="stat-info">
            <h3>{backends.reduce((acc, b) => acc + b.servers, 0)}</h3>
            <p>Всего серверов</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#96ceb4' }}>
            <i className="fas fa-chart-bar"></i>
          </div>
          <div className="stat-info">
            <h3>24.5k</h3>
            <p>Запросов/час</p>
          </div>
        </div>
      </div>
      
      <div className="content-grid">
        <div className="card">
          <div className="card-header">
            <h3><i className="fas fa-project-diagram"></i> Frontend правила</h3>
            <button className="btn btn-primary">
              <i className="fas fa-plus"></i> Добавить frontend
            </button>
          </div>
          <div className="table-container">
            <table className="sites-table">
              <thead>
                <tr>
                  <th>Имя</th>
                  <th>Порт</th>
                  <th>SSL</th>
                  <th>Backends</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {frontends.map((frontend) => (
                  <tr key={frontend.id}>
                    <td>
                      <i className="fas fa-sign-in-alt"></i>
                      {frontend.name}
                    </td>
                    <td>
                      <span className="port-badge">{frontend.port}</span>
                    </td>
                    <td>
                      {frontend.ssl ? (
                        <i className="fas fa-lock text-success"></i>
                      ) : (
                        <i className="fas fa-unlock text-warning"></i>
                      )}
                    </td>
                    <td>
                      <div className="backend-tags">
                        {frontend.backends.map((backend, idx) => (
                          <span key={idx} className="tag">{backend}</span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon" title="Редактировать">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="btn-icon" title="Статистика">
                          <i className="fas fa-chart-bar"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h3><i className="fas fa-server"></i> Backend группы</h3>
            <button className="btn btn-primary">
              <i className="fas fa-plus"></i> Добавить backend
            </button>
          </div>
          <div className="table-container">
            <table className="sites-table">
              <thead>
                <tr>
                  <th>Имя группы</th>
                  <th>Статус</th>
                  <th>Серверов</th>
                  <th>Алгоритм</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {backends.map((backend) => (
                  <tr key={backend.id}>
                    <td>
                      <i className="fas fa-sitemap"></i>
                      {backend.name}
                    </td>
                    <td>
                      <span className={`status-badge ${backend.status}`}>
                        {backend.status === 'active' ? 'Активен' : 
                         backend.status === 'warning' ? 'Предупреждение' : 'Неактивен'}
                      </span>
                    </td>
                    <td>{backend.servers}</td>
                    <td>
                      <span className="algorithm-badge">{backend.algorithm}</span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon" title="Просмотр серверов">
                          <i className="fas fa-eye"></i>
                        </button>
                        <button className="btn-icon" title="Настроить health check">
                          <i className="fas fa-heartbeat"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="card full-width">
          <div className="card-header">
            <h3><i className="fas fa-code"></i> Конфигурация HAProxy</h3>
            <div>
              <button className="btn btn-success">
                <i className="fas fa-save"></i> Сохранить
              </button>
              <button className="btn btn-warning ml-2">
                <i className="fas fa-redo"></i> Перезагрузить
              </button>
            </div>
          </div>
          <div className="config-editor">
            <textarea 
              value={haproxyConfig}
              onChange={(e) => setHaproxyConfig(e.target.value)}
              className="config-textarea"
              spellCheck="false"
              rows={10}
            />
          </div>
          <div className="card-footer">
            <div className="config-actions">
              <button className="btn btn-outline">
                <i className="fas fa-play"></i> Тестовый запуск
              </button>
              <button className="btn btn-outline ml-2">
                <i className="fas fa-chart-line"></i> Просмотр статистики
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HAProxyUI;