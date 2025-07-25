import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './navStyle.css';
import { useAuth } from '../auth/AuthContext';
import home_icon from '../../assets/nav_icon/Home.svg';
import saved_icon from '../../assets/nav_icon/saved_icon.svg';
import chat_icon from '../../assets/nav_icon/chat_icon.svg';
import template_icon from '../../assets/nav_icon/template_icon.svg';
import default_profilePicture from '../../assets/avater_pix.avif';

function MobileNav() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isAuthenticated, showAuthModal } = useAuth();

    const Default_user_image = user?.user_picture || default_profilePicture;
    const userId = user?.user_id || user?.user?.id || '';
    const profileLink = userId ? `/${userId}` : null;

    const isActive = (path, exact = false) => {
        if (!path) return false;
        if (exact) {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    const handleProtectedClick = (e, path) => {
        if (!isAuthenticated) {
            e.preventDefault();
            showAuthModal ? showAuthModal('login') : navigate('/auth/signin');
        }
    };

    // Check if current route is /create-post
    const isCreatePostRoute = location.pathname === '/create-post';

    return (
        <div>
            <div className="shadow-sm mobile_navbar_container">
                {!isCreatePostRoute && (
                    <Link
                        to="/create-post"
                        onClick={(e) => handleProtectedClick(e, '/create-post')}
                        className="create_post"
                    >
                        <img src={chat_icon} alt="Create Post" />
                    </Link>
                )}
                <div className="box rounded list-sideba">
                    <ul className="side_bar_na p-0">
                        <Link
                            to="/"
                            className={isActive('/', true) ? 'active' : ''}
                        >
                            <img src={home_icon} alt="Home" />
                            <span className="mobile_icon_name">Home</span>
                        </Link>
                        <Link
                            to="/explore"
                            className={isActive('/explore', true) ? 'active' : ''}
                        >
                            <img src={saved_icon} alt="Explore" />
                            <span className="mobile_icon_name">Saved Posts</span>
                        </Link>
                        <Link
                            to="/chat"
                            onClick={(e) => handleProtectedClick(e, '/chat')}
                            className={isActive('/chat', true) ? 'active' : ''}
                        >
                            <img src={chat_icon} alt="Chat" />
                            <span className="mobile_icon_name">Chat</span>
                        </Link>

                        <Link
                            to="/template"
                            className={isActive('/template', true) ? 'active' : ''}
                        >
                            <img src={template_icon} alt="Templates" />
                            <span className="mobile_icon_name">Template</span>
                        </Link>

                        <Link
                            to={isAuthenticated ? profileLink : '/auth/signin'}
                            onClick={(e) => handleProtectedClick(e, profileLink)}
                            className={
                                isAuthenticated && isActive(profileLink, true)
                                    ? 'active'
                                    : ''
                            }
                        >
                            <img
                                style={{ width: '30px', height: '30px', filter: 'none' }}
                                className="img-profile rounded-circle"
                                src={Default_user_image}
                                alt="User Profile"
                            />
                            <span className="mobile_icon_name">
                                {isAuthenticated ? 'Account' : 'Login'}
                            </span>
                        </Link>
                    </ul>
                </div>
            </div>
        </div>
    );
}
export default MobileNav;
