import React, { useState } from 'react';

export default function PlacementHub({ resources }) {
  const [selectedCompany, setSelectedCompany] = useState('All');

  const companies = ['All', 'Cognizant', 'TCS', 'Accenture', 'All-Rounder'];

  const filteredResources = resources.filter(res => {
    if (selectedCompany === 'All') return true;
    if (selectedCompany === 'All-Rounder') return res.company.toLowerCase() === 'all';
    return res.company.toLowerCase() === selectedCompany.toLowerCase();
  });

  return (
    <div style={{ marginBottom: '3rem' }}>
      <div className="section-header">
        <div className="section-info">
          <h2 className="section-title">Placement Prep <span className="text-gradient">Hub & Resources</span></h2>
          <p className="section-desc">Get instant access to curated roadmaps, cheat sheets, and recruitment blueprints for top service companies.</p>
        </div>
      </div>

      <div className="filters-wrapper">
        <div className="filter-tabs">
          {companies.map((comp) => (
            <button
              key={comp}
              className={`filter-tab ${selectedCompany === comp ? 'active' : ''}`}
              onClick={() => setSelectedCompany(comp)}
            >
              {comp}
            </button>
          ))}
        </div>
      </div>

      <div className="grid-container">
        {filteredResources.map((res) => (
          <div key={res.id} className="glass-card resource-card">
            <div className="resource-header">
              <span className="badge badge-primary">{res.company}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{res.category}</span>
            </div>
            
            <h3 className="resource-title">{res.title}</h3>
            <p className="resource-desc">{res.description}</p>
            
            <div className="resource-tags">
              {res.tags.map((tag) => (
                <span key={tag} className="badge badge-secondary" style={{ fontSize: '0.65rem' }}>
                  #{tag}
                </span>
              ))}
            </div>

            <div className="resource-action">
              <a 
                href={res.downloadUrl} 
                className="btn btn-secondary" 
                style={{ width: '100%', gap: '0.5rem' }}
                onClick={(e) => {
                  if (res.downloadUrl === '#') {
                    e.preventDefault();
                    alert(`Resource "${res.title}" download will start. In production, this can link to a PDF or Google Drive file.`);
                  }
                }}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Download PDF Resource
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
