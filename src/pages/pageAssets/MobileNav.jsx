import React, { useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './navStyle.css';
import { useAuth } from '../auth/AuthContext';
import home_icon from '../../assets/nav_icon/Home.svg';
import saved_icon from '../../assets/nav_icon/saved_icon.svg';
import chat_icon from '../../assets/nav_icon/chat_icon.svg';
import template_icon from '../../assets/nav_icon/template_icon.svg';
import create_post_icon from '../../assets/nav_icon/create_post_icon.png';
import mobile_create_post from '../../assets/nav_icon/mobile_create_post.svg';
import default_profilePicture from '../../assets/avater_pix.webp';

function MobileNav() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isAuthenticated, showAuthModal } = useAuth();

    // Compute avatar URL & user data with cache-busting
    const { avatarUrl, userId } = useMemo(() => {
        const safeUser = user || {};
        const meta = safeUser.meta_data || {};
        let avatar = default_profilePicture;

        if (meta.profile_picture) {
            avatar = `${meta.profile_picture}?t=${new Date().getTime()}`;
        }

        return {
            avatarUrl: avatar,
            userId: safeUser.id || ''
        };
    }, [user]);

    const profileLink = userId ? `/account` : '/auth/signin';
    // const profileLink = userId ? `/profile/${userId}` : '/auth/signin';

    const isActive = (path, exact = false) => {
        if (!path) return false;
        return exact ? location.pathname === path : location.pathname.startsWith(path);
    };

    const handleProtectedClick = (e, path) => {
        if (!isAuthenticated) {
            e.preventDefault();
            showAuthModal ? showAuthModal('login') : navigate('/auth/signin');
        }
    };

    // Check if current route is /create-post
    const isCreatePostRoute = location.pathname === '/create-post';
    const removeCreatePost = location.pathname.startsWith('/chat');
    const createPost = location.pathname.startsWith('/create-post');
    return (
        <div className="shadow-sm mobile_navbar_container">
            {isAuthenticated && !isCreatePostRoute && (
                <>
                    {
                        (!removeCreatePost && <Link
                            to="/create-post"
                            onClick={(e) => handleProtectedClick(e, '/create-post')}
                            className="create_post"
                        >
                            <img src={create_post_icon} alt="Create Post" />
                        </Link>)
                    }
                </>
            )}
            <div className="box rounded list-sideba">
                <ul className="side_bar_na p-0">
                    <Link to="/" className={isActive('/', true) ? 'active' : ''}>
                        <img src={home_icon} alt="Home" />
                        <span className="mobile_icon_name">Home</span>
                    </Link>

                    {isAuthenticated && !isCreatePostRoute && (
                        <>
                            {
                                (
                                    removeCreatePost &&
                                    <Link to="/create-post" className={isActive('/create-post', true) ? 'active' : ''}>
                                        <img src={mobile_create_post} className='create_post_mobile' alt="Create Post" />
                                        <span className="mobile_icon_name">create Meme</span>
                                    </Link>
                                )
                            }
                        </>
                    )}

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
                        onClick={(e) => handleProtectedClick(e, '/template')}
                        className={isActive('/template', true) ? 'active' : ''}
                    >
                        <img src={template_icon} alt="Templates" />
                        <span className="mobile_icon_name">Template</span>
                    </Link>

                    <Link
                        to={profileLink}
                        onClick={(e) => !isAuthenticated && handleProtectedClick(e, profileLink)}
                        className={isActive(profileLink, true) ? 'active' : ''}
                    >
                        <img
                            style={{ width: '30px', height: '30px', filter: 'none' }}
                            className="img-profile rounded-circle"
                            src={avatarUrl}
                            alt="User Profile"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = default_profilePicture;
                            }}
                        />
                        <span className="mobile_icon_name">
                            {isAuthenticated ? 'Account' : 'Login'}
                        </span>
                    </Link>
                </ul>
            </div>
        </div>
    );
}

export default MobileNav;
