import React, { useState } from 'react';

export default function InteractiveTools({ onboardingStages, flashcards }) {
  const [activeTool, setActiveTool] = useState('tracker'); // 'tracker' or 'flashcards'
  
  // Tracker State
  const [selectedCompany, setSelectedCompany] = useState('Cognizant');
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  // Flashcards State
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Filter flashcards
  const categories = ['All', 'Java', 'SQL', 'DSA'];
  const filteredCards = flashcards.filter(card => {
    if (selectedCategory === 'All') return true;
    return card.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const currentCard = filteredCards[currentCardIndex];

  const handleNextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev + 1) % filteredCards.length);
    }, 150);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
    }, 150);
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const activeStages = onboardingStages[selectedCompany] || [];

  return (
    <div style={{ marginBottom: '3rem' }}>
      <div className="section-header">
        <div className="section-info">
          <h2 className="section-title">Interactive <span className="text-gradient">Candidate Tools</span></h2>
          <p className="section-desc">Try our interactive tools designed to help you track your corporate onboarding and quiz yourself for upcoming technical tests.</p>
        </div>
      </div>

      <div className="filters-wrapper" style={{ marginBottom: '2.5rem' }}>
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${activeTool === 'tracker' ? 'active' : ''}`}
            onClick={() => setActiveTool('tracker')}
          >
            Onboarding Tracker
          </button>
          <button 
            className={`filter-tab ${activeTool === 'flashcards' ? 'active' : ''}`}
            onClick={() => setActiveTool('flashcards')}
          >
            Technical Flashcards
          </button>
        </div>
      </div>

      {activeTool === 'tracker' ? (
        <div className="glass-panel tracker-container">
          <div className="tracker-select-row">
            <h3 style={{ fontSize: '1.25rem', color: '#fff' }}>Select Company Journey:</h3>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {Object.keys(onboardingStages).map((comp) => (
                <button
                  key={comp}
                  className={`btn ${selectedCompany === comp ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}
                  onClick={() => {
                    setSelectedCompany(comp);
                    setCurrentStageIndex(0);
                  }}
                >
                  {comp}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem', marginTop: '2rem' }}>
            <div className="timeline">
              {activeStages.map((stage, idx) => (
                <div 
                  key={idx} 
                  className="timeline-item"
                  style={{ cursor: 'pointer', opacity: currentStageIndex === idx ? 1 : 0.6 }}
                  onClick={() => setCurrentStageIndex(idx)}
                >
                  <div className="timeline-dot" style={{ 
                    borderColor: currentStageIndex === idx ? 'var(--primary)' : 'var(--border-glass)',
                    background: currentStageIndex === idx ? 'var(--primary)' : 'rgba(255,255,255,0.1)'
                  }}></div>
                  <div className="timeline-title">
                    {stage.stage}
                    <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>{stage.duration}</span>
                  </div>
                  <div className="timeline-desc">{stage.desc.substring(0, 80)}...</div>
                </div>
              ))}
            </div>

            <div className="glass-card" style={{ background: 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', height: 'fit-content' }}>
              <div className="badge badge-primary" style={{ marginBottom: '1rem', width: 'fit-content' }}>
                Stage Details & Advice
              </div>
              {activeStages[currentStageIndex] && (
                <>
                  <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                    {activeStages[currentStageIndex].stage}
                  </h3>
                  <div style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: '600', marginBottom: '1rem' }}>
                    Duration: {activeStages[currentStageIndex].duration}
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                    {activeStages[currentStageIndex].desc}
                  </p>
                  <div style={{ background: 'rgba(6, 182, 212, 0.05)', borderLeft: '3px solid var(--primary)', padding: '1rem', borderRadius: '0 8px 8px 0', fontSize: '0.85rem' }}>
                    <strong>Pro Gyan Tip:</strong> If your files have been in verification for more than {activeStages[currentStageIndex].duration}, reach out to support or check your onboarding dashboard for action items.
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-panel flashcards-container">
          <div className="flashcard-categories">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-tab ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {filteredCards.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>No flashcards found for this category.</div>
          ) : (
            <>
              <div 
                className={`flashcard-stage ${isFlipped ? 'flipped' : ''}`}
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <div className="flashcard-inner">
                  <div className="flashcard-front">
                    <span className="flashcard-tag">{currentCard.category}</span>
                    <h3 className="flashcard-question">{currentCard.question}</h3>
                    <div className="flashcard-hint">Click card to reveal answer</div>
                  </div>
                  <div className="flashcard-back">
                    <span className="flashcard-tag" style={{ color: 'var(--secondary)' }}>Answer</span>
                    <p className="flashcard-answer">{currentCard.answer}</p>
                    <div className="flashcard-hint" style={{ color: 'var(--secondary)' }}>Click card to see question</div>
                  </div>
                </div>
              </div>

              <div className="flashcard-controls">
                <button className="btn btn-secondary" onClick={handlePrevCard}>
                  ← Previous
                </button>
                <span className="flashcard-progress">
                  Card {currentCardIndex + 1} of {filteredCards.length}
                </span>
                <button className="btn btn-secondary" onClick={handleNextCard}>
                  Next →
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
