// src/pages/SpecUpload.jsx
import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { apiService } from '../services/api';

const SpecUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' ya 'error'
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus(null);
      setMessage('');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatus('error');
      setMessage('Please select a PDF file first.');
      return;
    }

    setLoading(true);
    setStatus(null);
    try {
      const response = await apiService.uploadSpecs(file);
      setStatus('success');
      setMessage(response.message || 'Specification PDF successfully ingested!');
      setFile(null); // Upload ke baad input clear
    } catch (error) {
      setStatus('error');
     setMessage(error.response?.data?.detail || 'Upload failed. Please check the backend server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '650px', margin: '0 auto', color: '#f8fafc' }}>

      {/* Header Title Section */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{
          margin: 0,
          fontSize: '26px',
          fontWeight: '800',
          letterSpacing: '-0.5px',
          color: '#fff'
        }}>
          📁 Knowledge Base Ingestion
        </h2>
        <p style={{ margin: '6px 0 0 0', color: '#94a3b8', fontSize: '14px', lineHeight: '1.5' }}>
  Upload your original Data Centre design specifications PDF here.
  The AI system will automatically process and embed it into the <strong>ChromaDB Vector Store</strong>.
</p>
      </div>

      {/* Main Glassmorphic Panel */}
      <form onSubmit={handleUpload} style={{
        backgroundColor: 'rgba(30, 41, 59, 0.3)',
        backdropFilter: 'blur(16px)',
        padding: '36px',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
      }}>

        {/* Dynamic Drag/Drop Neon Box */}
        <div style={{
          border: file ? '2px dashed #3b82f6' : '2px dashed rgba(255, 255, 255, 0.15)',
          borderRadius: '16px',
          padding: '50px 20px',
          textAlign: 'center',
          backgroundColor: file ? 'rgba(59, 130, 246, 0.05)' : 'rgba(15, 23, 42, 0.2)',
          cursor: 'pointer',
          position: 'relative',
          marginBottom: '24px',
          transition: 'all 0.3s ease',
          boxShadow: file ? '0 0 20px rgba(59, 130, 246, 0.15)' : 'none'
        }}
        onMouseEnter={(e) => {
          if(!file) e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        }}
        onMouseLeave={(e) => {
          if(!file) e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
        }}
        >
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            disabled={loading}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              cursor: loading ? 'not-allowed' : 'pointer',
              zIndex: 2
            }}
          />

          <div style={{
            display: 'inline-flex',
            padding: '16px',
            borderRadius: '50%',
            backgroundColor: file ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.03)',
            color: file ? '#60a5fa' : '#64748b',
            marginBottom: '16px',
            border: file ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            <Upload size={28} />
          </div>

          <p style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: '600', color: file ? '#fff' : '#cbd5e1' }}>
            {file ? file.name : "Drop your specifications PDF here"}
          </p>
          <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
            {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : "Click to browse system files (Maximum 50MB)"}
          </p>
        </div>

        {/* Cyber Alert Status Blocks */}
        {status === 'success' && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            color: '#34d399',
            padding: '14px 18px',
            borderRadius: '12px',
            marginBottom: '24px',
            fontSize: '14px',
            fontWeight: '500',
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}>
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} /> {message}
          </div>
        )}

        {status === 'error' && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: '#f87171',
            padding: '14px 18px',
            borderRadius: '12px',
            marginBottom: '24px',
            fontSize: '14px',
            fontWeight: '500',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} /> {message}
          </div>
        )}

        {/* High-Tech Glowing Ingestion Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: loading ? 'rgba(59, 130, 246, 0.2)' : '#3b82f6',
            color: loading ? '#64748b' : '#fff',
            border: loading ? '1px solid rgba(255,255,255,0.05)' : 'none',
            borderRadius: '12px',
            fontWeight: '600',
            fontSize: '15px',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: loading ? 'none' : '0 4px 20px rgba(59, 130, 246, 0.3)',
          }}
          onMouseEnter={(e) => {
            if(!loading) {
              e.currentTarget.style.backgroundColor = '#2563eb';
              e.currentTarget.style.boxShadow = '0 0 25px rgba(59, 130, 246, 0.5)';
            }
          }}
          onMouseLeave={(e) => {
            if(!loading) {
              e.currentTarget.style.backgroundColor = '#3b82f6';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(59, 130, 246, 0.3)';
            }
          }}
        >
          {loading ? (
            <>
              <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Ingesting Vector Matrices...
            </>
          ) : (
            <>
              <Sparkles size={18} /> Run Vector Ingestion Engine
            </>
          )}
        </button>
      </form>

      {/* Local keyframe styling rules */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SpecUpload;