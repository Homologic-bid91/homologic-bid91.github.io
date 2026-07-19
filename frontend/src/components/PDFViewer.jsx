import React, { useEffect, useRef, useState } from 'react';

export default function PDFViewer({ url, title, onClose }) {
  const [pdf, setPdf] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Fullscreen event listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(`Fullscreen error: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Keyboard protection (prevent print, save, copy)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;
      
      // Block Ctrl+P / Cmd+P
      if (cmdOrCtrl && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        alert('Printing is disabled for this secure document.');
      }
      // Block Ctrl+S / Cmd+S
      if (cmdOrCtrl && e.key.toLowerCase() === 's') {
        e.preventDefault();
        alert('Saving is disabled for this secure document.');
      }
      // Block Ctrl+C / Cmd+C (prevent copying text)
      if (cmdOrCtrl && e.key.toLowerCase() === 'c') {
        e.preventDefault();
      }
      // Block Ctrl+A / Cmd+A
      if (cmdOrCtrl && e.key.toLowerCase() === 'a') {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Load PDF
  useEffect(() => {
    if (!window.pdfjsLib) {
      setError('PDF engine failed to initialize. Please reload.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const loadingTask = window.pdfjsLib.getDocument(url);
    
    loadingTask.promise.then(
      (pdfDoc) => {
        setPdf(pdfDoc);
        setNumPages(pdfDoc.numPages);
        setPageNum(1);
        setLoading(false);
      },
      (err) => {
        console.error('Error loading PDF:', err);
        setError('Unable to load PDF document. Please check connection.');
        setLoading(false);
      }
    );
  }, [url]);

  // Render Page
  useEffect(() => {
    if (!pdf || !canvasRef.current) return;

    pdf.getPage(pageNum).then((page) => {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      const viewport = page.getViewport({ scale });
      const pixelRatio = window.devicePixelRatio || 1;
      
      canvas.width = viewport.width * pixelRatio;
      canvas.height = viewport.height * pixelRatio;
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;

      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };

      page.render(renderContext).promise;
    });
  }, [pdf, pageNum, scale]);

  const changePage = (offset) => {
    setPageNum((prev) => Math.min(Math.max(1, prev + offset), numPages));
  };

  const changeZoom = (factor) => {
    setScale((prev) => Math.min(Math.max(0.6, prev + factor), 2.5));
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(7, 10, 19, 0.85)',
        backdropFilter: 'blur(16px)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-heading)',
        color: '#fff',
        userSelect: 'none',
        WebkitUserSelect: 'none'
      }}
      onContextMenu={(e) => e.preventDefault()}
      ref={containerRef}
    >
      {/* Viewport */}
      <div 
        style={{
          flex: 1,
          width: '100%',
          background: 'rgba(5, 8, 16, 0.6)',
          overflow: 'auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '1.5rem 0.5rem',
          boxSizing: 'border-box',
          position: 'relative'
        }}
      >
        {loading && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div 
              style={{
                width: '40px',
                height: '40px',
                border: '3px solid rgba(6, 182, 212, 0.1)',
                borderTopColor: 'var(--primary)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginBottom: '1rem'
              }}
            />
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Decrypting secure document...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {error && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', maxWidth: '400px' }}>
            <svg viewBox="0 0 24 24" width="48" height="48" stroke="#ef4444" strokeWidth="2" fill="none" style={{ marginBottom: '1rem' }}>
              <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p style={{ fontSize: '1rem', color: '#ef4444', marginBottom: '1.5rem' }}>{error}</p>
            <button 
              onClick={onClose}
              className="btn btn-secondary"
              style={{ padding: '0.6rem 1.2rem' }}
            >
              Go Back
            </button>
          </div>
        )}

        {!loading && !error && (
          <div 
            style={{
              position: 'relative',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backgroundColor: '#fff'
            }}
          >
            <canvas ref={canvasRef} style={{ display: 'block' }} />
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                cursor: 'default',
                zIndex: 10
              }}
            />
          </div>
        )}
      </div>

      {/* Unified Toolbar / Controls (One-Line Footer) */}
      {!loading && !error && (
        <div 
          style={{
            width: '100%',
            padding: '0.75rem 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(10px)',
            boxSizing: 'border-box',
            gap: '1rem',
            flexWrap: 'wrap'
          }}
        >
          {/* Left: Title & Close */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#fff', letterSpacing: '0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '250px' }}>
              {title || 'View Resource'}
            </h3>
            
            <button 
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff',
                cursor: 'pointer',
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                e.currentTarget.style.color = '#ef4444';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.color = '#fff';
              }}
            >
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              Close
            </button>
          </div>

          {/* Center: Pagination & Zoom */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {/* Pagination */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button 
                onClick={() => changePage(-1)} 
                disabled={pageNum <= 1}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  cursor: pageNum <= 1 ? 'not-allowed' : 'pointer',
                  opacity: pageNum <= 1 ? 0.4 : 1,
                  padding: '0.35rem 0.7rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => { if (pageNum > 1) e.currentTarget.style.background = 'rgba(6, 182, 212, 0.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; }}
              >
                ← Prev
              </button>
              <span style={{ fontSize: '0.85rem', color: '#fff' }}>
                Page {pageNum} / {numPages}
              </span>
              <button 
                onClick={() => changePage(1)} 
                disabled={pageNum >= numPages}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  cursor: pageNum >= numPages ? 'not-allowed' : 'pointer',
                  opacity: pageNum >= numPages ? 0.4 : 1,
                  padding: '0.35rem 0.7rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => { if (pageNum < numPages) e.currentTarget.style.background = 'rgba(6, 182, 212, 0.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; }}
              >
                Next →
              </button>
            </div>

            {/* Zoom */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button 
                onClick={() => changeZoom(-0.1)} 
                disabled={scale <= 0.6}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  cursor: scale <= 0.6 ? 'not-allowed' : 'pointer',
                  opacity: scale <= 0.6 ? 0.4 : 1,
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => { if (scale > 0.6) e.currentTarget.style.background = 'rgba(6, 182, 212, 0.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; }}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
              <span style={{ fontSize: '0.8rem', width: '45px', textAlign: 'center', color: '#ccc' }}>
                {Math.round(scale * 100)}%
              </span>
              <button 
                onClick={() => changeZoom(0.1)} 
                disabled={scale >= 2.5}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  cursor: scale >= 2.5 ? 'not-allowed' : 'pointer',
                  opacity: scale >= 2.5 ? 0.4 : 1,
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => { if (scale < 2.5) e.currentTarget.style.background = 'rgba(6, 182, 212, 0.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; }}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>
          </div>

          {/* Right: Fullscreen */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button
              onClick={toggleFullscreen}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff',
                cursor: 'pointer',
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.8rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(6, 182, 212, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
            >
              {isFullscreen ? (
                <>
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7" />
                  </svg>
                  Exit
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                  </svg>
                  Fullscreen
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
