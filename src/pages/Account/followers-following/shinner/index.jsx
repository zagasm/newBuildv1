import React from "react";
import "./followersFollowingShinnerStyling.css";

const FollowersFollowingLoader = () => {
  return (
    <div className="shimmer-wrapper">
      <div className="shimmer-card">
        <div className="shimmer-avatar"></div>
        <div className="shimmer-lines">
          <div className="shimmer-line"></div>
          <div className="shimmer-line short"></div>
        </div>
      </div>
      <div className="shimmer-card">
        <div className="shimmer-avatar"></div>
        <div className="shimmer-lines">
          <div className="shimmer-line"></div>
          <div className="shimmer-line short"></div>
        </div>
      </div>
    </div>
  );
};

export default FollowersFollowingLoader;
