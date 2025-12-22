import React, { useState } from 'react';
import './ServerManagement.css';

const NginxUI: React.FC = () => {
  const [sites, setSites] = useState([
    { id: 1, name: 'cherry-on.com', status: 'active', ssl: true, upstreams: 2 },
    { id: 2, name: 'api.cherry-on.com', status: 'active', ssl: true, upstreams: 3 },
    { id: 3, name: 'admin.cherry-on.com', status: 'inactive', ssl: false, upstreams: 1 },
  ]);

  const [nginxConfig, setNginxConfig] = useState(`server {
    listen 80;
    server_name cherry-on.com;
    
    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}`);

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h1><i className="fas fa-server"></i> Nginx Management</h1>
        <p>Управление конфигурациями и виртуальными хостами</p>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#ff6b6b' }}>
            <i className="fas fa-globe"></i>
          </div>
          <div className="stat-info">
            <h3>{sites.length}</h3>
            <p>Виртуальных хостов</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#4ecdc4' }}>
            <i className="fas fa-bolt"></i>
          </div>
          <div className="stat-info">
            <h3>{sites.filter(s => s.status === 'active').length}</h3>
            <p>Активных сайтов</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#45b7d1' }}>
            <i className="fas fa-lock"></i>
          </div>
          <div className="stat-info">
            <h3>{sites.filter(s => s.ssl).length}</h3>
            <p>SSL сертификатов</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#96ceb4' }}>
            <i className="fas fa-sync-alt"></i>
          </div>
          <div className="stat-info">
            <h3>{sites.reduce((acc, s) => acc + s.upstreams, 0)}</h3>
            <p>Upstream серверов</p>
          </div>
        </div>
      </div>
      
      <div className="content-grid">
        <div className="card">
          <div className="card-header">
            <h3><i className="fas fa-list"></i> Список сайтов</h3>
            <button className="btn btn-primary">
              <i className="fas fa-plus"></i> Добавить сайт
            </button>
          </div>
          <div className="table-container">
            <table className="sites-table">
              <thead>
                <tr>
                  <th>Имя сайта</th>
                  <th>Статус</th>
                  <th>SSL</th>
                  <th>Upstreams</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {sites.map((site) => (
                  <tr key={site.id}>
                    <td>
                      <i className="fas fa-globe"></i>
                      {site.name}
                    </td>
                    <td>
                      <span className={`status-badge ${site.status}`}>
                        {site.status === 'active' ? 'Активен' : 'Неактивен'}
                      </span>
                    </td>
                    <td>
                      {site.ssl ? (
                        <i className="fas fa-lock text-success"></i>
                      ) : (
                        <i className="fas fa-unlock text-warning"></i>
                      )}
                    </td>
                    <td>{site.upstreams}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon" title="Редактировать">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="btn-icon" title="Перезагрузить">
                          <i className="fas fa-redo"></i>
                        </button>
                        <button className="btn-icon" title="Удалить">
                          <i className="fas fa-trash"></i>
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
            <h3><i className="fas fa-code"></i> Конфигурация Nginx</h3>
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
              value={nginxConfig}
              onChange={(e) => setNginxConfig(e.target.value)}
              className="config-textarea"
              spellCheck="false"
              rows={12}
            />
          </div>
          <div className="card-footer">
            <div className="config-actions">
              <button className="btn btn-outline">
                <i className="fas fa-check"></i> Проверить синтаксис
              </button>
              <button className="btn btn-outline ml-2">
                <i className="fas fa-download"></i> Экспортировать
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NginxUI;