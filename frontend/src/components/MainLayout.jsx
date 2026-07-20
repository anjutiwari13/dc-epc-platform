// src/components/MainLayout.jsx
import React from 'react';
import Sidebar from './Sidebar';

const MainLayout = ({ children, activeTab, setActiveTab }) => {
  return (
    <div style={{
      minHeight: '100vh',
      // Premium Cyber Slate Dark Background with geometric layout
      backgroundColor: '#0f172a',
      backgroundImage: `
        linear-gradient(rgba(30, 41, 59, 0.4) 1px, transparent 1px),
        linear-gradient(90deg, rgba(30, 41, 59, 0.4) 1px, transparent 1px)
      `,
      backgroundSize: '30px 30px',
      fontFamily: "'Inter', sans-serif",
      display: 'flex'
    }}>
      {/* Sidebar Section */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div style={{
        flexGrow: 1,
        marginLeft: '290px', // Proper breathing space from sidebar
        padding: '40px 40px 40px 20px',
        minWidth: 0
      }}>
        {children}
      </div>
    </div>
  );
};

export default MainLayout;