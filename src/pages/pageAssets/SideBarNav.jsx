import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './navStyle.css';
import SidebarLoader from '../../component/assets/Loader/sidebarLoader';
import home_icon from '../../assets/nav_icon/Home.svg';
import saved_icon from '../../assets/nav_icon/saved_icon.svg';
import chat_icon from '../../assets/nav_icon/chat_icon.svg';
import template_icon from '../../assets/nav_icon/template_icon.svg';
import { useAuth } from '../auth/AuthContext';
import default_profilePicture from '../../assets/avater_pix.avif';

function SideBarNav() {
    const [isLoading, setIsLoading] = useState(true);
    const { user, isAuthenticated, showAuthModal } = useAuth();
    const location = useLocation();
    
    // Safe defaults for user data
    const Default_user_image = user?.user_picture || default_profilePicture;
    const userName = user?.user ? `${user.user.last_name || ''} ${user.user.first_name || ''}`.trim() : '';
    const username = user?.user?.username || '';
    const userId = user?.user?.id || '';

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    // Improved active route detection
    const isActive = (path, exact = false) => {
        if (exact) {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    const handleProtectedClick = (e, path) => {
        if (!isAuthenticated) {
            e.preventDefault();
            showAuthModal('login');
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

                    <Link to="/explore">
                        <li className={`list-group-item pl-3 pr-3 d-flex align-items-center ${isActive('/explore', true) ? 'active' : ''}`}>
                            <img src={saved_icon} alt="Explore" />
                            <span className="link_name">Saved posts</span>
                        </li>
                    </Link>

                    <Link 
                        to="/chat" 
                        onClick={(e) => handleProtectedClick(e, '/chat')}
                    >
                        <li className={`list-group-item pl-3 pr-3 d-flex align-items-center ${isActive('/chat', true) ? 'active' : ''}`}>
                            <img src={chat_icon} alt="Chat" />
                            <span className="link_name">Chat</span>
                        </li>
                    </Link>

                    <Link to="/template">
                        <li className={`list-group-item pl-3 pr-3 d-flex align-items-center ${isActive('/template', true) ? 'active' : ''}`}>
                            <img src={template_icon} alt="Template" />
                            <span className="link_name">Template</span>
                        </li>
                    </Link>
                </ul>
            </div>

            {isAuthenticated ? (
                <div className="d-flex align-items-center osahan-post-header mb-3 people-list position-absolute bottom-0 ml-3">
                    <div className="dropdown-list-image mr-3">
                        <img 
                            className="rounded-circle" 
                            src={Default_user_image} 
                            alt="User profile" 
                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                        />
                        <div className="status-indicator bg-success"></div>
                    </div>
                    <div className="font-weight-bold mr-2 side_bar_user_name">
                        <div className="text-truncate">
                            <Link to={`/${userId}`} className="text-dark">
                                {userName || 'My Profile'}
                            </Link>
                        </div>
                        {username && <div className="small text-gray-500">@{username}</div>}
                    </div>
                </div>
            ) : (
                <div className="position-absolute bottom-0 ml-3 mb-3">
                    <button 
                        onClick={() => showAuthModal('signup')}
                        className="btn btn-primary"
                        style={{
                            background: '#8F07E7',
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