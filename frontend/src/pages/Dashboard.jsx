// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Layers, CheckSquare, ShieldAlert, RefreshCw, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { apiService } from '../services/api';

const Dashboard = () => {
  const [historyData, setHistoryData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Modal States
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiService.getHistory();
      const rawData = response.data || response || [];
      setHistoryData(rawData);
      setTotalCount(response.records_count || rawData.length || 0);
    } catch (err) {
      setError('Database connection error.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Safe accessor for log entries regardless of backend key name (logs, compliance_logs, etc.)
  const getLogsArray = (record) => {
    if (!record) return [];
    if (Array.isArray(record.logs)) return record.logs;
    if (Array.isArray(record.compliance_logs)) return record.compliance_logs;
    if (Array.isArray(record.complianceLogs)) return record.complianceLogs;
    if (Array.isArray(record.details)) return record.details;
    return [];
  };

  const totalDeviations = historyData.filter(s =>
    getLogsArray(s).some(log => String(log.status).toUpperCase() === 'DEVIATION')
  ).length;

  return (
    <div style={{ color: '#f8fafc' }}>

      {/* Header Panel */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px', color: '#fff' }}>
            📊 Project Control Centre
          </h2>
          <p style={{ margin: '6px 0 0 0', color: '#94a3b8', fontSize: '14px' }}>
            Real-time Data Centre EPC automated specification compliance logs
          </p>
        </div>

        <button
          onClick={fetchDashboardData}
          disabled={loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            backgroundColor: 'rgba(30, 41, 59, 0.5)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: '600',
            color: '#3b82f6',
            fontSize: '14px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#3b82f6';
            e.currentTarget.style.boxShadow = '0 0 15px rgba(59, 130, 246, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <RefreshCw size={16} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          Refresh Metrics
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div style={{ padding: '16px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', color: '#f87171', marginBottom: '24px' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Analytics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginBottom: '36px' }}>
        <div style={{
          backgroundColor: 'rgba(30, 41, 59, 0.4)',
          backdropFilter: 'blur(10px)',
          padding: '24px',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05)'
        }}>
          <div>
            <div style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '600', letterSpacing: '0.5px' }}>AUDITED SUBMITTALS</div>
            <div style={{ fontSize: '38px', fontWeight: '800', marginTop: '6px', color: '#fff' }}>{totalCount}</div>
          </div>
          <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
            <Layers size={22} />
          </div>
        </div>

        <div style={{
          backgroundColor: 'rgba(30, 41, 59, 0.4)',
          backdropFilter: 'blur(10px)',
          padding: '24px',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05)'
        }}>
          <div>
            <div style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '600', letterSpacing: '0.5px' }}>COMPLIANT VENDORS</div>
            <div style={{ fontSize: '38px', fontWeight: '800', marginTop: '6px', color: '#10b981' }}>{totalCount - totalDeviations}</div>
          </div>
          <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <CheckSquare size={22} />
          </div>
        </div>

        <div style={{
          backgroundColor: 'rgba(30, 41, 59, 0.4)',
          backdropFilter: 'blur(10px)',
          padding: '24px',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05)'
        }}>
          <div>
            <div style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '600', letterSpacing: '0.5px' }}>CRITICAL DEVIATIONS</div>
            <div style={{ fontSize: '38px', fontWeight: '800', marginTop: '6px', color: '#ef4444' }}>{totalDeviations}</div>
          </div>
          <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <ShieldAlert size={22} />
          </div>
        </div>
      </div>

      {/* Main Table Panel */}
      <div style={{
        backgroundColor: 'rgba(30, 41, 59, 0.25)',
        backdropFilter: 'blur(16px)',
        padding: '28px',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        boxShadow: '0 20px 45px rgba(0,0,0,0.3)'
      }}>
        <h3 style={{ margin: '0 0 24px 0', fontSize: '16px', fontWeight: '700', color: '#f8fafc', letterSpacing: '0.3px' }}>
          📋 Submittal Master Pipeline Log
        </h3>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
            Refreshing stream matrix...
          </div>
        ) : historyData.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#64748b', fontSize: '14px' }}>
            🚫 No submittal records processed yet.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px', textAlign: 'left' }}>
              <thead>
                <tr style={{ color: '#64748b', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '0 16px 12px 16px' }}>Submittal ID</th>
                  <th style={{ padding: '0 16px 12px 16px' }}>Vendor Partner</th>
                  <th style={{ padding: '0 16px 12px 16px' }}>System Category</th>
                  <th style={{ padding: '0 16px 12px 16px' }}>Data Checkpoints</th>
                  <th style={{ padding: '0 16px 12px 16px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {historyData.map((record) => {
                  const logs = getLogsArray(record);
                  const hasDeviation = logs.some(l => String(l.status).toUpperCase() === 'DEVIATION');
                  const submittalId = record.id ?? record.submittal_id;

                  return (
                    <tr
                      key={submittalId}
                      onClick={() => {
                        setSelectedRecord(record);
                        setIsModalOpen(true);
                      }}
                      className="dashboard-table-row"
                      style={{
                        backgroundColor: 'rgba(30, 41, 59, 0.4)',
                        border: '1px solid rgba(255,255,255,0.02)',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <td style={{
                        padding: '16px',
                        fontWeight: '700',
                        color: '#3b82f6',
                        borderTopLeftRadius: '12px',
                        borderBottomLeftRadius: '12px'
                      }}>
                        #{submittalId}
                      </td>
                      <td style={{ padding: '16px', fontWeight: '600', color: '#fff' }}>{record.vendor_name || record.vendorName || 'Apex Datacom Infra'}</td>
                      <td style={{ padding: '16px', color: '#cbd5e1' }}>{record.equipment_type || record.equipmentType || 'Electrical Infra'}</td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '6px 10px', borderRadius: '8px', fontSize: '12px', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.05)' }}>
                          {logs.length} Nodes
                        </span>
                      </td>
                      <td style={{ padding: '16px', borderTopRightRadius: '12px', borderBottomRightRadius: '12px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: '700',
                          letterSpacing: '0.5px',
                          backgroundColor: hasDeviation ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                          color: hasDeviation ? '#f87171' : '#34d399',
                          border: hasDeviation ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)'
                        }}>
                          {hasDeviation ? <AlertTriangle size={12} /> : <CheckCircle size={12} />}
                          {hasDeviation ? 'CRITICAL DEVIATION' : 'PASSED SECURE'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETAILED AUDIT MATRIX MODAL */}
      {isModalOpen && selectedRecord && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#0b1120',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '1050px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>

            {/* Modal Header */}
            <div style={{
              padding: '24px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#1e293b'
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#fff' }}>
                  Audit Matrix: {selectedRecord.vendor_name || selectedRecord.vendorName || 'Apex Datacom Infra'}
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>
                  System Profile Token: <span style={{ color: '#3b82f6', fontFamily: 'monospace', fontWeight: 'bold' }}>#{selectedRecord.id ?? selectedRecord.submittal_id}</span>
                </p>
              </div>
              <button
                onClick={() => { setIsModalOpen(false); setSelectedRecord(null); }}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: '#94a3b8',
                  padding: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', backgroundColor: '#090d16', maxHeight: '70vh', overflowY: 'auto' }}>
              {getLogsArray(selectedRecord).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                  No compliance logs found for this record.
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ color: '#64748b', textTransform: 'uppercase', fontSize: '11px', fontWeight: '700', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <th style={{ padding: '12px 10px', width: '25%' }}>Target Parameter</th>
                        <th style={{ padding: '12px 10px', width: '20%' }}>Expected Spec</th>
                        <th style={{ padding: '12px 10px', width: '22%' }}>Actual Evaluated</th>
                        <th style={{ padding: '12px 10px', width: '13%' }}>Match Status</th>
                        <th style={{ padding: '12px 10px', width: '20%' }}>AI Justification Trace</th>
                      </tr>
                    </thead>
                    <tbody style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                      {getLogsArray(selectedRecord).map((row, idx) => {
                        // Exact database PostgreSQL column mapping
                        const parameter = row.parameter_name || row.parameterName || row.parameter || 'N/A';
                        const expected = row.expected_value || row.expectedValue || row.expected || 'N/A';
                        const actual = row.actual_value || row.actualValue || row.actual || 'N/A';
                        const status = row.status || 'DEVIATION';
                        const reasoning = row.reasoning || row.justification || row.ai_trace || 'Evaluated against specs.';

                        const isDeviation = String(status).toUpperCase() === 'DEVIATION';

                        return (
                          <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            {/* Target Parameter */}
                            <td style={{ padding: '16px 10px', verticalAlign: 'top' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{
                                  width: '4px',
                                  height: '18px',
                                  borderRadius: '4px',
                                  backgroundColor: isDeviation ? '#f59e0b' : '#10b981',
                                  display: 'inline-block',
                                  flexShrink: 0
                                }}></span>
                                <span style={{ color: '#ffffff', fontWeight: '700', fontSize: '13px' }}>{parameter}</span>
                              </div>
                            </td>

                            {/* Expected Spec */}
                            <td style={{ padding: '16px 10px', color: '#cbd5e1', fontSize: '13px', verticalAlign: 'top' }}>
                              {expected}
                            </td>

                            {/* Actual Evaluated */}
                            <td style={{ padding: '16px 10px', fontWeight: '600', color: isDeviation ? '#fbbf24' : '#e2e8f0', fontSize: '13px', verticalAlign: 'top' }}>
                              {actual}
                            </td>

                            {/* Match Status */}
                            <td style={{ padding: '16px 10px', verticalAlign: 'top' }}>
                              <span style={{
                                display: 'inline-block',
                                padding: '4px 10px',
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontWeight: '800',
                                letterSpacing: '0.5px',
                                backgroundColor: isDeviation ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                                color: isDeviation ? '#fbbf24' : '#34d399',
                                border: isDeviation ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)'
                              }}>
                                {isDeviation ? '⚠️ DEVIATION' : '✓ COMPLIANT'}
                              </span>
                            </td>

                            {/* AI Justification Trace */}
                            <td style={{ padding: '16px 10px', color: '#94a3b8', fontSize: '12px', lineHeight: '1.5', verticalAlign: 'top' }}>
                              {reasoning}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .dashboard-table-row:hover {
          background-color: rgba(59, 130, 246, 0.08) !important;
          transform: scale(1.005);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;