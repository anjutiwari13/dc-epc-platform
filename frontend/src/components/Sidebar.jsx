// src/components/Sidebar.jsx
import React from 'react';
import { LayoutDashboard, UploadCloud, ShieldCheck, MessageSquareCode } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload-specs', label: 'Upload Specs', icon: UploadCloud },
    { id: 'compliance', label: 'Compliance Audit', icon: ShieldCheck },
    { id: 'chat', label: 'Engineer AI Chat', icon: MessageSquareCode },
  ];

  return (
    <div style={{
      width: '250px',
      backgroundColor: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      color: '#fff',
      height: '94vh',
      position: 'fixed',
      left: '20px',
      top: '3vh',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
      zIndex: 100,
    }}>
      <div style={{
        padding: '30px 24px',
        fontSize: '20px',
        fontWeight: '800',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        textAlign: 'center',
        letterSpacing: '0.5px',
        background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        🏗️ DC-EPC Pro
      </div>

      <div style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '14px 16px',
                backgroundColor: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                color: isActive ? '#60a5fa' : '#94a3b8',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: isActive ? '600' : '500',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                borderLeft: isActive ? '3px solid #3b82f6' : '3px solid transparent',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
                  e.currentTarget.style.color = '#fff';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#94a3b8';
                }
              }}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;