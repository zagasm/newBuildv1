import React, { useState, useEffect } from 'react';
import { Spinner, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import SideBarNav from '../pageAssets/sideBarNav.jsx';
import RightBarComponent from '../pageAssets/rightNav.jsx';
import SuggestedFriends from '../../component/Friends/suggestedFriends.jsx';
import './exploreSTyle.css';
import { useAuth } from '../auth/AuthContext/index.jsx';
import default_profilePicture from '../../assets/avater_pix.avif';
import ShimmerExploreLoader from './ShimmerExploreLoader/index.jsx';
import fire_icon from '../../assets/search_icon/fire_icon.png';
import follow_line from '../../assets/search_icon/follow-line.png';
import laugh_icon from '../../assets/search_icon/laugh_icon.png';
import meme_icon from '../../assets/search_icon/meme_icon.png';
const RECENT_KEY = 'zagasm_recent_searches';

const truncateText = (text, maxLength) =>
  text.length > maxLength ? text.substring(0, maxLength - 3) + "..." : text;

function groupByDate(items) {
  const groups = {};
  items.forEach(item => {
    const date = new Date(item.timestamp);
    const today = new Date();
    const label =
      date.toDateString() === today.toDateString()
        ? 'Today'
        : new Date(today.setDate(today.getDate() - 1)).toDateString() ===
          date.toDateString()
        ? 'Yesterday'
        : date.toLocaleDateString();
    groups[label] = groups[label] || [];
    groups[label].push(item);
  });
  return groups;
}

function ExplorePage() {
   const [query, setQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [activeTab, setActiveTab] = useState('trending');
  const { user } = useAuth();

  // Load recent from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(RECENT_KEY)) || [];
    setRecentSearches(stored);
  }, []);

  // Load recent from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(RECENT_KEY)) || [];
    setRecentSearches(stored);
  }, []);

  const saveToRecentSearches = person => {
    const minimal = {
      user_id: person.user_id,
      user_name: person.user_name,
      user_firstname: person.user_firstname,
      user_lastname: person.user_lastname,
      user_picture: person.user_picture,
      timestamp: Date.now(),
    };
    const updated = [minimal, ...recentSearches.filter(r => r.user_id !== minimal.user_id)];
    if (updated.length > 10) updated.splice(10);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  };

  const removeFromRecent = id => {
    const updated = recentSearches.filter(r => r.user_id !== id);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  };

  const clearAllRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_KEY);
  };

  const handleInputChange = async e => {
    const v = e.target.value;
    setQuery(v);
    if (v.trim() === '') {
      setFilteredResults([]);
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('api_secret_key', 'Zagasm2025!Api_Key_Secret');
      formData.append('user_id', user.user_id);
      formData.append('query', v);
      const resp = await axios.post(
        'https://zagasm.com/includes/ajax/users/search.php',
        formData,
        { withCredentials: true }
      );
      setFilteredResults(resp.data.success ? resp.data.results : []);
    } catch (err) {
      console.error(err);
      setFilteredResults([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleFollow = async (uid, isFollowing, idx) => {
    setLoadingFollow(uid);
    try {
      const formData = new FormData();
      formData.append("api_secret_key", "Zagasm2025!Api_Key_Secret");
      formData.append("user_id", user.user_id);
      formData.append("do", isFollowing ? "unfollow" : "follow");
      formData.append("id", uid);
      const resp = await fetch(`${import.meta.env.VITE_API_URL}/includes/ajax/users/connect.php`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const json = await resp.json();
      if (json.success) {
        const copy = [...filteredResults];
        copy[idx].i_am_following = !isFollowing;
        setFilteredResults(copy);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingFollow(null);
    }
  };

  const grouped = groupByDate(recentSearches);

  const renderTabContent = () => {
    switch(activeTab) {
      case 'trending':
        return <div className="tab-content">Trending content goes here</div>;
      case 'creators':
        return <div className="tab-content">Creators content goes here</div>;
      case 'foryou':
        return <div className="tab-content">For You content goes here</div>;
      case 'following':
        return <div className="tab-content">Following content goes here</div>;
      default:
        return null;
    }
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
                  src={user?.user_picture || default_profilePicture} 
                  alt="Profile"
                  className="profile-pic"
                />
              </div>
              
              <div className="search-input-container">
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
                    <button className="clear-search-btn" onClick={() => setQuery('')}>
                      <i className="feather-x"></i>
                    </button>
                  )}
                </div>
              </div>
              
              <button className="settings-btn">
                <i className="feather-settings"></i>
              </button>
            </div>

            {/* Minimalist Tabs */}
            <div className="minimal-tabs-container">
              <div className="minimal-tabs">
                <button
                  className={`minimal-tab ${activeTab === 'trending' ? 'active' : ''}`}
                  onClick={() => setActiveTab('trending')}
                >
                  <img src={fire_icon} alt="trending memes" /> Trending
                </button>
                <button
                  className={`minimal-tab ${activeTab === 'creators' ? 'active' : ''}`}
                  onClick={() => setActiveTab('creators')}
                >
                   <img src={meme_icon} alt="trending memes" />  Creators
                </button>
                <button
                  className={`minimal-tab ${activeTab === 'foryou' ? 'active' : ''}`}
                  onClick={() => setActiveTab('foryou')}
                >
                 <img src={laugh_icon} alt="trending memes" /> For You
                </button>
                <button
                  className={`minimal-tab ${activeTab === 'following' ? 'active' : ''}`}
                  onClick={() => setActiveTab('following')}
                >
                   <img src={follow_line} alt="trending memes" />  Following
                </button>
              </div>
              <div className="minimal-tabs-line"></div>
            </div>

            {/* Content Area */}
            <div className="tab-content-area">
              {query ? (
                <div className="search-results">
                  {loading ? (
                    <ShimmerExploreLoader />
                  ) : filteredResults.length > 0 ? (
                    filteredResults.map((p, i) => (
                      <Link
                        to={`/${p.user_id}`}
                        key={p.user_id}
                        className="ig-search-item d-flex justify-content-between align-items-center px-3 py-2 text-decoration-none text-dark"
                        onClick={() => saveToRecentSearches(p)}
                      >
                        {/* ... (existing search result item) ... */}
                      </Link>
                    ))
                  ) : (
                    <div className="ig-search-no-result">No users found</div>
                  )}
                </div>
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