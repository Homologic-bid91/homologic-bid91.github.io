import React, { useState } from 'react';

export default function VideoGrid({ videos }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);

  const categories = [
    { id: 'all', label: 'All Videos' },
    { id: 'Placement Prep', label: 'Placement Prep' },
    { id: 'Technical', label: 'Technical' }
  ];

  // Helper to get YouTube Video ID from different URL formats
  const getEmbedUrl = (video) => {
    // If the ID is already short, use it. Otherwise, parse it
    const id = video.id;
    if (id && id.length < 15 && !id.includes('watch')) {
      return `https://www.youtube.com/embed/${id}`;
    }
    // Fallback parser if videoUrl is present
    const url = video.videoUrl || '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : 'dQw4w9WgXcQ';
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const filteredVideos = videos.filter((video) => {
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          video.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div style={{ marginBottom: '3rem' }}>
      <div className="section-header">
        <div className="section-info">
          <h2 className="section-title">Latest <span className="text-gradient">Tutorials & Updates</span></h2>
          <p className="section-desc">Browse through our latest uploads on hiring notifications, career development, and coding.</p>
        </div>
      </div>

      <div className="filters-wrapper">
        <div className="filter-tabs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`filter-tab ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="search-box">
          <svg className="search-icon" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredVideos.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem', opacity: 0.5 }}>
            <video cx="12" cy="12" r="10"></video>
            <line x1="2" y1="2" x2="22" y2="22"></line>
          </svg>
          <h3>No videos found matching your query</h3>
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>Try refining your search terms or changing the active tab.</p>
        </div>
      ) : (
        <div className="grid-container">
          {filteredVideos.map((video) => (
            <div 
              key={video.id} 
              className="glass-card video-card"
              onClick={() => setSelectedVideo(video)}
            >
              <div className="video-thumb-container">
                <img 
                  src={video.thumbnailUrl} 
                  alt={video.title} 
                  className="video-thumb" 
                  loading="lazy"
                />
                {video.duration && video.duration !== 'N/A' && (
                  <span className="video-duration">{video.duration}</span>
                )}
              </div>
              
              <div className="video-body">
                <div className="video-meta">
                  <span className={`badge ${video.category === 'Technical' ? 'badge-secondary' : 'badge-primary'}`}>
                    {video.category}
                  </span>
                  {video.views && video.views !== 'N/A' && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{video.views} views</span>
                  )}
                </div>
                <h3 className="video-title">{video.title}</h3>
                <p className="video-desc">{video.description}</p>
                <div className="video-footer">
                  <span>{formatDate(video.publishedAt)}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary)', fontWeight: '600' }}>
                    Watch
                    <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Detail Modal */}
      {selectedVideo && (
        <div className="modal-overlay" onClick={() => setSelectedVideo(null)}>
          <div className="glass-panel modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedVideo(null)}>
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            <div className="video-embed-container">
              <iframe 
                src={getEmbedUrl(selectedVideo)}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
              ></iframe>
            </div>

            <span className={`badge ${selectedVideo.category === 'Technical' ? 'badge-secondary' : 'badge-primary'}`} style={{ marginBottom: '0.5rem' }}>
              {selectedVideo.category}
            </span>
            <h3 className="modal-video-title">{selectedVideo.title}</h3>
            
            <div className="modal-meta">
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Published: <strong>{formatDate(selectedVideo.publishedAt)}</strong>
              </span>
              {selectedVideo.views && selectedVideo.views !== 'N/A' && (
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Views: <strong>{selectedVideo.views}</strong>
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <a 
                href={selectedVideo.videoUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-primary"
              >
                Watch on YouTube
              </a>
            </div>

            <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Video Notes & Description</h4>
            <pre className="modal-desc">{selectedVideo.description}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
