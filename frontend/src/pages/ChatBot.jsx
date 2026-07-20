// src/pages/ChatBot.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, BookOpen, Terminal } from 'lucide-react';
import { apiService } from '../services/api';

// --- TYPEWRITER COMPONENT FOR STREAMING EFFECT ---
const TypewriterText = ({ text, speed = 20 }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;
    setDisplayedText('');

    const intervalId = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(intervalId);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed]);

  return <span>{displayedText}</span>;
};

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Heey! I am your Data Centre AI Assistant. Feel free to ask any questions regarding technical specifications.',
      isNew: true // Flag to trigger typing animation
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userQuery = input;
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userQuery, isNew: false }]);
    setLoading(true);

    try {
      const response = await apiService.chatQuery(userQuery);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: response.answer,
          citations: response.citations,
          isNew: true // Enable typing effect for new AI responses
        }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Error: Connection fail ho gaya ya context nahi mila. Backend verify karein.',
          isNew: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', height: '82vh', display: 'flex', flexDirection: 'column', color: '#f8fafc' }}>

      {/* Header Panel */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{
          margin: 0,
          fontSize: '26px',
          fontWeight: '800',
          letterSpacing: '-0.5px',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Terminal size={24} style={{ color: '#3b82f6' }} /> Engineer AI Copilot
        </h2>
        <p style={{ margin: '6px 0 0 0', color: '#94a3b8', fontSize: '14px' }}>
          Query site implementation rules, electrical safety logs, or clearance matrix specifications.
        </p>
      </div>

      {/* Glassmorphic Chat Streams Container */}
      <div
        className="cyber-box-override"
        style={{
          flexGrow: 1,
          backgroundColor: '#1e293b',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
          padding: '24px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          marginBottom: '20px',
        }}
      >
        {messages.map((msg, index) => {
          const isAI = msg.sender === 'ai';
          return (
            <div key={index} style={{
              display: 'flex',
              gap: '14px',
              alignSelf: isAI ? 'flex-start' : 'flex-end',
              flexDirection: isAI ? 'row' : 'row-reverse',
              maxWidth: '80%'
            }}>
              {/* Avatar Ring */}
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                backgroundColor: isAI ? 'rgba(59, 130, 246, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isAI ? '#60a5fa' : '#34d399',
                border: isAI ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
                flexShrink: 0
              }}>
                {isAI ? <Bot size={20} /> : <User size={20} />}
              </div>

              {/* Message Block */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: isAI ? 'flex-start' : 'flex-end' }}>
                <div style={{
                  padding: '14px 18px',
                  borderRadius: isAI ? '0px 16px 16px 16px' : '16px 0px 16px 16px',
                  backgroundColor: isAI ? '#0f172a' : '#3b82f6',
                  color: '#ffffff',
                  fontSize: '14.5px',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap',
                  border: isAI ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }} className="cyber-msg-text">
                  {/* Agar message AI ka hai aur isNew active hai toh Typewriter chalega */}
                  {isAI && msg.isNew ? (
                    <TypewriterText text={msg.text} speed={15} />
                  ) : (
                    msg.text
                  )}
                </div>

                {/* High-Tech Luminous Reference Citations */}
                {msg.citations && msg.citations.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '2px' }}>
                    {Array.from(new Set(msg.citations.map(c => `${c.document}|||${c.page}`)))
                      .map(uniqueKey => {
                        const [docName, pgNum] = uniqueKey.split('|||');
                        return (
                          <span key={uniqueKey} style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '11px',
                            backgroundColor: 'rgba(59, 130, 246, 0.15)',
                            color: '#93c5fd',
                            padding: '5px 10px',
                            borderRadius: '6px',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            fontWeight: '600',
                            letterSpacing: '0.3px'
                          }}>
                            <BookOpen size={12} style={{ color: '#60a5fa' }} />
                            {docName} <span style={{ color: '#64748b', margin: '0 2px' }}>|</span> Pg {pgNum}
                          </span>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Telemetry Loader */}
        {loading && (
          <div style={{ display: 'flex', gap: '14px', alignSelf: 'flex-start' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255,255,255,0.02)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#3b82f6',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
            </div>
            <span style={{ color: '#94a3b8', fontSize: '13px', alignSelf: 'center', fontWeight: '500' }}>
              Parsing Vector Knowledge Matrix...
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Console Input Bar */}
      <form onSubmit={handleSend} style={{ display: 'flex', gap: '12px' }}>
        <input
          type="text"
          placeholder="Ask a question (e.g., What is the fuel tank capacity layout requirement?)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          className="cyber-input-field"
          style={{
            flexGrow: 1,
            padding: '16px',
            borderRadius: '14px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            fontSize: '14.5px',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          style={{
            padding: '0 28px',
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            border: 'none',
            borderRadius: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Send size={18} />
        </button>
      </form>

      {/* Global CSS Styles */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .cyber-box-override {
          background-color: #1e293b !important;
        }
        .cyber-msg-text {
          background-color: #0f172a !important;
          color: #ffffff !important;
        }
        .cyber-input-field {
          background-color: #0f172a !important;
          color: #ffffff !important;
        }
      `}</style>
    </div>
  );
};

export default ChatBot;