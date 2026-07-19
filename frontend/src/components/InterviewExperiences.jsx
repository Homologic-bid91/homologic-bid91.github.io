import React, { useState } from 'react';

export default function InterviewExperiences({ initialExperiences, onSubmitExperience }) {
  const [experiences, setExperiences] = useState(initialExperiences);
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [candidate, setCandidate] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('Cognizant');
  const [customCompany, setCustomCompany] = useState('');
  const [date, setDate] = useState('');
  const [verdict, setVerdict] = useState('Selected');
  const [difficulty, setDifficulty] = useState('Medium');
  const [tips, setTips] = useState('');
  
  // Dynamic rounds list state
  const [rounds, setRounds] = useState([
    { name: 'Online Assessment', summary: '' },
    { name: 'Technical Interview', summary: '' }
  ]);

  const companies = ['All', 'Cognizant', 'TCS', 'Accenture', 'Wipro'];

  const filteredExperiences = experiences.filter(exp => {
    if (selectedCompany === 'All') return true;
    return exp.company.toLowerCase() === selectedCompany.toLowerCase();
  });

  const handleAddRound = () => {
    setRounds([...rounds, { name: `Round ${rounds.length + 1}`, summary: '' }]);
  };

  const handleRemoveRound = (index) => {
    const updated = rounds.filter((_, idx) => idx !== index);
    setRounds(updated);
  };

  const handleRoundChange = (index, field, value) => {
    const updated = rounds.map((r, idx) => {
      if (idx === index) {
        return { ...r, [field]: value };
      }
      return r;
    });
    setRounds(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!candidate || !role || !date || !tips) {
      alert('Please fill out all required fields.');
      return;
    }

    const finalCompany = company === 'Other' ? customCompany : company;
    if (!finalCompany) {
      alert('Please specify the company name.');
      return;
    }

    const newExperience = {
      candidate,
      role,
      company: finalCompany,
      date,
      verdict,
      difficulty,
      rounds: rounds.filter(r => r.summary.trim() !== ''),
      tips
    };

    // Callback to App component (which can send it to FastAPI backend if active)
    const savedExperience = await onSubmitExperience(newExperience);
    
    // Add to local state list immediately
    setExperiences([savedExperience, ...experiences]);

    // Reset Form & Close Modal
    setCandidate('');
    setRole('');
    setCompany('Cognizant');
    setCustomCompany('');
    setDate('');
    setVerdict('Selected');
    setDifficulty('Medium');
    setTips('');
    setRounds([
      { name: 'Online Assessment', summary: '' },
      { name: 'Technical Interview', summary: '' }
    ]);
    setIsModalOpen(false);
  };

  return (
    <div style={{ marginBottom: '3rem' }}>
      <div className="section-header">
        <div className="section-info">
          <h2 className="section-title">Interview <span className="text-gradient">Experiences & Logs</span></h2>
          <p className="section-desc">Crowdsourced interview reports from successful candidates. Read their round details and preparation tips.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Share Your Experience
        </button>
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

      <div className="exp-grid">
        {filteredExperiences.map((exp) => (
          <div key={exp.id} className="glass-panel exp-card">
            <div className="exp-header">
              <div className="exp-title-block">
                <h3>{exp.role}</h3>
                <div className="exp-subtitle">
                  Shared by <strong>{exp.candidate}</strong> • {exp.date}
                </div>
              </div>
              <div className="exp-meta">
                <span className="badge badge-primary">{exp.company}</span>
                <span className={`badge ${exp.verdict === 'Selected' ? 'badge-success' : 'badge-warning'}`}>
                  {exp.verdict}
                </span>
                <span className="badge badge-secondary" style={{ textTransform: 'none' }}>
                  Difficulty: {exp.difficulty}
                </span>
              </div>
            </div>

            <div className="exp-body">
              {exp.rounds.map((round, idx) => (
                <div key={idx}>
                  <div className="exp-round-title">{round.name}</div>
                  <div className="exp-round-desc">{round.summary}</div>
                </div>
              ))}
              
              <div className="exp-tips">
                <strong>Preparation Advice:</strong> {exp.tips}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Share Experience Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="glass-panel modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <button className="modal-close" onClick={() => setIsModalOpen(false)}>
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Share Your <span className="text-gradient">Interview Journey</span></h3>
            
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Your Name (or Anonymous) *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={candidate} 
                    onChange={(e) => setCandidate(e.target.value)} 
                    placeholder="e.g. Amit Kumar"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Job Role *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)} 
                    placeholder="e.g. Cognizant GenC Developer"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Company Name *</label>
                  <select 
                    className="form-select" 
                    value={company} 
                    onChange={(e) => setCompany(e.target.value)}
                  >
                    <option value="Cognizant">Cognizant</option>
                    <option value="TCS">TCS</option>
                    <option value="Accenture">Accenture</option>
                    <option value="Wipro">Wipro</option>
                    <option value="Infosys">Infosys</option>
                    <option value="Other">Other Company</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Interview Date / Month *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                    placeholder="e.g. June 2026"
                    required
                  />
                </div>
              </div>

              {company === 'Other' && (
                <div className="form-group">
                  <label className="form-label">Specify Company Name *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={customCompany} 
                    onChange={(e) => setCustomCompany(e.target.value)} 
                    placeholder="e.g. Capgemini"
                    required
                  />
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Verdict *</label>
                  <select 
                    className="form-select" 
                    value={verdict} 
                    onChange={(e) => setVerdict(e.target.value)}
                  >
                    <option value="Selected">Selected</option>
                    <option value="On Hold / Waiting">On Hold / Waiting</option>
                    <option value="Not Selected">Not Selected</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Interview Difficulty *</label>
                  <select 
                    className="form-select" 
                    value={difficulty} 
                    onChange={(e) => setDifficulty(e.target.value)}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="rounds-section-title">
                <span>Rounds & Questions Asked</span>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }} 
                  onClick={handleAddRound}
                >
                  + Add Round
                </button>
              </div>

              {rounds.map((round, idx) => (
                <div key={idx} className="round-form-item">
                  {rounds.length > 1 && (
                    <button 
                      type="button" 
                      className="remove-round-btn"
                      onClick={() => handleRemoveRound(idx)}
                    >
                      Remove
                    </button>
                  )}
                  <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Round Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={round.name} 
                      onChange={(e) => handleRoundChange(idx, 'name', e.target.value)}
                      placeholder="e.g. Coding Test, Technical Panel"
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: '0' }}>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Summary / Questions Asked *</label>
                    <textarea 
                      className="form-textarea" 
                      style={{ minHeight: '60px' }}
                      value={round.summary} 
                      onChange={(e) => handleRoundChange(idx, 'summary', e.target.value)}
                      placeholder="Describe what questions were asked, patterns, online platform, timing, etc."
                      required
                    />
                  </div>
                </div>
              ))}

              <div className="form-group">
                <label className="form-label">Your Tips & Resource Recommendations *</label>
                <textarea 
                  className="form-textarea" 
                  value={tips} 
                  onChange={(e) => setTips(e.target.value)} 
                  placeholder="Which topics should freshers focus on? Any channel playlists or notes that helped you?"
                  required
                />
              </div>

              <div className="submit-btn-row">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Experience
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
