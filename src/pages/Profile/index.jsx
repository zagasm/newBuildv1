import React, { useState } from 'react';
import './generalStyling.css';

function ProfilePage() {
    const [activeTab, setActiveTab] = useState('followers');
    const [visibleCount, setVisibleCount] = useState(4); // Initial number of items to show
    
    // Mock data with online images
    const followersData = [
        { id: 1, username: 'user1', image: 'https://randomuser.me/api/portraits/women/1.jpg' },
        { id: 2, username: 'user2', image: 'https://randomuser.me/api/portraits/men/2.jpg' },
        { id: 3, username: 'user3', image: 'https://randomuser.me/api/portraits/women/3.jpg' },
        { id: 4, username: 'user4', image: 'https://randomuser.me/api/portraits/men/4.jpg' },
        { id: 5, username: 'user5', image: 'https://randomuser.me/api/portraits/women/5.jpg' },
        { id: 6, username: 'user6', image: 'https://randomuser.me/api/portraits/men/6.jpg' },
        { id: 7, username: 'user7', image: 'https://randomuser.me/api/portraits/women/7.jpg' },
        { id: 8, username: 'user8', image: 'https://randomuser.me/api/portraits/men/8.jpg' },
    ];

    const followingData = [
        { id: 9, username: 'user9', image: 'https://randomuser.me/api/portraits/women/9.jpg' },
        { id: 10, username: 'user10', image: 'https://randomuser.me/api/portraits/men/10.jpg' },
        { id: 11, username: 'user11', image: 'https://randomuser.me/api/portraits/women/11.jpg' },
        { id: 12, username: 'user12', image: 'https://randomuser.me/api/portraits/men/12.jpg' },
        { id: 13, username: 'user13', image: 'https://randomuser.me/api/portraits/women/13.jpg' },
    ];

    const currentData = activeTab === 'followers' ? followersData : followingData;
    const visibleData = currentData.slice(0, visibleCount);
    const hasMore = visibleData.length < currentData.length;

    const handleSeeMore = () => {
        setVisibleCount(prev => prev + 4); // Show 4 more items
    };

    return (
        <div className="container mb-5 pb-5">
            <div className="row">
                <div className="col-xl-6 col-sm-12">
                    <ul className='actions_section'>
                        <li>
                            <b>0</b>
                            <span>Posts</span>
                        </li>
                        <li>
                            <b>{followersData.length}</b>
                            <span>Followers</span>
                        </li>
                        <li>
                            <b>{followingData.length}</b>
                            <span>Following</span>
                        </li>
                    </ul>

                    <div className="followers_following_user_container mt-5">
                        {/* Tab Navigation */}
                        <div className="tabs">
                            <button 
                                className={`tab ${activeTab === 'followers' ? 'active' : ''}`}
                                onClick={() => {
                                    setActiveTab('followers');
                                    setVisibleCount(4); // Reset visible count when switching tabs
                                }}
                            >
                                Followers
                            </button>
                            <button 
                                className={`tab ${activeTab === 'following' ? 'active' : ''}`}
                                onClick={() => {
                                    setActiveTab('following');
                                    setVisibleCount(4); // Reset visible count when switching tabs
                                }}
                            >
                                Following
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="tab-content">
                            <div className="users-grid">
                                {visibleData.map(user => (
                                    <div key={user.id} className="user-card">
                                        <div className="user-avatar-container">
                                            <img 
                                                src={user.image} 
                                                alt={user.username} 
                                                className="user-avatar"
                                                onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
                                            />
                                        </div>
                                        <span className="username">{user.username}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* See More Button - Only show if there are more items */}
                        {hasMore && (
                            <div className="see-more-container">
                                <button className="see-more-btn" onClick={handleSeeMore}>
                                    See all {activeTab}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="col-xl-6 col-sm-12">right bar</div>
            </div>
        </div>
    );
}

export default ProfilePage;