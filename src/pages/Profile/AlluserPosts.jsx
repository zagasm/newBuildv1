import React, { useEffect } from 'react';
import { FiEdit, FiBell, FiMoreHorizontal, FiCamera, FiHeart } from 'react-icons/fi';

// import './Profilestyle.css';
import { usePost } from '../../component/Posts/PostContext';
import SinglePostTemplate, { PostContent } from '../../component/Posts/single';
import { useLocation, useParams } from 'react-router-dom';
import post_chart from '../../assets/post_icon/post_chart.svg';
function UserPost() {
  const { UserProfilePostData, refreshProfilePost } = usePost();
  console.log(UserProfilePostData);

  const { profileId } = useParams();
  useEffect(() => {
    if (profileId) {
      refreshProfilePost(profileId);
    }
  }, [profileId]);

  return (
    <div className="profile-content container  pb-5" style={{ paddingBottom: '300px' }}>
      <div className="row">
        {/* Main Feed */}
        <div className="post-grid">
          {UserProfilePostData && UserProfilePostData.length > 0 ? (
            UserProfilePostData.map(post => (
              <div className="post-grid-item col" key={post.post_id}>
                {/* Post content */}
                <PostContent profileData={true} data={post} />
                {/* Overlay element */}
                <div className="post-grid-overlay">
                  {/* Love icon at bottom right */}
                  <div className="chart-icon-container d-flex">
                    <img src={post_chart} alt="" className="chart-icon" /> <span style={{ marginTop: '5px' }}>{post.views_formatted}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-5">
              <p>No posts available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserPost;