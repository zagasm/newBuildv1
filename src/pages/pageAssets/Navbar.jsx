import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/zagasm_logo.png';
import Edit_icon from '../../assets/nav_icon/Edit_icon.png';
import search_icon from '../../assets/nav_icon/search_icon.png';
import bell_icon from '../../assets/nav_icon/Bell.png';
import default_profilePicture from '../../assets/avater_pix.webp';
import MobileNav from './MobileNav';
import { useAuth } from '../auth/AuthContext';

const Navbar = () => {
    const { user, isAuthenticated, logout, showAuthModal, token } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    // console.log('checking Nav', user);
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

    return (
        <>
            <MobileNav />
            <nav className="navbar navbar-expand osahan-nav-top p-0 w-100 position-fixed" style={{ background: 'white', zIndex: 1030 }}>
                <div className="container-fluid p-3">
                    <Link className="navbar-brand" to="/">
                        <img src={logo} alt="Zagasm Logo" className="zagasm_logo" />
                    </Link>
                    <form className="d-none d-sm-inline-block form-inline mr-auto my-2 my-md-0 mw-100 navbar-search nav_search"></form>

                    <ul className="navbar-nav middle_nav text-center">
                        <li className="nav-item">
                            <Link className="nav-link search_form" to="/explore">
                                <i className='fa fa-search mr-2 ml-3'></i>
                                <span>search for memes, creator...</span>
                            </Link>
                        </li>
                        <li className="nav-item dropdown no-arrow mx- osahan-list-dropdown mr-5">
                            {isAuthenticated ? (
                                <Link to={'/create-post'} className="nav-link dropdown-toggl create_post_btn shadow-sm p-3 text-light">
                                    <img src={Edit_icon} alt="create post icon" />
                                    <span>Create a Post</span>
                                </Link>
                            ) : (
                                <button
                                    onClick={() => showAuthModal('login')}
                                    className="nav-link dropdown-toggl create_post_btn shadow-sm p-3 text-light"
                                    style={{ cursor: 'pointer', }}
                                >
                                    <img src={Edit_icon} alt="create post icon" />
                                    <span>Create a Post</span>
                                </button>
                            )}
                        </li>
                        {/* background: linear-gradient(0deg, #8F07E7, #8F07E7), */}


                    </ul>

                    <ul className="navbar-nav ml-auto d-flex align-items-center">
                        <li className="nav-item dropdown no-arrow mx-1 osahan-list-dropdown mobile_search">
                            <Link to="/explore" className="nav-link dropdown-toggle">
                                <img className='nav_icon_im m-0' src={search_icon} alt="search" />
                            </Link>
                        </li>

                        {!isAuthenticated ? (
                            <li className="nav-item">
                                <button
                                    onClick={() => showAuthModal('login')}
                                    className="btn btn-primary"
                                    style={{
                                        background: "linear-gradient(84.41deg, #C207E7 1.78%, #490481 69.04%)",
                                        border: 'none',
                                        borderRadius: '20px',
                                        padding: '8px 16px',
                                        marginLeft: '10px'
                                    }}
                                >
                                    Login
                                </button>
                            </li>
                        ) : (
                            <>
                                <li className="nav-item dropdown no-arrow mx-1 osahan-list-dropdown">
                                    <Link to={'/notification'} className="nav-link dropdown-toggle p-2">
                                        <img className='nav_icon_img' src={bell_icon} alt="notification icon" />
                                    </Link>
                                </li>

                                <li className="nav-item dropdown no-arro0 mx-1 osahan-list-dropdown profile_link">
                                    <button
                                        style={{
                                            borderRadius: '20px',
                                            padding: '5px 10px',
                                            marginLeft: '20px',
                                            border: 'none',
                                            background: 'transparent'
                                        }}
                                        className="nav-link dropdown-toggl shadow-sm"
                                        data-bs-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                    >
                                        <img
                                            className="nav_icon_img img-profile rounded-circle"
                                            src={avatarUrl}
                                            alt="User Profile"
                                            style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = default_profilePicture;
                                            }}
                                        />
                                        <span className='fa fa-bars ml-2'></span>
                                    </button>
                                    <div
                                        className="dropdown-list dropdown-menu dropdown-menu-end shadow-sm border-none"
                                        style={{ minWidth: '200px' }}
                                    >
                                        <div className="px-3 d-flex align-items-center py-2">
                                            <div className="dropdown-list-image mr-2">
                                                <img
                                                    className="rounded-circle nav_icon_img"
                                                    src={avatarUrl}
                                                    alt="User"
                                                    style={{ width: '40px', height: '40px' }}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = default_profilePicture;
                                                    }}
                                                />
                                            </div>
                                            <div className="font-weight-bold">
                                                <div className="text-truncate m-0 p-0 text-capitalize" style={{ fontWeight: 'lighter' }}>
                                                    {userName}
                                                </div>
                                            </div>
                                        </div>
                                        <Link
                                            className="dropdown-item border-bottom py-2"
                                            to={`/account`}
                                        // to={`/profile/${userId}`}
                                        >
                                            <i className="feather-settings mr-2"></i> Account
                                        </Link>
                                        <Link
                                            onClick={(e) => {
                                                e.preventDefault();
                                                logout();
                                            }}
                                            className="dropdown-item py-2"
                                            style={{ color: 'red' }}
                                            to="#"
                                        >
                                            <i className="feather-log-out mr-2"></i> Sign Out
                                        </Link>
                                    </div>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </nav>
        </>
    );
};

export default Navbar;