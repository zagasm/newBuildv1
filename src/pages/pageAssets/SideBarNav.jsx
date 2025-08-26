import React, { useEffect, useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './navStyle.css';
import SidebarLoader from '../../component/assets/Loader/sidebarLoader';
import home_icon from '../../assets/nav_icon/Home.svg';
import saved_icon from '../../assets/nav_icon/saved_icon.svg';
import chat_icon from '../../assets/nav_icon/chat_icon.svg';
import template_icon from '../../assets/nav_icon/template_icon.svg';
import { useAuth } from '../auth/AuthContext';
import default_profilePicture from '../../assets/avater_pix.webp';

function SideBarNav() {
    const [isLoading, setIsLoading] = useState(true);
    const { user, isAuthenticated, showAuthModal } = useAuth();
    const location = useLocation();

    // Compute user data and avatar URL with cache-busting
    const { avatarUrl, userName, username, userId } = useMemo(() => {
        const safeUser = user || {};
        const meta = safeUser.meta_data || {};
        let avatar = default_profilePicture;

        if (meta.profile_picture) {
            avatar = `${meta.profile_picture}?t=${new Date().getTime()}`;
        }

        return {
            avatarUrl: avatar,
            userName: `${safeUser.last_name || ''} ${safeUser.first_name || ''}`.trim(),
            username: safeUser.username || '',
            userId: safeUser.id || ''
        };
    }, [user]);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    const isActive = (path, exact = false) => {
        if (!path) return false;
        return exact ? location.pathname === path : location.pathname.startsWith(path);
    };

    const handleProtectedClick = (e, path) => {
        if (!isAuthenticated) {
            e.preventDefault();
            showAuthModal && showAuthModal('login');
        }
    };

    if (isLoading) return <SidebarLoader />;

    return (
        <aside className="shadow-sm side_bar_container bg-white">
            <div className="box mb-3 rounde bg-white list-sidebar">
                <ul className="list-group list-group-flush side_bar_nav">
                    <Link to="/">
                        <li className={`list-group-item pl-3 pr-3 d-flex align-items-center ${isActive('/', true) ? 'active' : ''}`}>
                            <img src={home_icon} alt="Home" />
                            <span className="link_name">Home</span>
                        </li>
                    </Link>

                    <Link to="/save-post" onClick={(e) => handleProtectedClick(e, '/save-post')}>
                        <li className={`list-group-item pl-3 pr-3 d-flex align-items-center ${isActive('/save-post', true) ? 'active' : ''}`}>
                            <img src={saved_icon} alt="save-post" />
                            <span className="link_name">Saved posts</span>
                        </li>
                    </Link>

                    <Link to="/chat" onClick={(e) => handleProtectedClick(e, '/chat')}>
                        <li className={`list-group-item pl-3 pr-3 d-flex align-items-center ${isActive('/chat', true) ? 'active' : ''}`}>
                            <img src={chat_icon} alt="Chat" />
                            <span className='d-flex justify-content-between w-100'>
                                <span className="link_name">Chat</span>
                                <span className='text-light chat_counter'>6</span>
                            </span>
                        </li>
                    </Link>

                    <Link to="/template" onClick={(e) => handleProtectedClick(e, '/template')}>
                        <li className={`list-group-item pl-3 pr-3 d-flex align-items-center ${isActive('/template', true) ? 'active' : ''}`}>
                            <img src={template_icon} alt="Template" />
                            <span className="link_name">Template</span>
                        </li>
                    </Link>
                </ul>
            </div>

            {isAuthenticated ? (
                <div className="sidebar_bottom_user_details d-flex align-items-center osahan-post-header mb-3 people-list position-absolute bottom-0 ml-3">
                    <div className="dropdown-list-image mr-3">
                        <img
                            className="rounded-circle"
                            src={avatarUrl}
                            alt="User profile"
                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = default_profilePicture;
                            }}
                        />
                        <div className="status-indicator bg-success"></div>
                    </div>
                    <div className="font-weight-bold mr-2 side_bar_user_name text-capitalize">
                        <div className="text-truncate">
                            <Link to={`/profile/${userId}`} className="text-dark">
                                {userName || 'My Profile'}
                            </Link>
                        </div>
                        {username && <div className="small text-gray-500">@{username}</div>}
                    </div>
                </div>
            ) : (
                <div className="sidebar_bottom_user_details position-absolute bottom-0 ml-3 mb-3">
                    <button
                        onClick={() => showAuthModal && showAuthModal('signup')}
                        className="btn btn-primary"
                        style={{
                            background: "linear-gradient(84.41deg, #C207E7 1.78%, #490481 69.04%)",
                            border: 'none',
                            borderRadius: '20px',
                            padding: '8px 16px',
                            width: '100%'
                        }}
                    >
                        Sign Up
                    </button>
                </div>
            )}
        </aside>
    );
}

export default SideBarNav;
