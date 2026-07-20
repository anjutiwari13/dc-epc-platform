// src/pages/ComplianceAudit.jsx
import React, { useState } from 'react';
import { ShieldCheck, FileSpreadsheet, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { apiService } from '../services/api';

const ComplianceAudit = () => {
  const [vendorName, setVendorName] = useState('');
  const [equipmentType, setEquipmentType] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [auditResult, setAuditResult] = useState(null);
  const [error, setError] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !vendorName || !equipmentType) {
      setError('Please fill in all required fields and attach a PDF file.');
      return;
    }

    setLoading(true);
    setError('');
    setAuditResult(null);

    try {
      const data = await apiService.verifySubmittal(file, vendorName, equipmentType);
      setAuditResult(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Audit processing failed. Please check the backend console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', color: '#f8fafc' }}>

      {/* Header Panel */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{
          margin: 0,
          fontSize: '26px',
          fontWeight: '800',
          letterSpacing: '-0.5px',
          color: '#fff'
        }}>
          🛡️ Compliance Audit Engine
        </h2>
        <p style={{ margin: '6px 0 0 0', color: '#94a3b8', fontSize: '14px' }}>
          Cross-check vendor submittal sheets instantly against baseline technical specs via AI vector pipelines.
        </p>
      </div>

      {/* Futuristic Audit Input Form Container */}
      <form onSubmit={handleUpload} style={{
        backgroundColor: 'rgba(30, 41, 59, 0.3)',
        backdropFilter: 'blur(16px)',
        padding: '28px',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '20px',
        alignItems: 'end',
        marginBottom: '36px'
      }}>

        {/* Vendor input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: '#94a3b8', letterSpacing: '0.3px' }}>VENDOR PARTNER</label>
          <input
            type="text"
            placeholder="e.g. Siemens"
            value={vendorName}
            onChange={(e) => setVendorName(e.target.value)}
            disabled={loading}
            style={{
              padding: '12px 14px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backgroundColor: 'rgba(15, 23, 42, 0.4)',
              color: '#fff',
              fontSize: '14px',
              outline: 'none',
              transition: 'all 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
          />
        </div>

        {/* Equipment Input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: '#94a3b8', letterSpacing: '0.3px' }}>SYSTEM / EQUIPMENT</label>
          <input
            type="text"
            placeholder="e.g. 500kW Chiller"
            value={equipmentType}
            onChange={(e) => setEquipmentType(e.target.value)}
            disabled={loading}
            style={{
              padding: '12px 14px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backgroundColor: 'rgba(15, 23, 42, 0.4)',
              color: '#fff',
              fontSize: '14px',
              outline: 'none',
              transition: 'all 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
          />
        </div>

        {/* Custom Styling for File Input area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: '#94a3b8', letterSpacing: '0.3px' }}>SUBMITTAL SHEET (PDF)</label>
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
              disabled={loading}
              style={{
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: 'rgba(15, 23, 42, 0.2)',
                color: '#cbd5e1',
                fontSize: '13px',
                width: '92%',
                cursor: 'pointer'
              }}
            />
          </div>
        </div>

        {/* High-Performance Submit Trigger */}
        <button
          type="submit"
          disabled={loading}
          style={{
            gridColumn: '1 / span 3',
            padding: '15px',
            backgroundColor: loading ? 'rgba(16, 185, 129, 0.2)' : '#10b981',
            color: loading ? '#64748b' : '#fff',
            border: loading ? '1px solid rgba(255,255,255,0.05)' : 'none',
            borderRadius: '12px',
            fontWeight: '600',
            fontSize: '15px',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '8px',
            transition: 'all 0.3s ease',
            boxShadow: loading ? 'none' : '0 4px 20px rgba(16, 185, 129, 0.25)'
          }}
          onMouseEnter={(e) => {
            if(!loading) {
              e.currentTarget.style.backgroundColor = '#059669';
              e.currentTarget.style.boxShadow = '0 0 25px rgba(16, 185, 129, 0.45)';
            }
          }}
          onMouseLeave={(e) => {
            if(!loading) {
              e.currentTarget.style.backgroundColor = '#10b981';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(16, 185, 129, 0.25)';
            }
          }}
        >
          {loading ? (
            <>
              <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Initializing Multi-Vector Verification...
            </>
          ) : (
            <>
              <ShieldCheck size={18} /> Deploy Automated Compliance Auditor
            </>
          )}
        </button>
      </form>

      {/* Cyber Error Box */}
      {error && (
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          color: '#f87171',
          padding: '16px 20px',
          borderRadius: '12px',
          marginBottom: '32px',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          fontWeight: '500'
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Audit Telemetry Output Section */}
      {auditResult && (
        <div style={{
          backgroundColor: 'rgba(30, 41, 59, 0.2)',
          backdropFilter: 'blur(20px)',
          padding: '28px',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}>

          {/* Header metadata layout */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '28px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            paddingBottom: '20px'
          }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#fff' }}>
                Audit Matrix: {auditResult.vendor_name}
              </h3>
              <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>
                System Profile Token: <span style={{ color: '#3b82f6', fontWeight: '600' }}>#{auditResult.submittal_id}</span>
              </p>
            </div>

            <span style={{
              padding: '6px 14px',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '12px',
              letterSpacing: '0.5px',
              backgroundColor: auditResult.status === '100%_COMPLIANT' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: auditResult.status === '100%_COMPLIANT' ? '#34d399' : '#f87171',
              border: auditResult.status === '100%_COMPLIANT' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)'
            }}>
              {auditResult.status.replace('_', ' ')}
            </span>
          </div>

          {/* Results Analytics Grid Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px', textAlign: 'left' }}>
              <thead>
                <tr style={{ color: '#64748b', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '0 16px 8px 16px' }}>Target Parameter</th>
                  <th style={{ padding: '0 16px 8px 16px' }}>Expected Spec</th>
                  <th style={{ padding: '0 16px 8px 16px' }}>Actual Evaluated</th>
                  <th style={{ padding: '0 16px 8px 16px' }}>Match Status</th>
                  <th style={{ padding: '0 16px 8px 16px' }}>AI Justification Trace</th>
                </tr>
              </thead>
              <tbody>
                {auditResult.audit_logs?.map((log, index) => {
                  const isCompliant = log.status === 'COMPLIANT';
                  return (
                    <tr
                      key={index}
                      style={{
                        backgroundColor: 'rgba(30, 41, 59, 0.4)',
                        border: '1px solid rgba(255,255,255,0.02)',
                        borderRadius: '12px'
                      }}
                    >
                      <td style={{
                        padding: '16px',
                        fontWeight: '700',
                        color: '#fff',
                        borderTopLeftRadius: '12px',
                        borderBottomLeftRadius: '12px',
                        borderLeft: isCompliant ? '4px solid #10b981' : '4px solid #f59e0b'
                      }}>
                        {log.parameter_name}
                      </td>

                      <td style={{ padding: '16px', color: '#cbd5e1', fontSize: '14px', fontWeight: '500' }}>
                        {log.expected_value}
                      </td>

                      <td style={{
                        padding: '16px',
                        color: isCompliant ? '#cbd5e1' : '#fba518',
                        fontSize: '14px',
                        fontWeight: isCompliant ? '500' : '600'
                      }}>
                        {log.actual_value}
                      </td>

                      <td style={{ padding: '16px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '700',
                          backgroundColor: isCompliant ? 'rgba(59, 130, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                          color: isCompliant ? '#60a5fa' : '#fbbf24',
                          border: isCompliant ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid rgba(245, 158, 11, 0.2)'
                        }}>
                          {isCompliant ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
                          {log.status}
                        </span>
                      </td>

                      <td style={{
                        padding: '16px',
                        fontSize: '13px',
                        color: '#94a3b8',
                        maxWidth: '320px',
                        lineHeight: '1.4',
                        borderTopRightRadius: '12px',
                        borderBottomRightRadius: '12px'
                      }}>
                        {log.reasoning}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ComplianceAudit;