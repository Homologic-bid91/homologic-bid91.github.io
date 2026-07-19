import React, { useState } from 'react';

export default function ResumeBuilder() {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    experience: [
      { company: '', role: '', duration: '', desc: '' }
    ],
    education: [
      { school: '', degree: '', year: '', grade: '' }
    ],
    projects: [
      { name: '', tech: '', desc: '' }
    ],
    skills: ''
  });

  const [activeStep, setActiveStep] = useState(0);

  const loadSampleData = () => {
    setFormData({
      name: 'Md Irfan',
      title: 'Full Stack Software Engineer',
      email: 'virtualgyans@gmail.com',
      phone: '+91 98765 43210',
      linkedin: 'linkedin.com/in/virtualgyans',
      github: 'github.com/mdirfancse2023',
      experience: [
        {
          company: 'Virtual Gyans (Tech Channel)',
          role: 'Technical Educator & Founder',
          duration: '2023 - Present',
          desc: 'Created recruitment preparation blueprints and placement guides for Cognizant, TCS, and Accenture. Taught Java, SQL, and DSA concepts to 10k+ candidates.'
        },
        {
          company: 'Corporate Internships',
          role: 'Junior Frontend Developer',
          duration: 'Jan 2023 - Jun 2023',
          desc: 'Built responsive web platforms using React and CSS Grid. Optimized site performance, reducing LCP by 25% and improving accessibility scores.'
        }
      ],
      education: [
        {
          school: 'ABC Technical University',
          degree: 'B.Tech in Computer Science',
          year: '2020 - 2024',
          grade: '8.7 CGPA'
        }
      ],
      projects: [
        {
          name: 'Interactive Onboarding Timelines',
          tech: 'React, Vite, CSS-in-JS',
          desc: 'Created an onboarding progress tracker helping candidate engineers navigate corporate hiring milestones seamlessly.'
        },
        {
          name: '3D Technical Quiz System',
          tech: 'Vanilla JS, CSS 3D Transforms',
          desc: 'Designed a flashcard-based self-evaluation quiz with smooth card flip physics and custom result metrics.'
        }
      ],
      skills: 'Java, Python, Javascript, React.js, FastAPI, SQL, Git, DSA, Agile, SDLC'
    });
  };

  const handleChange = (e, section = null, index = null, field = null) => {
    if (section) {
      const updatedSection = [...formData[section]];
      updatedSection[index][field] = e.target.value;
      setFormData({ ...formData, [section]: updatedSection });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const addField = (section, template) => {
    setFormData({
      ...formData,
      [section]: [...formData[section], template]
    });
  };

  const removeField = (section, index) => {
    if (formData[section].length > 1) {
      const updatedSection = formData[section].filter((_, idx) => idx !== index);
      setFormData({ ...formData, [section]: updatedSection });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const steps = ['Personal Details', 'Experience', 'Education', 'Projects & Skills'];

  return (
    <div className="resume-builder-wrapper">
      <style>{`
        .resume-builder-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-top: 1rem;
        }
        @media (max-width: 1024px) {
          .resume-builder-grid {
            grid-template-columns: 1fr;
          }
        }
        .form-panel {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-glass);
          border-radius: 16px;
          padding: 1.5rem;
        }
        .preview-panel {
          background: #ffffff;
          color: #0f172a;
          border-radius: 8px;
          padding: 3rem;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          font-family: 'Arial', 'Helvetica', sans-serif;
          min-height: 800px;
          height: fit-content;
          position: sticky;
          top: 2rem;
          line-height: 1.4;
        }
        .form-group {
          margin-bottom: 1.25rem;
        }
        .form-group label {
          display: block;
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        .form-group input, .form-group textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-glass);
          border-radius: 8px;
          color: #fff;
          font-size: 0.9rem;
          transition: border-color 0.2s;
        }
        .form-group input:focus, .form-group textarea:focus {
          border-color: var(--primary);
          outline: none;
        }
        .step-indicators {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid var(--border-glass);
          padding-bottom: 1rem;
        }
        .step-tab {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          position: relative;
          padding: 0.25rem 0.5rem;
        }
        .step-tab.active {
          color: var(--primary);
        }
        .step-tab.active::after {
          content: '';
          position: absolute;
          bottom: -1rem;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--primary);
        }
        
        /* Print Stylesheet integration */
        @media print {
          body * {
            visibility: hidden;
          }
          .preview-panel, .preview-panel * {
            visibility: visible;
          }
          .preview-panel {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0;
            margin: 0;
            box-shadow: none;
            color: #000;
          }
        }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ color: '#fff', fontSize: '1.25rem' }}>Dynamic Resume Builder</h3>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={loadSampleData} style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
            Load Sample Data
          </button>
          <button className="btn btn-primary" onClick={handlePrint} style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
            Download PDF / Print
          </button>
        </div>
      </div>

      <div className="resume-builder-grid">
        {/* Form Inputs Panel */}
        <div className="form-panel">
          <div className="step-indicators">
            {steps.map((step, idx) => (
              <button 
                key={idx} 
                className={`step-tab ${activeStep === idx ? 'active' : ''}`}
                onClick={() => setActiveStep(idx)}
              >
                {idx + 1}. {step}
              </button>
            ))}
          </div>

          {activeStep === 0 && (
            <div>
              <h4 style={{ color: '#fff', marginBottom: '1rem' }}>Personal Contact Info</h4>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Md Irfan" />
              </div>
              <div className="form-group">
                <label>Professional Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Software Engineer Intern" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="virtualgyans@gmail.com" />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>LinkedIn URL</label>
                  <input type="text" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="linkedin.com/in/username" />
                </div>
                <div className="form-group">
                  <label>GitHub Profile URL</label>
                  <input type="text" name="github" value={formData.github} onChange={handleChange} placeholder="github.com/username" />
                </div>
              </div>
            </div>
          )}

          {activeStep === 1 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ color: '#fff' }}>Work Experience / Internships</h4>
                <button 
                  className="btn btn-secondary" 
                  style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}
                  onClick={() => addField('experience', { company: '', role: '', duration: '', desc: '' })}
                >
                  + Add Experience
                </button>
              </div>

              {formData.experience.map((exp, idx) => (
                <div key={idx} style={{ border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', background: 'rgba(255,255,255,0.01)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.85rem' }}>Position #{idx + 1}</span>
                    {formData.experience.length > 1 && (
                      <button 
                        style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.8rem' }}
                        onClick={() => removeField('experience', idx)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Company Name</label>
                    <input type="text" value={exp.company} onChange={(e) => handleChange(e, 'experience', idx, 'company')} placeholder="e.g. Cognizant" />
                  </div>
                  <div className="form-group">
                    <label>Role Title</label>
                    <input type="text" value={exp.role} onChange={(e) => handleChange(e, 'experience', idx, 'role')} placeholder="e.g. Software Engineer Intern" />
                  </div>
                  <div className="form-group">
                    <label>Duration</label>
                    <input type="text" value={exp.duration} onChange={(e) => handleChange(e, 'experience', idx, 'duration')} placeholder="e.g. Jan 2023 - Present" />
                  </div>
                  <div className="form-group">
                    <label>Job Description</label>
                    <textarea rows="3" value={exp.desc} onChange={(e) => handleChange(e, 'experience', idx, 'desc')} placeholder="Describe your achievements and key deliverables..." />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeStep === 2 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ color: '#fff' }}>Education Details</h4>
                <button 
                  className="btn btn-secondary" 
                  style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}
                  onClick={() => addField('education', { school: '', degree: '', year: '', grade: '' })}
                >
                  + Add Education
                </button>
              </div>

              {formData.education.map((edu, idx) => (
                <div key={idx} style={{ border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', background: 'rgba(255,255,255,0.01)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.85rem' }}>Education #{idx + 1}</span>
                    {formData.education.length > 1 && (
                      <button 
                        style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.8rem' }}
                        onClick={() => removeField('education', idx)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="form-group">
                    <label>College / University / School Name</label>
                    <input type="text" value={edu.school} onChange={(e) => handleChange(e, 'education', idx, 'school')} placeholder="e.g. ABC Tech Institute" />
                  </div>
                  <div className="form-group">
                    <label>Degree & Stream</label>
                    <input type="text" value={edu.degree} onChange={(e) => handleChange(e, 'education', idx, 'degree')} placeholder="e.g. B.Tech in CSE" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label>Year of Study</label>
                      <input type="text" value={edu.year} onChange={(e) => handleChange(e, 'education', idx, 'year')} placeholder="e.g. 2020 - 2024" />
                    </div>
                    <div className="form-group">
                      <label>CGPA / Percentage</label>
                      <input type="text" value={edu.grade} onChange={(e) => handleChange(e, 'education', idx, 'grade')} placeholder="e.g. 8.5 CGPA" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeStep === 3 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ color: '#fff' }}>Key Projects</h4>
                <button 
                  className="btn btn-secondary" 
                  style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}
                  onClick={() => addField('projects', { name: '', tech: '', desc: '' })}
                >
                  + Add Project
                </button>
              </div>

              {formData.projects.map((proj, idx) => (
                <div key={idx} style={{ border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', background: 'rgba(255,255,255,0.01)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.85rem' }}>Project #{idx + 1}</span>
                    {formData.projects.length > 1 && (
                      <button 
                        style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.8rem' }}
                        onClick={() => removeField('projects', idx)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Project Name</label>
                    <input type="text" value={proj.name} onChange={(e) => handleChange(e, 'projects', idx, 'name')} placeholder="e.g. Portfolio Website" />
                  </div>
                  <div className="form-group">
                    <label>Technologies Used</label>
                    <input type="text" value={proj.tech} onChange={(e) => handleChange(e, 'projects', idx, 'tech')} placeholder="e.g. React.js, Vite, CSS Grid" />
                  </div>
                  <div className="form-group">
                    <label>Short Description</label>
                    <textarea rows="2" value={proj.desc} onChange={(e) => handleChange(e, 'projects', idx, 'desc')} placeholder="Explain project core deliverables and metrics..." />
                  </div>
                </div>
              ))}

              <h4 style={{ color: '#fff', marginTop: '1.5rem', marginBottom: '1rem' }}>Technical Skills</h4>
              <div className="form-group">
                <label>List Skills (Comma Separated)</label>
                <textarea rows="3" name="skills" value={formData.skills} onChange={handleChange} placeholder="e.g. Java, SQL, Python, Git, HTML, CSS" />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
            <button 
              className="btn btn-secondary" 
              disabled={activeStep === 0} 
              onClick={() => setActiveStep((prev) => prev - 1)}
              style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
            >
              Back
            </button>
            <button 
              className="btn btn-primary" 
              disabled={activeStep === steps.length - 1} 
              onClick={() => setActiveStep((prev) => prev + 1)}
              style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
            >
              Next Step
            </button>
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="preview-panel">
          {/* Header */}
          <div style={{ textAlign: 'center', borderBottom: '1.5px solid #000000', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '20pt', fontWeight: 'bold', margin: 0, color: '#000000', letterSpacing: '-0.02em', fontFamily: 'Arial, sans-serif' }}>
              {formData.name || 'YOUR NAME'}
            </h2>
            <p style={{ fontSize: '11pt', fontWeight: 'bold', color: '#1e293b', margin: '0.2rem 0 0.4rem 0', fontFamily: 'Arial, sans-serif' }}>
              {formData.title || 'Professional Title'}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem', fontSize: '9.5pt', color: '#334155', fontFamily: 'Arial, sans-serif' }}>
              {formData.email && <span>{formData.email}</span>}
              {formData.email && (formData.phone || formData.linkedin || formData.github) && <span>•</span>}
              {formData.phone && <span>{formData.phone}</span>}
              {formData.phone && (formData.linkedin || formData.github) && <span>•</span>}
              {formData.linkedin && <span>{formData.linkedin}</span>}
              {formData.linkedin && formData.github && <span>•</span>}
              {formData.github && <span>{formData.github}</span>}
            </div>
          </div>

          {/* Education */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '12pt', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #000000', paddingBottom: '0.15rem', marginBottom: '0.5rem', color: '#000000', fontFamily: 'Arial, sans-serif' }}>
              Education
            </h3>
            {formData.education.map((edu, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10pt', marginBottom: '0.25rem', color: '#111111', fontFamily: 'Arial, sans-serif' }}>
                <div>
                  <strong>{edu.school || 'School/University'}</strong> — {edu.degree || 'Degree'}
                </div>
                <div style={{ textAlign: 'right', fontSize: '9.5pt', color: '#334155' }}>
                  <span>{edu.year || 'Duration'}</span> | <strong>{edu.grade || 'Grade'}</strong>
                </div>
              </div>
            ))}
          </div>

          {/* Work Experience */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '12pt', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #000000', paddingBottom: '0.15rem', marginBottom: '0.5rem', color: '#000000', fontFamily: 'Arial, sans-serif' }}>
              Experience
            </h3>
            {formData.experience.map((exp, idx) => (
              <div key={idx} style={{ marginBottom: '0.75rem', fontSize: '10pt', color: '#111111', fontFamily: 'Arial, sans-serif' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#000000' }}>
                  <span>{exp.role || 'Job Role'}</span>
                  <span style={{ fontWeight: 'normal', color: '#334155', fontSize: '9.5pt' }}>{exp.duration || 'Duration'}</span>
                </div>
                <div style={{ fontStyle: 'italic', color: '#334155', marginBottom: '0.25rem' }}>{exp.company || 'Company'}</div>
                <p style={{ color: '#111111', margin: 0, lineHeight: 1.4 }}>{exp.desc || 'Responsibilities and highlights...'}</p>
              </div>
            ))}
          </div>

          {/* Projects */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '12pt', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #000000', paddingBottom: '0.15rem', marginBottom: '0.5rem', color: '#000000', fontFamily: 'Arial, sans-serif' }}>
              Key Projects
            </h3>
            {formData.projects.map((proj, idx) => (
              <div key={idx} style={{ marginBottom: '0.75rem', fontSize: '10pt', color: '#111111', fontFamily: 'Arial, sans-serif' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#000000' }}>
                  <span>{proj.name || 'Project Name'}</span>
                  <span style={{ fontStyle: 'italic', fontWeight: 'normal', color: '#334155', fontSize: '9.5pt' }}>{proj.tech || 'Technologies'}</span>
                </div>
                <p style={{ color: '#111111', margin: 0, lineHeight: 1.4 }}>{proj.desc || 'Project description and outcomes...'}</p>
              </div>
            ))}
          </div>

          {/* Technical Skills */}
          <div>
            <h3 style={{ fontSize: '12pt', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #000000', paddingBottom: '0.15rem', marginBottom: '0.5rem', color: '#000000', fontFamily: 'Arial, sans-serif' }}>
              Technical Skills
            </h3>
            <p style={{ fontSize: '10pt', color: '#111111', margin: 0, lineHeight: 1.4, fontFamily: 'Arial, sans-serif' }}>
              {formData.skills || 'Java, Python, SQL, React.js...'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
