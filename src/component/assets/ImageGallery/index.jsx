import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './ImageGallery.css';
import axios from "axios"; // make sure you have this at the top

const ImageGallery = ({ images, currentIndex, onClose, onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [showControls, setShowControls] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const [thumbStatus, setThumbStatus] = useState(
    images.map(() => ({ loading: true, error: false }))
  );

  const [currentImage, setCurrentImage] = useState(images[currentIndex]);

  // Preload image when index changes
  useEffect(() => {
    setLoading(true);
    setError(false);
    setScale(1);
    setPosition({ x: 0, y: 0 });

    const img = new Image();
    img.src = images[currentIndex].source;
    img.onload = () => {
      setCurrentImage(images[currentIndex]);
      setLoading(false);
      setError(false);
      resetControlsTimeout();
    };
    img.onerror = () => {
      // Retry once with cache-busting
      const retryImg = new Image();
      retryImg.src =
        images[currentIndex].source +
        (images[currentIndex].source.includes('?') ? '&' : '?') +
        'cacheBust=' + Date.now();
      retryImg.onload = () => {
        setCurrentImage(images[currentIndex]);
        setLoading(false);
        setError(false);
        resetControlsTimeout();
      };
      retryImg.onerror = () => {
        setLoading(false);
        setError(true);
      };
    };
  }, [currentIndex, images]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && currentIndex > 0) onNavigate(-1);
      if (e.key === 'ArrowRight' && currentIndex < images.length - 1) onNavigate(1);
      if (e.key === '+' && scale < 7) handleZoomIn();
      if (e.key === '-' && scale > 1) handleZoomOut();
      if (e.key === '0') handleResetZoom();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, images.length, onClose, onNavigate, scale]);

  const resetControlsTimeout = () => {
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    resetControlsTimeout();
  };

  const handleMouseDown = (e) => {
    if (scale > 1) {
      setIsDragging(true);
      setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const imageRect = imageRef.current.getBoundingClientRect();
    const maxX = (imageRect.width * scale - containerRect.width) / 2;
    const maxY = (imageRect.height * scale - containerRect.height) / 1;
    let newX = e.clientX - startPos.x;
    let newY = e.clientY - startPos.y;
    newX = Math.min(Math.max(newX, -maxX), maxX);
    newY = Math.min(Math.max(newY, -maxY), maxY);
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.5, 1));
  const handleResetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };


const handleDownload = async () => {
  if (isDownloading) return;
  setIsDownloading(true);

  const imageUrl = currentImage.source;
  console.log("Attempting to download:", imageUrl);

  try {
    let blob;
    let filename = `downloaded_image.png`; // A sensible default

    // Extract a better filename from the URL if possible
    try {
      const url = new URL(imageUrl);
      const pathnameParts = url.pathname.split('/').filter(p => p);
      if (pathnameParts.length > 0) {
        filename = pathnameParts[pathnameParts.length - 1];
      }
    } catch (e) {
      console.log("Could not parse URL for filename, using default.");
    }

    if (imageUrl.startsWith("data:")) {
      // Handle Base64 data URLs directly
      console.log("Processing as a data URL.");
      const response = await fetch(imageUrl);
      blob = await response.blob();
    } else {
      // Handle all remote URLs via the server-side proxy
      console.log("Processing as a remote URL via proxy.");
      const proxyUrl = `/api/download-image?url=${encodeURIComponent(imageUrl)}`;
      
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        // If the proxy fails, provide a clear error message
        throw new Error(`Proxy request failed with status: ${response.status} ${response.statusText}`);
      }
      
      blob = await response.blob();
    }

    // Use the File System Access API if available for a better user experience
    if (window.showSaveFilePicker) {
      console.log("Using File System Access API.");
      const handle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [{
          description: 'Images',
          accept: { 'image/png': ['.png'], 'image/jpeg': ['.jpeg', '.jpg'] },
        }],
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
    } else {
      // Fallback to the traditional link-click method
      console.log("Using fallback download method.");
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    }

  } catch (err) {
    console.error("Download failed:", err);
    // As a final fallback, open the original image URL in a new tab
    window.open(imageUrl, '_blank', 'noopener,noreferrer');
  } finally {
    setIsDownloading(false);
  }
};


  return createPortal(
    <div className="image-gallery-overlay" onMouseMove={handleMouseMove}>
      {/* Close Button */}
      <button
        className={`close-btn ${showControls ? 'visible' : 'hidden'}`}
        onClick={onClose}
        aria-label="Close gallery"
      >
        ✕
      </button>

      {/* Controls */}
      <div className={`gallery-controls ${showControls ? 'visible' : 'hidden'}`}>
        <div className="zoom-controls">
          <button onClick={handleZoomIn}><i className="feather-plus"></i></button>
          <button onClick={handleZoomOut}><i className="feather-minus"></i></button>
          <button onClick={handleResetZoom}><i className="feather-refresh-ccw"></i></button>
        </div>
        <div className="info-controls">
          <span className="image-counter">{currentIndex + 1} / {images.length}</span>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className={isDownloading ? 'downloading' : ''}
            title={isDownloading ? 'Downloading...' : 'Download image'}
          >
            <i className={isDownloading ? "feather-loader" : "feather-download"}></i>
          </button>
        </div>
      </div>

      {/* Main Image */}
      <div
        className="gallery-content"
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleDragMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="main-image-container">
          {loading && <div className="image-loading"><div className="spinner"></div></div>}
          {error && (
            <div className="image-error">
              <i className="feather-image"></i>
              <p>Image failed to load</p>
            </div>
          )}
          {!loading && !error && (
            <img
              ref={imageRef}
              src={currentImage.source}
              alt={`Gallery image ${currentIndex + 1}`}
              className="gallery-image"
              style={{
                transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in'
              }}
              onClick={() => scale === 1 && handleZoomIn()}
            />
          )}
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              className={`nav-btn left-btn ${currentIndex === 0 ? 'disabled' : ''}`}
              onClick={() => currentIndex > 0 && onNavigate(-1)}
            >
              ‹
            </button>
            <button
              className={`nav-btn right-btn ${currentIndex === images.length - 1 ? 'disabled' : ''}`}
              onClick={() => currentIndex < images.length - 1 && onNavigate(1)}
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className={`thumbnail-container ${showControls ? 'visible' : 'hidden'}`}>
          {images.map((img, index) => {
            const status = thumbStatus[index];
            return (
              <div key={index} className="thumbnail-wrapper">
                {status.loading && <div className="thumb-loading"></div>}
                {status.error ? (
                  <div className="thumb-error"><i className="feather-image"></i></div>
                ) : (
                  <img
                    src={img.source}
                    loading="lazy"
                    className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
                    onClick={() => onNavigate(index - currentIndex)}
                    alt={`Thumbnail ${index + 1}`}
                    onLoad={() => {
                      setThumbStatus((prev) => {
                        const updated = [...prev];
                        updated[index] = { loading: false, error: false };
                        return updated;
                      });
                    }}
                    onError={() => {
                      setThumbStatus((prev) => {
                        const updated = [...prev];
                        updated[index] = { loading: false, error: true };
                        return updated;
                      });
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>,
    document.body
  );
};

export default ImageGallery;