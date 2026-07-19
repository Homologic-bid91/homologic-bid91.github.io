import React from 'react';
import logoImg from '../assets/logo.png';

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
          <img 
            src={logoImg} 
            alt="Virtual Gyans Logo" 
            style={{ width: '32px', height: '32px', objectFit: 'contain' }} 
          />
          Virtual Gyans
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
              >
                <path 
                  d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837z" 
                  fill="#FF0000" 
                />
                <polygon 
                  points="9.545 15.568 15.818 12 9.545 8.432" 
                  fill="#FFFFFF" 
                />
              </svg>
              Subscribe
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
