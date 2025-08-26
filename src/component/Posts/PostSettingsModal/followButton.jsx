import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../pages/auth/AuthContext';
import { showToast } from '../../ToastAlert';
import axios from 'axios';

const FollowButton = ({ following, userId, profile = false }) => {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [followed, setFollowed] = useState(following);
  // console.log('FollowButton userId:', following);  
  // You might want to add an initial check here to see if the user is already following
  // useEffect(() => {
  //   if (user && userId) {
  //     // Check initial follow status
  //   }
  // }, [user, userId]);

  const handleFollow = async () => {
    if (!token || !userId || userId === user?.id) {
      console.log('You cannot follow yourself');
      showToast.error('You cannot follow yourself');
      return;
    }
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/users/follow-unfollow/${userId}`,
        null,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      // console.log('Follow response:', response.data);
      if (response.status === 200) {
        // Toggle the follow state based on the response
        setFollowed(response.data.status);
        showToast.info('You ' + response.data.message + ' this user');
      } else {
        const errorMsg = response.data?.message || `Failed to follow. (${response.status})`;
        console.warn(errorMsg);
        showToast.error(errorMsg);
      }
    } catch (error) {
      console.error('Follow request failed:', error.message);
      const errMsg = error.response?.data?.message || 'Something went wrong. Try again later.';
      showToast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleFollow}
      style={{
        background: followed ? 'linear-gradient(84.41deg, #C207E7 1.78%, rgba(141, 7, 231, 0.62) 69.04%)' : 'linear-gradient(84.41deg, #C207E7 1.78%, rgba(141, 7, 231, 0.69) 69.04%)',
        
        minWidth: 100,
        border: 'none',
        padding: profile && '8px 15px',
        fontSize: profile && '15px',
        color: 'white',
      }}
      className="btn btn-sm d-flex align-items-center justify-content-center"
    >
      {loading ? (
        <span>
          <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"></span>
          {followed ? 'Unfollowing...' : 'Following...'}
        </span>
      ) : (
        <>
          <span>{followed ? 'Following' : 'Follow'}</span>
          {!followed && <i className="feather-user-plus ml-2"></i>}
        </>
      )}
    </button>
  );
};

export default FollowButton;