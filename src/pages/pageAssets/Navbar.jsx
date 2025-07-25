import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/zagasm_logo.png';
import Edit_icon from '../../assets/nav_icon/Edit_icon.png';
import search_icon from '../../assets/nav_icon/search_icon.png';
import bell_icon from '../../assets/nav_icon/Bell.png';
import default_profilePicture from '../../assets/avater_pix.avif';
import MobileNav from './MobileNav';
import { useAuth } from '../auth/AuthContext';

const Navbar = () => {
    const { user, isAuthenticated, logout, showAuthModal } = useAuth();
    
    // Safe defaults for user data
    const userData = user?.user || {};
    const Default_user_image = user?.avatar || default_profilePicture;
    const userName = `${userData.last_name || ''} ${userData.first_name || ''}`.trim() || 'Profile';
    const userId = userData.meta_data?.id || '';

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
                                    style={{ cursor: 'pointer' }}
                                >
                                    <img src={Edit_icon} alt="create post icon" /> 
                                    <span>Create a Post</span>
                                </button>
                            )}
                        </li>
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
                                    onClick={() => showAuthModal('signup')}
                                    className="btn btn-primary"
                                    style={{
                                        background: '#8F07E7',
                                        border: 'none',
                                        borderRadius: '20px',
                                        padding: '8px 16px',
                                        marginLeft: '10px'
                                    }}
                                >
                                    Sign Up
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
                                            src={Default_user_image}
                                            alt="User Profile"
                                            style={{ width: '32px', height: '32px', objectFit: 'cover' }}
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
                                                    src={Default_user_image} 
                                                    alt="User" 
                                                    style={{ width: '40px', height: '40px' }}
                                                />
                                            </div>
                                            <div className="font-weight-bold">
                                                <div className="text-truncate m-0 p-0" style={{ fontWeight: 'lighter' }}>
                                                    {userName}
                                                </div>
                                            </div>
                                        </div>
                                        <Link
                                            className="dropdown-item border-bottom py-2"
                                            to={`/${userId}`}
                                        >
                                            <i className="feather-settings mr-2"></i> Settings
                                        </Link>
                                        <Link
                                            onClick={() => logout()}
                                            className="dropdown-item py-2"
                                            style={{ color: 'red' }}
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