import React, { useState, useEffect, useCallback } from 'react';
import { Spinner, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import SideBarNav from '../pageAssets/sideBarNav.jsx';
import RightBarComponent from '../pageAssets/rightNav.jsx';
import SuggestedFriends from '../../component/Friends/suggestedFriends.jsx';
import './exploreSTyle.css';
import { useAuth } from '../auth/AuthContext/index.jsx';
import default_profilePicture from '../../assets/avater_pix.webp';
import ShimmerExploreLoader from './ShimmerExploreLoader/index.jsx';
import fire_icon from '../../assets/search_icon/fire_icon.png';
import follow_line from '../../assets/search_icon/follow-line.png';
import laugh_icon from '../../assets/search_icon/laugh_icon.png';
import { usePost } from '../../component/Posts/PostContext/seachPost.jsx';
import SinglePostTemplate from '../../component/Posts/single.jsx';
import SinglePostLoader from '../../component/assets/Loader/SinglePostLoader/index.jsx';

const RECENT_KEY = 'zagasm_recent_searches';

function ExplorePage() {
  const [query, setQuery] = useState('');
  const { user } = useAuth();

  // Use the post context for search
  const {
    HomePostData: searchResults,
    loading,
    searchUsers,
    changeTab,
    currentTab,
    fetchPost
  } = usePost();


  // Real-time search handler
  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setQuery(value);
    searchUsers(value); // This will trigger the debounced search
  }, [searchUsers]);

  const handleSearchSubmit = useCallback((e) => {
    if (e) e.preventDefault();
    if (query.trim() === '') return;
    searchUsers(query); // Immediate search on submit
  }, [query, searchUsers]);

  const handleTabChange = useCallback((newTab) => {
    // Clear search query when changing tabs
    setQuery('');
    changeTab(newTab);
  }, [changeTab]);

  // Fetch tab content when component mounts or tab changes
  useEffect(() => {
    if (currentTab && !query) {
      fetchPost( query && (false, currentTab, 0, ''));
    }
  }, [currentTab, query, fetchPost]);

  const renderSearchResults = () => {
    if (query === '') {
      return (
        <div className="recent-searches-container">
          {recentSearches.length > 0 && (
            <div className="recent-searches-header">
              <h6>Recent Searches</h6>
              <button
                className="clear-recent-btn text-primary"
                onClick={clearRecentSearches}
              >
                Clear all
              </button>
            </div>
          )}
          {recentSearches.map((item, index) => (
            <div
              key={`${item.user_id}-${index}`}
              className="recent-search-item d-flex justify-content-between align-items-center px-3 py-2"
            >
              <Link
                to={`/${item.user_id}`}
                className="d-flex align-items-center text-decoration-none text-dark flex-grow-1"
                onClick={() => saveToRecentSearches(item)}
              >
                <img
                  src={item.profile_picture || default_profilePicture}
                  alt={item.username}
                  className="rounded-circle me-3"
                  width="40"
                  height="40"
                />
                <div>
                  <div className="fw-semibold">{item.username}</div>
                  {item.full_name && (
                    <div className="text-muted small">{item.full_name}</div>
                  )}
                </div>
              </Link>
              <button
                className="btn btn-link text-muted p-0"
                onClick={() => removeRecentSearch(item.user_id)}
              >
                <i className="feather-x"></i>
              </button>
            </div>
          ))}
        </div>
      );
    }

    if (loading) {
      return <SinglePostLoader />;
    }

    if (!searchResults || searchResults.length === 0) {
      return (
        <div className="text-center py-5">
          <i className="feather-search display-4 text-muted mb-3"></i>
          <h5>No results found</h5>
          <p className="text-muted">Try searching for something else</p>
        </div>
      );
    }

    return (
      <div className="search-results">
        {searchResults.map((post, index) => (
          <div key={post.id || index}>
            <SinglePostTemplate seachQuery={query} data={post} />
          </div>
        ))}
      </div>
    );
  };

  const renderTabContent = () => {
    if (loading) {
      return <SinglePostLoader />;
    }

    if (!searchResults || searchResults.length === 0) {
      return (
        <div className="text-center py-5">
          <i className="feather-grid display-4 text-muted mb-3"></i>
          <h5>No content available</h5>
          <p className="text-muted">Try searching for something or check back later</p>
        </div>
      );
    }

    return (
      <div className="tab-content-results">
        {query && searchResults.map((post, index) => (
          <div key={post.id || index}>
            <SinglePostTemplate data={post} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="py-4 explore-page">
      <div className="container-fluid p-0">
        <SideBarNav />
        <div className="offset-xl-3 offset-lg-1 offset-md-1 create-post-row">
          <main className="col col-xl-7 col-lg-8 col-md-12 main_containe explore-main-section">
            {/* Enhanced Search Header */}
            <div className="search-header-container">
              <div className="profile-pic-container">
                <img
                  src={user?.meta_data?.profile_picture || default_profilePicture}
                  alt="Profile"
                  className="profile-pic"
                />
              </div>

              <div className="search-input-container">
                <form onSubmit={handleSearchSubmit} className="w-100">
                  <div className="search-input-wrapper">
                    <i className="feather-search search-icon"></i>
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Search for memes and creators"
                      value={query}
                      onChange={handleInputChange}
                    />
                    {query && (
                      <button
                        type="button"
                        className="clear-search-btn"
                        onClick={() => {
                          setQuery('');
                          searchUsers('');
                        }}
                      >
                        <i className="feather-x"></i>
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <button className="settings-btn">
                <i className="feather-settings"></i>
              </button>
            </div>

            {/* Minimalist Tabs */}
            <div className="minimal-tabs-container">
              <div className="minimal-tabs">
                <button
                  className={`minimal-tab ${currentTab === 'foryou' ? 'active' : ''}`}
                  onClick={() => handleTabChange('foryou')}
                >
                  <img src={laugh_icon} alt="For You" /> For You
                </button>
                <button
                  className={`minimal-tab ${currentTab === 'following' ? 'active' : ''}`}
                  onClick={() => handleTabChange('following')}
                >
                  <img src={follow_line} alt="Following" /> Following
                </button>
              </div>
              <div className="minimal-tabs-line"></div>
            </div>

            {/* Content Area */}
            <div className="tab-content-area">
              {query ? (
                renderSearchResults()
              ) : (
                renderTabContent()
              )}
            </div>
          </main>

          <RightBarComponent>
            <SuggestedFriends />
          </RightBarComponent>
        </div>
      </div>
    </div>
  );
}

export default ExplorePage;