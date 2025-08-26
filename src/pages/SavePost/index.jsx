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
import default_profilePicture from '../../assets/avater_pix.webp';
import ShimmerExploreLoader from './ShimmerExploreLoader/index.jsx';
import fire_icon from '../../assets/search_icon/fire_icon.png';
import follow_line from '../../assets/search_icon/follow-line.png';
import laugh_icon from '../../assets/search_icon/laugh_icon.png';
import meme_icon from '../../assets/search_icon/meme_icon.png';
import SavePostComponent from '../../component/Posts/savePost/singles/savePost.jsx';
import ViewedPostComponent from '../../component/Posts/savePost/singles/viewPost.jsx';


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

function Savepost() {
  const [query, setQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [activeTab, setActiveTab] = useState('saved');
  const { user } = useAuth();



  const renderTabContent = () => {
    switch (activeTab) {
      case 'saved':
        return <div className="tab-content">
          <SavePostComponent />
        </div>;
      case 'Viewed':
        return <div className="tab-content">
          <ViewedPostComponent />
        </div>;
      default:
        return null;
    }
  };
const truncateText = (text, maxLength) =>
  text.length > maxLength ? text.substring(0, maxLength - 3) + "..." : text;

  return (
    <div className=" explore-page m-0">
      <div className="container-flui p-0 m-0">
        <SideBarNav />
        <div className="offset-xl-3 offset-lg-1 offset-md-1 create-post-ro">
          <main className="col col-xl-7 col-lg-8 col-md-12 main_containe explore-main-sectio">
            <div className="containe mb-3">
                <Link to={'/account'} className='fa fa-angle-left text-dark'></Link>
            </div>
            {/* Minimalist Tabs */}
            <div className="minimal-tabs-container shadow-sm mb-5">
              <div className="minimal-tabs">
                <button
                  className={`minimal-tab ${activeTab === 'saved' ? 'active' : ''}`}
                  onClick={() => setActiveTab('saved')}
                > My Saved
                </button>
                <button
                  className={`minimal-tab ${activeTab === 'Viewed' ? 'active' : ''}`}
                  onClick={() => setActiveTab('Viewed')}
                >  Viewed
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
                        // onClick={() => saveToRecentSearches(p)}
                      >
                        {/* ... (existing search result item) ... */}
                      </Link>
                    ))
                  ) : (
                    <div className="ig-search-no-result">No meme found</div>
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

export default Savepost;