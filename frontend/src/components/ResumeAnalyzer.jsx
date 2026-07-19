import React, { useState } from 'react';

export default function ResumeAnalyzer({ apiUrl = '' }) {
  const [resumeText, setResumeText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMode, setUploadMode] = useState('file'); // 'file' or 'text'
  const [targetCompany, setTargetCompany] = useState('Cognizant');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState('');
  const [results, setResults] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file) => {
    const filename = file.name.toLowerCase();
    if (filename.endsWith('.pdf') || filename.endsWith('.docx') || filename.endsWith('.txt')) {
      setSelectedFile(file);
    } else {
      alert("Unsupported file format! Please upload a PDF (.pdf), Word (.docx), or Text (.txt) file.");
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
  };

  const handleAnalyze = async () => {
    if (uploadMode === 'file' && !selectedFile) {
      alert("Please upload a resume file (.pdf, .docx, .txt) to analyze!");
      return;
    }
    if (uploadMode === 'text' && !resumeText.trim()) {
      alert("Please paste your resume text to analyze!");
      return;
    }

    setAnalyzing(true);
    setResults(null);
    
    // Simulated UI steps for premium feel
    const steps = [
      "Parsing resume file format...",
      "Extracting text content...",
      "Analyzing document structure...",
      "Matching keyword metrics...",
      "Calculating ATS compatibility score..."
    ];
    
    let stepIdx = 0;
    setAnalysisStep(steps[0]);
    
    const interval = setInterval(() => {
      stepIdx += 1;
      if (stepIdx < steps.length) {
        setAnalysisStep(steps[stepIdx]);
      } else {
        clearInterval(interval);
      }
    }, 350);

    try {
      const formData = new FormData();
      formData.append('company', targetCompany);

      if (uploadMode === 'file' && selectedFile) {
        formData.append('file', selectedFile);
      } else {
        formData.append('text', resumeText);
      }

      // Call Python FastAPI parser backend
      const endpoint = `${apiUrl}/api/analyze-resume`;
      const res = await fetch(endpoint, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Server error analyzing resume.");
      }

      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      alert(`Analysis Failed: ${err.message}`);
    } finally {
      clearInterval(interval);
      setAnalyzing(false);
    }
  };

  return (
    <div className="resume-analyzer-wrapper">
      <style>{`
        .analyzer-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-top: 1rem;
        }
        @media (max-width: 1024px) {
          .analyzer-grid {
            grid-template-columns: 1fr;
          }
        }
        .input-panel {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-glass);
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .results-panel {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-glass);
          border-radius: 16px;
          padding: 1.5rem;
          color: #fff;
          min-height: 400px;
        }
        .upload-selector {
          display: flex;
          background: rgba(255,255,255,0.02);
          border-radius: 8px;
          padding: 0.25rem;
          border: 1px solid var(--border-glass);
        }
        .upload-tab {
          flex: 1;
          background: none;
          border: none;
          color: var(--text-muted);
          padding: 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          border-radius: 6px;
          transition: background 0.2s, color 0.2s;
        }
        .upload-tab.active {
          background: rgba(255,255,255,0.08);
          color: #fff;
        }
        
        /* Drag & Drop File Zone */
        .dropzone {
          border: 2px dashed var(--border-glass);
          border-radius: 12px;
          padding: 2.5rem 1rem;
          text-align: center;
          background: rgba(255,255,255,0.01);
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          position: relative;
        }
        .dropzone.active {
          border-color: var(--primary);
          background: rgba(6, 182, 212, 0.05);
        }
        .dropzone-text {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-top: 0.75rem;
        }
        
        .selected-file-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border-glass);
          padding: 0.75rem 1rem;
          border-radius: 8px;
        }
        
        .score-circle-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: rgba(255,255,255,0.01);
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.03);
        }
        .score-circle {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          border: 8px solid #cbd5e1;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 1.75rem;
          font-weight: 800;
          font-family: var(--font-heading);
          margin-bottom: 0.5rem;
        }
        .score-circle.low { border-color: var(--danger); color: var(--danger); }
        .score-circle.med { border-color: #f59e0b; color: #f59e0b; }
        .score-circle.high { border-color: var(--success); color: var(--success); }
        
        .checklist-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }
        .checklist-icon {
          font-weight: bold;
        }
        .checklist-icon.pass { color: var(--success); }
        .checklist-icon.fail { color: var(--danger); }
        
        .recommendation-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .recommendation-item {
          padding: 0.75rem;
          background: rgba(239, 68, 68, 0.05);
          border-left: 3px solid var(--danger);
          border-radius: 0 8px 8px 0;
          font-size: 0.85rem;
          line-height: 1.4;
          margin-bottom: 0.5rem;
          color: var(--text-secondary);
        }
        .recommendation-item.success-item {
          background: rgba(16, 185, 129, 0.05);
          border-left-color: var(--success);
          color: #fff;
        }
      `}</style>

      <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '1.5rem' }}>AI Resume Analyzer (ATS Checker)</h3>

      <div className="analyzer-grid">
        {/* Input Text Area Panel */}
        <div className="input-panel">
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 500 }}>
              Select Target Placement:
            </label>
            <select 
              value={targetCompany} 
              onChange={(e) => setTargetCompany(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem', background: '#0a0d1a', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem' }}
            >
              <option value="Cognizant">Cognizant GenC / Elevate</option>
              <option value="TCS">TCS NQT (Ninja/Digital/Prime)</option>
              <option value="Accenture">Accenture ASE/FSE</option>
              <option value="General">General Technical ATS Standard</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 500 }}>
              Analysis Input Method:
            </label>
            <div className="upload-selector">
              <button 
                type="button"
                className={`upload-tab ${uploadMode === 'file' ? 'active' : ''}`}
                onClick={() => { setUploadMode('file'); setResults(null); }}
              >
                Upload PDF / Word File
              </button>
              <button 
                type="button"
                className={`upload-tab ${uploadMode === 'text' ? 'active' : ''}`}
                onClick={() => { setUploadMode('text'); setResults(null); }}
              >
                Paste Resume Text
              </button>
            </div>
          </div>

          {uploadMode === 'file' ? (
            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {!selectedFile ? (
                <div 
                  className={`dropzone ${dragActive ? 'active' : ''}`} 
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('resume-file-input').click()}
                >
                  <input 
                    id="resume-file-input"
                    type="file" 
                    accept=".pdf,.docx,.txt" 
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  <svg viewBox="0 0 24 24" width="40" height="40" stroke="var(--primary)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto', opacity: 0.8 }}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  <p className="dropzone-text">
                    Drag & drop your resume file here or <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Browse files</span>
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Supports: PDF, DOCX, TXT (Max 10MB)</p>
                </div>
              ) : (
                <div className="selected-file-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="var(--primary)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: '500', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {selectedFile.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </div>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={clearFile}
                    style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
                  >
                    Change File
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <textarea
                rows="10"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Copy everything from your resume document (PDF or Word) and paste it here..."
                style={{ width: '100%', flexGrow: 1, padding: '1rem', background: 'rgba(255, 255, 255, 0.01)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#fff', fontSize: '0.85rem', lineHeight: 1.5, resize: 'none' }}
              />
            </div>
          )}

          <button 
            className="btn btn-primary" 
            onClick={handleAnalyze} 
            disabled={analyzing}
            style={{ width: '100%', padding: '0.8rem' }}
          >
            {analyzing ? "Running Diagnostics..." : "Analyze ATS & Compatibility"}
          </button>
        </div>

        {/* Results Analysis Panel */}
        <div className="results-panel">
          {analyzing && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', alignItems: 'center', padding: '5rem 0' }}>
              <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '1.5rem' }}></div>
              <p style={{ color: '#fff', fontWeight: '500', fontSize: '0.95rem' }}>{analysisStep}</p>
            </div>
          )}

          {!analyzing && !results && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', alignItems: 'center', textAlign: 'center', color: 'var(--text-muted)', padding: '5rem 0' }}>
              <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem', opacity: 0.5 }}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>No Analysis Performed</h4>
              <p style={{ fontSize: '0.85rem', maxWidth: '300px' }}>Upload your resume file (.pdf, .docx) or paste plain text on the left to evaluate your placement readiness score.</p>
            </div>
          )}

          {!analyzing && results && (
            <div>
              {/* Score Header */}
              <div className="score-circle-wrapper">
                <div className={`score-circle ${results.score < 55 ? 'low' : results.score < 80 ? 'med' : 'high'}`}>
                  {results.score}%
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#fff' }}>ATS Score Estimate</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  {results.score < 55 ? 'Critical adjustments needed' : results.score < 80 ? 'Good, minor fixes suggested' : 'Excellent placement readiness'}
                </div>
              </div>

              {/* Sections Checklist */}
              <h4 style={{ fontSize: '0.95rem', color: '#fff', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>Checklist Analysis</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <div>
                  <div className="checklist-item">
                    <span className={`checklist-icon ${results.hasEmail ? 'pass' : 'fail'}`}>{results.hasEmail ? '✓' : '✗'}</span>
                    <span style={{ color: results.hasEmail ? '#fff' : 'var(--text-muted)' }}>Email Address</span>
                  </div>
                  <div className="checklist-item">
                    <span className={`checklist-icon ${results.hasPhone ? 'pass' : 'fail'}`}>{results.hasPhone ? '✓' : '✗'}</span>
                    <span style={{ color: results.hasPhone ? '#fff' : 'var(--text-muted)' }}>Phone Number</span>
                  </div>
                  <div className="checklist-item">
                    <span className={`checklist-icon ${results.hasLinkedIn ? 'pass' : 'fail'}`}>{results.hasLinkedIn ? '✓' : '✗'}</span>
                    <span style={{ color: results.hasLinkedIn ? '#fff' : 'var(--text-muted)' }}>LinkedIn Link</span>
                  </div>
                  <div className="checklist-item">
                    <span className={`checklist-icon ${results.hasGitHub ? 'pass' : 'fail'}`}>{results.hasGitHub ? '✓' : '✗'}</span>
                    <span style={{ color: results.hasGitHub ? '#fff' : 'var(--text-muted)' }}>GitHub Link</span>
                  </div>
                </div>

                <div>
                  <div className="checklist-item">
                    <span className={`checklist-icon ${results.hasEducation ? 'pass' : 'fail'}`}>{results.hasEducation ? '✓' : '✗'}</span>
                    <span style={{ color: results.hasEducation ? '#fff' : 'var(--text-muted)' }}>Education Section</span>
                  </div>
                  <div className="checklist-item">
                    <span className={`checklist-icon ${results.hasExperience ? 'pass' : 'fail'}`}>{results.hasExperience ? '✓' : '✗'}</span>
                    <span style={{ color: results.hasExperience ? '#fff' : 'var(--text-muted)' }}>Experience Block</span>
                  </div>
                  <div className="checklist-item">
                    <span className={`checklist-icon ${results.hasProjects ? 'pass' : 'fail'}`}>{results.hasProjects ? '✓' : '✗'}</span>
                    <span style={{ color: results.hasProjects ? '#fff' : 'var(--text-muted)' }}>Projects Section</span>
                  </div>
                  <div className="checklist-item">
                    <span className={`checklist-icon ${results.hasSkills ? 'pass' : 'fail'}`}>{results.hasSkills ? '✓' : '✗'}</span>
                    <span style={{ color: results.hasSkills ? '#fff' : 'var(--text-muted)' }}>Skills Section</span>
                  </div>
                </div>
              </div>

              {/* Action Plan */}
              <h4 style={{ fontSize: '0.95rem', color: '#fff', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>Personalized Action Plan</h4>
              {results.recommendations.length === 0 ? (
                <div className="recommendation-item success-item">
                  ✓ Great job! Your resume contains all standard ATS checkpoints and matches core technical formatting guidelines.
                </div>
              ) : (
                <ul className="recommendation-list">
                  {results.recommendations.map((rec, idx) => (
                    <li key={idx} className="recommendation-item">
                      ⚠️ {rec}
                    </li>
                  ))}
                </ul>
              )}

              {/* Company Specific Advice */}
              <h4 style={{ fontSize: '0.95rem', color: '#fff', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem', marginBottom: '0.75rem', marginTop: '1.5rem' }}>
                Target Placement Strategy ({targetCompany})
              </h4>
              <div style={{ background: 'rgba(6, 182, 212, 0.05)', borderLeft: '3px solid var(--primary)', padding: '1rem', borderRadius: '0 8px 8px 0', fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
                {results.companyAdvice}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
