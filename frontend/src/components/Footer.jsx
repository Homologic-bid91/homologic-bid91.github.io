import React from 'react';

export default function Footer({ setActiveTab }) {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h3>Virtual Gyans</h3>
          <p>
            An educational initiative to help freshers navigate company onboarding, interview rounds, and tech requirements for top hiring entities.
          </p>
        </div>
        
        <div className="footer-links">
          <h4>Navigation</h4>
          <ul>
            <li><a href="#home" onClick={(e) => { e.preventDefault(); setActiveTab('home'); }}>Home</a></li>
            <li><a href="#videos" onClick={(e) => { e.preventDefault(); setActiveTab('videos'); }}>Videos</a></li>
            <li><a href="#guides" onClick={(e) => { e.preventDefault(); setActiveTab('guides'); }}>Placement Guides</a></li>
            <li><a href="#experiences" onClick={(e) => { e.preventDefault(); setActiveTab('experiences'); }}>Interview Experiences</a></li>
            <li><a href="#tools" onClick={(e) => { e.preventDefault(); setActiveTab('tools'); }}>Tracker & Tools</a></li>
          </ul>
        </div>
        
        <div className="footer-links">
          <h4>Connect</h4>
          <ul>
            <li>
              <a href="https://www.youtube.com/c/virtualgyans" target="_blank" rel="noopener noreferrer">
                YouTube Channel
              </a>
            </li>
            <li>
              <a href="https://t.me/virtualgyans" target="_blank" rel="noopener noreferrer">
                Telegram Channel
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => { e.preventDefault(); alert("Email: contact@virtualgyans.me"); }}>
                Email: contact@virtualgyans.me
              </a>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div>&copy; {new Date().getFullYear()} Virtual Gyans. All rights reserved.</div>
        <div>
          Designed for <a href="https://www.virtualgyans.me" style={{ color: 'var(--primary)', textDecoration: 'none' }}>virtualgyans.me</a>
        </div>
      </div>
    </footer>
  );
}
