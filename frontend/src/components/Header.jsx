import React from 'react';

export default function Header({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'videos', label: 'Videos' },
    { id: 'guides', label: 'Placement Prep' },
    { id: 'experiences', label: 'Interview Logs' },
    { id: 'tools', label: 'Tracker & Tools' }
  ];

  return (
    <nav className="navbar">
      <div className="nav-container">
        <a href="#home" className="logo" onClick={() => setActiveTab('home')}>
          Virtual Gyans
          <span className="logo-dot"></span>
        </a>
        
        <ul className="nav-links">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                className={`nav-link ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
                style={{ background: 'transparent', border: 'none', fontInherit: 'inherit' }}
              >
                {item.label}
              </button>
            </li>
          ))}
          <li>
            <a 
              href="https://www.youtube.com/c/virtualgyans" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-primary"
              style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
            >
              <svg 
                viewBox="0 0 24 24" 
                width="16" 
                height="16" 
                stroke="currentColor" 
                strokeWidth="2" 
                fill="currentColor" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
              </svg>
              Subscribe
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
