import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/zagasm_logo.png';
import logoMobile from '../../assets/ZAGASM_LOGO_ICON_V2_350PX.png';
import userImg from '../../assets/img/IMG_9488.jpeg';
import profileImg from '../../assets/img/IMG_9488.jpeg';
import p1 from '../../assets/img/p1.png';
import p2 from '../../assets/img/p2.png';
import p3 from '../../assets/img/p3.png';
import p4 from '../../assets/img/p4.png';
import home from '../../assets/home.png';
import bell_icon from '../../assets/nav_icon/Bell.png';
import Edit_icon from '../../assets/nav_icon/Edit_icon.png';
import search_icon from '../../assets/nav_icon/search_icon.png';

import default_profilePicture from '../../assets/avater_pix.avif';
// import './navStyle.css';
import MobileNav from './MobileNav';
import { useAuth } from '../auth/AuthContext';
import NotificationCounter from '../Notification/NotificationCounter';

const Navbar = () => {
    const { user, logout } = useAuth();
    const Default_user_image = user.user_picture || default_profilePicture;
    return (
        <>
            <MobileNav />
            <nav className="navbar navbar-expand osahan-nav-top p-0 w-100 position-fixed" style={{ background: 'white' }}>
                <div className="container-fluid p-3">
                    <Link className="navbar-brand " to="/">
                        <img src={logo}  alt="Zagasm Logo" className="zagasm_logo" />
                        {/* <img src={logoMobile} alt="Zagasm Logo Mobile" className="d-block d-md-none" /> */}
                    </Link>
                    <form className="d-none d-sm-inline-block form-inline mr-auto my-2 my-md-0 mw-100 navbar-search nav_search"></form>
                    <ul className="navbar-nav middle_nav text-center">
                        <li className="nav-item">
                            <Link className="nav-link search_form" to="/explore">
                               <i className='fa fa-search mr-2 ml-3'></i> <span>search for memes, creator...</span>
                            </Link>
                        </li>
                          <li className="nav-item dropdown no-arrow mx- osahan-list-dropdown mr-5">
                            <Link to={'/create-post'} className="nav-link dropdown-toggl create_post_btn shadow-sm p-3 text-light" >
                                <img src={Edit_icon} alt="notification icon" /> <span>Create a Post</span>
                            </Link>
                          
                        </li>
                    </ul>

                    <ul className="navbar-nav ml-auto d-flex align-items-center">
                        {/* Messages Dropdown */}

                      
                        {/* Alerts Dropdown */}
                         <li className="nav-item dropdown no-arrow mx-1 osahan-list-dropdown mobile_search ">
                            <Link to="/explore" className="nav-link dropdown-toggle " >
                                <img className='nav_icon_im m-0' src={search_icon} alt="" />
                            </Link> 
                        </li>
                        <li className="nav-item dropdown no-arrow mx-1 osahan-list-dropdown ">
                            <Link to={'/notification'} className="nav-link dropdown-toggle p-2" >
                                <img className='nav_icon_img'  src={bell_icon} alt="notification icon" />
                                {/* <span style={{ background: '#8F07E7', fontWeight:'700', fontSize:'9px',height:"18px", top:'5px', left:'19px', width:'18px',display:'flex',alignItems:'center', justifyContent:'center',paddingLeft:'1px' }} className="badge badge-counter  m-0"><NotificationCounter userId={user.user_id} /></span> */}
                            </Link> 
                        </li>
                        <li className="nav-item dropdown no-arro0 mx-1 osahan-list-dropdown profile_link">
                            <button style={{ borderRadius: '20px', padding: '5px 10px', marginLeft: '20px' }} className="nav-link dropdown-toggl shadow-sm " data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <img   className="nav_icon_img img-profile rounded-circle" src={Default_user_image} alt="User Profile" />
                                 <span className='fa fa-bars ml-2'></span>
                            </button>
                            <div style={{maxWidth:'20px', border:'none'}} className="dropdown-list dropdown-menu dropdown-menu-left shadow-sm dropdown-menu dropdown-menu-end dropdown-menu-left shadow-sm border-none">
                                <div className="px-3 d-flex align-items-center">
                                    <div className="dropdown-list-image ">
                                        <img className="rounded-circle nav_icon_img" src={Default_user_image} alt="User" />
                                    </div>
                                    <div className="font-weight-bold " style={{marginTop:'-20px'}}>
                                        <div className="text-truncate m-0 p-0" style={{fontWeight:'lighter'}}>{user.user_lastname} {user.user_firstname}</div>
                                        {/* <div className="small text-gray-500">@{user.user_name}</div> */}
                                    </div>
                                </div>
                                <Link style={{border:'none'}} className="dropdown-item border-bottom mb-3" to={"/" + user.user_id}><i className=" feather-settings mr-1"></i> Settings</Link>
                                
                                <Link onClick={() => logout()} className="dropdown-item  " style={{border:'none', color:'red'}} ><i className=" feather-log-out mr-1"></i> Sign Out</Link>
                            </div>
                        </li>


                    </ul>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
