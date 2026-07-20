// src/App.jsx
import React, { useState } from 'react';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import SpecUpload from './pages/SpecUpload';
import ComplianceAudit from './pages/ComplianceAudit';
import ChatBot from './pages/ChatBot';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'upload-specs':
        return <SpecUpload />;
      case 'compliance':
        return <ComplianceAudit />;
      case 'chat':
        return <ChatBot />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <MainLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </MainLayout>
  );
}

export default App;