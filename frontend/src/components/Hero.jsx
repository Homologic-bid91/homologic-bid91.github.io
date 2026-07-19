import React from 'react';

export default function Hero({ stats, setActiveTab }) {
  const formatNumber = (numStr) => {
    if (!numStr) return '0';
    const num = parseInt(numStr.replace(/,/g, ''), 10);
    if (isNaN(num)) return numStr;
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="glass-panel" style={{ padding: '3rem', marginBottom: '3rem', overflow: 'hidden' }}>
      <div className="hero-wrapper">
        <div className="hero-content">
          <h1 className="hero-title">
            Unlock Your Tech Career with <span className="text-gradient">Virtual Gyans</span>
          </h1>
          <p className="hero-subtitle">
            Get the latest recruitment updates, onboarding timelines, and comprehensive training preparation guides for top MNCs like Cognizant, TCS, Accenture, and Wipro. Let's make placement preparation simple.
          </p>
          
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => setActiveTab('guides')}>
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              Get Placement Guides
            </button>
            <button className="btn btn-secondary" onClick={() => setActiveTab('tools')}>
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              Interactive Study Tools
            </button>
          </div>
          
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-val text-gradient">{formatNumber(stats.subscriberCount)}+</div>
              <div className="stat-label">Subscribers</div>
            </div>
            <div className="stat-item">
              <div className="stat-val text-gradient">{formatNumber(stats.viewCount)}+</div>
              <div className="stat-label">Total Views</div>
            </div>
            <div className="stat-item">
              <div className="stat-val text-gradient">{stats.videoCount}</div>
              <div className="stat-label">Tutorial Videos</div>
            </div>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="visual-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="visual-circle visual-circle-1"></div>
            <div className="visual-circle visual-circle-2"></div>
            <img 
              src={stats.avatarUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=150&fit=crop"} 
              alt="Virtual Gyans Avatar" 
              className="channel-avatar"
            />
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', zIndex: 2, letterSpacing: '-0.02em' }}>
              Md Irfan
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
