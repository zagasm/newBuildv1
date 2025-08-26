import React from 'react';
import './shimmerExploreLoader.css';

function ShimmerExploreLoader() {
  return (
    <div className="shimmer-container">
      {[...Array(6)].map((_, index) => (
        <div className="shimmer-card" key={index}>
          <div className="shimmer-avatar shimmer-effect"></div>
          <div className="shimmer-text">
            <div className="shimmer-line shimmer-effect short"></div>
            <div className="shimmer-line shimmer-effect long"></div>
          </div>
          <div className="shimmer-button shimmer-effect"></div>
        </div>
      ))}
    </div>
  );
}

export default ShimmerExploreLoader;