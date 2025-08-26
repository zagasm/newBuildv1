import React, { useEffect, useState, useCallback } from 'react';
import SinglePostTemplate from '../../component/Posts/single';
import { showToast } from '../../component/ToastAlert';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';

// Debounce function to limit how often a function can be called
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

function UserPost({ profileId }) {
  const { token } = useAuth();
  const [posts, setPosts] = useState({ data: [] }); // store API's data object
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  // Create a cache key based on profileId
  const getCacheKey = (id) => `userPosts_${id}`;

  // Save posts to localStorage
  const saveToCache = (id, data) => {
    try {
      localStorage.setItem(
        getCacheKey(id),
        JSON.stringify({
          data,
          timestamp: Date.now(),
        })
      );
    } catch (e) {
      console.warn('Failed to save to cache', e);
    }
  };

  // Get posts from localStorage if they're recent enough (5 minutes)
  const getFromCache = (id) => {
    try {
      const cached = localStorage.getItem(getCacheKey(id));
      if (!cached) return null;

      const parsed = JSON.parse(cached);
      const isFresh = Date.now() - parsed.timestamp < 5 * 60 * 1000; // 5 minutes

      return isFresh ? parsed.data : null;
    } catch (e) {
      console.warn('Failed to read from cache', e);
      return null;
    }
  };

  // Debounced fetch for first page
  const debouncedFetchUserPosts = useCallback(
    debounce(async (profileId) => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/meme/${profileId}/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.data?.status) {
          const payload = response.data.data; // take "data" object
          setPosts(payload);
          setNextPageUrl(payload.next_page_url);
          saveToCache(profileId, payload);
        } else {
          throw new Error(response.data?.message || 'Failed to fetch posts');
        }
      } catch (err) {
        console.error('Error fetching posts:', err);
        const cachedData = getFromCache(profileId);
        if (cachedData) {
          setPosts(cachedData);
          setNextPageUrl(cachedData.next_page_url);
        } else {
          setError(
            err.response?.data?.message ||
            err.message ||
            'Failed to load posts'
          );
          showToast.error(err.response?.data?.message || 'Failed to load posts');
        }
      } finally {
        setLoading(false);
      }
    }, 1000),
    [token]
  );

  // Load more posts for pagination
  const loadMorePosts = async () => {
    if (!nextPageUrl || loadingMore) return;
    setLoadingMore(true);

    try {
      const response = await axios.get(nextPageUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data?.status) {
        const payload = response.data.data;
        setPosts((prev) => ({
          ...payload,
          data: [...(prev?.data || []), ...(payload.data || [])],
        }));
        setNextPageUrl(payload.next_page_url);
      }
    } catch (err) {
      console.error('Error loading more posts:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Detect scroll near bottom
  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } =
        document.documentElement;
      if (scrollHeight - scrollTop - clientHeight < 200) {
        loadMorePosts();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [nextPageUrl, loadingMore]);

  useEffect(() => {
    if (profileId && token) {
      const cachedData = getFromCache(profileId);
      if (cachedData) {
        setPosts(cachedData);
        setNextPageUrl(cachedData.next_page_url);
        setLoading(false);
      }
      debouncedFetchUserPosts(profileId);
    }
  }, [profileId, token, debouncedFetchUserPosts]);

  if (loading) {
    return (
      <div className="profile-content container pb-5">
        <div className="row">
          <div className="col-12 text-center py-5">
            <p>
              Loading posts...{' '}
              <span className="fa fa-spinner fa-spin"></span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-content container pb-5">
        <div className="row">
          <div className="col-12 text-center py-5">
            <p className="text-danger">{error}</p>
            <button
              className="btn btn-primary"
              onClick={() => debouncedFetchUserPosts(profileId)}
              style={{
                background:
                  'linear-gradient(84.41deg, #C207E7 1.78%, #490481 69.04%)',
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-conten container pb-5">
      <div className="row ">
        {/* {console.log(posts)} */}
        {posts.data && posts.data.length > 0 ? (
          posts.data.map((post, index) => (
            <div key={post?.id || index}>
              <SinglePostTemplate data={post} />
            </div>
          ))
        ) : (
          <div className="text-center py-5 col-12">
             <p>No posts available</p>
          </div>
        )}
      </div>

      {loadingMore && (
        <div className="text-center py-3">
          <span className="fa fa-spinner fa-spin"></span> Loading more...
        </div>
      )}
    </div>
  );
}

export default UserPost;
