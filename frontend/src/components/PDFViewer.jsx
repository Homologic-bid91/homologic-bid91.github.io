import React, { useEffect, useRef, useState } from 'react';

export default function PDFViewer({ url, title, onClose }) {
  const [pdf, setPdf] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.2);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

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
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };

      page.render(renderContext).promise.then(() => {
        // Draw diagonal watermarks
        context.save();
        context.font = '24px Outfit, Inter, sans-serif';
        context.fillStyle = 'rgba(200, 200, 200, 0.15)';
        context.translate(canvas.width / 2, canvas.height / 2);
        context.rotate(-Math.PI / 4);
        context.textAlign = 'center';
        
        for (let y = -3; y <= 3; y++) {
          for (let x = -2; x <= 2; x++) {
            context.fillText('VIRTUAL GYANS - SECURE VIEW', x * 350, y * 180);
          }
        }
        context.restore();
      });
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
      {/* Header */}
      <div 
        style={{
          width: '100%',
          maxWidth: '1200px',
          padding: '1.2rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px 16px 0 0',
          boxSizing: 'border-box'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div 
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              boxShadow: '0 0 10px var(--primary)'
            }}
          />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#fff', letterSpacing: '0.02em' }}>
            {title || 'View Resource'}
          </h3>
          <span 
            style={{
              fontSize: '0.7rem',
              padding: '0.2rem 0.5rem',
              borderRadius: '4px',
              background: 'rgba(6, 182, 212, 0.1)',
              color: 'var(--primary)',
              border: '1px solid rgba(6, 182, 212, 0.2)',
              marginLeft: '0.5rem',
              letterSpacing: '0.05em'
            }}
          >
            PROTECTED WINDOW
          </span>
        </div>
        
        <button 
          onClick={onClose}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#fff',
            cursor: 'pointer',
            padding: '0.5rem 1rem',
            borderRadius: '10px',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
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
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          Close
        </button>
      </div>

      {/* Viewport */}
      <div 
        style={{
          flex: 1,
          width: '100%',
          maxWidth: '1200px',
          background: 'rgba(5, 8, 16, 0.6)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          overflow: 'auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '2rem 1rem',
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

      {/* Toolbar / Controls */}
      {!loading && !error && (
        <div 
          style={{
            width: '100%',
            maxWidth: '1200px',
            padding: '1rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(10px)',
            borderRadius: '0 0 16px 16px',
            boxSizing: 'border-box'
          }}
        >
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
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => { if (scale > 0.6) e.currentTarget.style.background = 'rgba(6, 182, 212, 0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; }}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
            <span style={{ fontSize: '0.85rem', width: '50px', textAlign: 'center', color: 'var(--text-secondary)' }}>
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
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => { if (scale < 2.5) e.currentTarget.style.background = 'rgba(6, 182, 212, 0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; }}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={() => changePage(-1)} 
              disabled={pageNum <= 1}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff',
                cursor: pageNum <= 1 ? 'not-allowed' : 'pointer',
                opacity: pageNum <= 1 ? 0.4 : 1,
                padding: '0.4rem 0.8rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.85rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => { if (pageNum > 1) e.currentTarget.style.background = 'rgba(6, 182, 212, 0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; }}
            >
              ← Prev
            </button>
            <span style={{ fontSize: '0.9rem', color: '#fff' }}>
              Page <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{pageNum}</span> of {numPages}
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
                padding: '0.4rem 0.8rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.85rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => { if (pageNum < numPages) e.currentTarget.style.background = 'rgba(6, 182, 212, 0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; }}
            >
              Next →
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <span>Protected Canvas View</span>
          </div>
        </div>
      )}
    </div>
  );
}
