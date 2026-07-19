import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import VideoGrid from './components/VideoGrid';
import PlacementHub from './components/PlacementHub';
import InterviewExperiences from './components/InterviewExperiences';
import InteractiveTools from './components/InteractiveTools';
import Footer from './components/Footer';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Dynamic application state
  const [channelStats, setChannelStats] = useState({
    subscriberCount: '120000',
    viewCount: '9500000',
    videoCount: '400',
    avatarUrl: '',
    bannerUrl: '',
    title: 'Virtual Gyans',
    description: ''
  });
  const [playlists, setPlaylists] = useState([]);
  const [videos, setVideos] = useState([]);
  const [resources, setResources] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [onboardingStages, setOnboardingStages] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let data;
        
        // Try fetching from the live API if configured, otherwise fallback to static data.json
        if (API_URL) {
          console.log(`Attempting to fetch live data from FastAPI: ${API_URL}/api/all`);
          const res = await fetch(`${API_URL}/api/all`);
          if (res.ok) {
            data = await res.json();
          } else {
            throw new Error('API server returned error, falling back to static data.');
          }
        } else {
          console.log('Fetching local static data.json');
          const res = await fetch('./data.json');
          if (res.ok) {
            data = await res.json();
          } else {
            throw new Error('Static data.json not found. Run "python3 backend/build_static.py" to generate.');
          }
        }

        if (data) {
          if (data.channel) setChannelStats(data.channel);
          if (data.playlists) setPlaylists(data.playlists);
          if (data.videos) setVideos(data.videos);
          if (data.resources) setResources(data.resources);
          if (data.experiences) setExperiences(data.experiences);
          if (data.flashcards) setFlashcards(data.flashcards);
          if (data.onboardingStages) setOnboardingStages(data.onboardingStages);
        }
        setError(null);
      } catch (err) {
        console.error('Data load error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle new experience submission
  const handleSubmitExperience = async (newExp) => {
    try {
      if (API_URL) {
        const res = await fetch(`${API_URL}/api/experiences`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newExp)
        });
        if (res.ok) {
          const saved = await res.json();
          return saved.experience;
        }
      }
    } catch (e) {
      console.warn('Could not post to backend API, simulating local save.', e);
    }
    
    // Static mode simulation
    return {
      ...newExp,
      id: `exp-sim-${Date.now()}`
    };
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center', alignItems: 'center', background: '#070a13', color: '#fff' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '1rem' }}></div>
        <p style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>Loading Virtual Gyans...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Background Animated Blobs */}
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main style={{ flexGrow: 1 }}>
        {error && (
          <div style={{ maxWidth: '1200px', margin: '2rem auto 0', padding: '1rem 2rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid var(--danger)', borderRadius: '8px', color: 'var(--text-primary)' }}>
            <strong>Configuration Warning:</strong> {error} (Falling back to local parameters)
          </div>
        )}

        {activeTab === 'home' && (
          <section>
            <Hero stats={channelStats} setActiveTab={setActiveTab} />
            
            {/* Featured Videos Dashboard Preview */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem' }}>
              <div>
                <div className="section-header" style={{ marginBottom: '1.5rem' }}>
                  <div>
                    <h2 className="section-title">Featured <span className="text-gradient">Tutorials</span></h2>
                    <p className="section-desc">Hand-picked videos to kickstart your preparation.</p>
                  </div>
                  <button className="btn btn-secondary" onClick={() => setActiveTab('videos')} style={{ padding: '0.4rem 1.2rem', fontSize: '0.85rem' }}>
                    View All Videos →
                  </button>
                </div>
                
                <div className="grid-container">
                  {videos.slice(0, 3).map((video) => (
                    <div 
                      key={video.id} 
                      className="glass-card video-card"
                      onClick={() => setActiveTab('videos')}
                    >
                      <div className="video-thumb-container">
                        <img src={video.thumbnailUrl} alt={video.title} className="video-thumb" />
                      </div>
                      <div className="video-body">
                        <h3 className="video-title" style={{ height: 'auto', marginBottom: '0.5rem' }}>{video.title}</h3>
                        <p className="video-desc" style={{ WebkitLineClamp: 2 }}>{video.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Popular Resources Preview */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>Recommended Blueprints</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {resources.slice(0, 2).map((res) => (
                      <div key={res.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>{res.company}</span>
                          <h4 style={{ color: '#fff', fontSize: '1.1rem' }}>{res.title}</h4>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{res.description}</p>
                        </div>
                        <button className="btn btn-secondary" onClick={() => setActiveTab('guides')} style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>
                          Access
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card" style={{ background: 'rgba(139, 92, 246, 0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <span className="badge badge-secondary" style={{ width: 'fit-content', marginBottom: '0.75rem' }}>Featured Experience</span>
                  {experiences[0] ? (
                    <>
                      <h4 style={{ color: '#fff', fontSize: '1.15rem' }}>{experiences[0].role}</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.25rem 0 1rem' }}>
                        Shared by {experiences[0].candidate} ({experiences[0].date})
                      </p>
                      <div style={{ fontSize: '0.85rem', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '6px', color: 'var(--text-secondary)', border: '1px solid var(--border-glass)' }}>
                        "{experiences[0].tips.substring(0, 100)}..."
                      </div>
                      <button className="btn btn-primary" onClick={() => setActiveTab('experiences')} style={{ marginTop: '1rem', padding: '0.4rem', fontSize: '0.8rem', width: '100%' }}>
                        Read Full Experience
                      </button>
                    </>
                  ) : (
                    <p style={{ color: 'var(--text-secondary)' }}>No interview logs loaded.</p>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'videos' && (
          <section>
            <VideoGrid videos={videos} />
          </section>
        )}

        {activeTab === 'guides' && (
          <section>
            <PlacementHub resources={resources} />
          </section>
        )}

        {activeTab === 'experiences' && (
          <section>
            <InterviewExperiences 
              initialExperiences={experiences} 
              onSubmitExperience={handleSubmitExperience} 
            />
          </section>
        )}

        {activeTab === 'tools' && (
          <section>
            <InteractiveTools 
              onboardingStages={onboardingStages} 
              flashcards={flashcards} 
            />
          </section>
        )}
      </main>

      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}
