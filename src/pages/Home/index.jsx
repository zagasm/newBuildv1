import React, { useState, useEffect } from 'react';
import { usePost } from '../../component/Posts/PostContext';
import SuggestedFriends from '../../component/Friends/suggestedFriends';
import SinglePostTemplate from '../../component/Posts/single';
import SideBarNav from '../pageAssets/sideBarNav';
import RightBarComponent from '../pageAssets/rightNav';
import './Homestyle.css';
import FollowingPost from './FollowingPost';
import ForYouPost from './ForYouPost';
import Navbar from '../pageAssets/Navbar';
import { useAuth } from '../auth/AuthContext';

function Home() {
    const { HomePostData } = usePost();
    const [activeTab, setActiveTab] = useState('foryou');
    const { isAuthenticated,user } = useAuth();
    //   console.log(user);
    const handleTabChange = (tab) => {
        if (tab === 'foryou' && !isAuthenticated) {
            // Optional: redirect to login or show toast
            return;
        }
        setActiveTab(tab);
    };
    useEffect(() => {
        // If the user is not authenticated but the active tab is 'foryou',
        // fall back to 'following'
        if (!isAuthenticated && activeTab === 'foryou') {
            setActiveTab('foryou');
        }
    }, [isAuthenticated, activeTab]);

    return (
        <div className="py-4">
            <div className="container-fluid p-0">
                <SideBarNav />
                <div className="ro offset-xl-3 offset-lg-1 offset-md-1 bg-none home_section">
                    <main className="col col-xl-6 col-lg-8 col-md-12 col-sm-12 col-12 main_container m-0 pt-5">
                        <div className="car shadow-s mb-3 p-2">
                            <div className="heading_tab_container">

                                <button
                                    className={`tab ${activeTab === 'foryou' ? 'active' : ''}`}
                                    onClick={() => handleTabChange('foryou')}
                                >
                                    For You
                                </button>
                                {isAuthenticated && (
                                    <button
                                        className={`tab ${activeTab === 'following' ? 'active' : ''}`}
                                        onClick={() => handleTabChange('following')}
                                    >
                                        Following
                                    </button>
                                )}

                            </div>
                        </div>

                        <div className="posts-container">
                            {activeTab === 'foryou' ? (
                                <ForYouPost  />
                            ) : (
                                <FollowingPost  />
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

export default Home;
