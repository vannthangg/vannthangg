import { useState } from 'react';

import MenuManager from './MenuManager';
import QRCodeManager from './QRCodeManager';

export default function AdminMenuQR({ onLogout }) {
  const [activeTab, setActiveTab] = useState('menu');

  const tabsContainerStyle = {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
    borderBottom: '2px solid #e85d0420',
    paddingBottom: '0',
    fontFamily: '"Times New Roman", Times, serif'
  };

  const tabStyle = (isActive) => ({
    padding: '12px 24px',
    background: 'none',
    border: 'none',
    borderBottom: isActive ? '3px solid #e85d04' : '3px solid transparent',
    color: isActive ? '#e85d04' : '#999',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: isActive ? '600' : '500',
    transition: 'all 0.2s',
    marginBottom: '-2px',
    fontFamily: '"Times New Roman", Times, serif'
  });

  return (
    <div>
      <div style={tabsContainerStyle}>
        <button
          onClick={() => setActiveTab('menu')}
          style={tabStyle(activeTab === 'menu')}
        >
          Quản lý Món Ăn
        </button>
        <button
          onClick={() => setActiveTab('qr')}
          style={tabStyle(activeTab === 'qr')}
        >
          Tạo Mã QR Bàn
        </button>
      </div>

      {activeTab === 'menu' && <MenuManager />}
      {activeTab === 'qr' && <QRCodeManager />}
    </div>
  );
}
