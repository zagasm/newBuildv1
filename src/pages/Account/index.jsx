import React, { useState } from "react";
import { Icon } from "@iconify/react";
import default_profilePicture from '../../assets/avater_pix.webp';
import fire_icon from '../../assets/nav_icon/fire_icon.png';
import bell_icon from '../../assets/nav_icon/bell_icon.png';
import saved_post_icon from '../../assets/nav_icon/saved_post_icon.png';
import followers from '../../assets/nav_icon/followers.png';
import following_icon from '../../assets/nav_icon/following_icon.png';
import help_icon from '../../assets/nav_icon/help_icon.png';
import settings_icon from '../../assets/nav_icon/settings_icon.png';
import follow_memers from '../../assets/nav_icon/follow_memers.png';
import icon_shield from '../../assets/nav_icon/icon_shield.png';
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import './accountStyling.css';
import LogoutModal from "./logout";
function Account() {
    const { user, token } = useAuth();
    // console.log(user,token);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
    return (
        <div className="py-4">
            <div className="container-fluid p-0">
                <div className="ro offset-xl-3 offset-lg-1 offset-md-1 bg-none home_section">
                    <main className="col col-xl-6 col-lg-8 col-md-12 col-6-12 col-12 main_container   m-0 pt-5">
                        <div className="account-header">
                            <Link to={'/profile/' + user.id} className="card rounded shadow-sm border-0 text-dark m-2">
                                <div className="card-body d-flex align-items-center justify-content-between p-3">
                                    <div className="d-flex align-items-center ">
                                        <img src={user.meta_data.profile_picture || default_profilePicture} className="nav_icon_img img-profile rounded-circle mt-2" alt="Profile" />
                                        <div style={{lineHeight:'2px'}}>
                                            <h6 className="text-muted  ml-2 text-capitalize" >{user.first_name + ' ' + user.last_name}</h6>
                                            <small className="text-muted  ml-2 text-capitalize" >@{ user.username || user.phone || user.email }</small>
                                        </div>
                                    </div>
                                    {/* <div className="d-flex align-items-center">
                                        <span className="p-2 pt-1 pb-1" style={{ background: 'rgba(194, 189, 189, 0.24)', borderRadius: '50%' }}><i className="fa fa-angle-down "></i></span>
                                    </div> */}
                                </div>
                            </Link>
                        </div>
                        <div className="account-nav mt-4">
                            <div className="row">
                                <div className="col-lg-6 col-6">
                                    <Link to={'/'} className="shadow-sm card rounded border-0 mb-4 account-nav-link">
                                        <div className="card-body">
                                            <div className="d-flex align-item gap-3 font-weight-500">
                                                <span>Feed</span>
                                                <img src={fire_icon} alt="" />
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div className="col-lg-6 col-6">
                                    <Link to={'/notification'} className="shadow-sm card rounded border-0 mb-4 account-nav-link">
                                        <div className="card-body">
                                            <div className="d-flex align-item gap-3 font-weight-500">
                                                <span>Notification</span>
                                                <img src={bell_icon} alt="" />
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div className="col-lg-6 col-6">
                                    <Link to={'/save-post'} className="shadow-sm card rounded border-0 mb-4 account-nav-link">
                                        <div className="card-body">
                                            <div className="d-flex align-item gap-3 font-weight-500">
                                                <span>Saved</span>
                                                <img src={saved_post_icon} alt="" />
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div className="col-lg-6 col-6">
                                    <Link to="/account/followers" className="shadow-sm card rounded border-0 mb-4 account-nav-link">
                                        <div className="card-body">
                                            <div className="d-flex align-item gap-3 font-weight-500">
                                                <span>Followers</span>
                                                <img src={followers} alt="" />
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div className="col-lg-6 col-6">
                                    <Link to={'following'} className="shadow-sm card rounded border-0 mb-4 account-nav-link">
                                        <div className="card-body">
                                            <div className="d-flex align-item gap-3 font-weight-500">
                                                <span>Following</span>
                                                <img src={following_icon} alt="" />
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div className="col-lg-6 col-6">
                                    <Link className="shadow-sm card rounded border-0 mb-4 account-nav-link">
                                        <div className="card-body">
                                            <div className="d-flex align-item gap-3 font-weight-500">
                                                <span>Help</span>
                                                <img src={help_icon} alt="" />
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div className="col-lg-6 col-6">
                                    <Link to={'/account/settings'} className="shadow-sm card rounded border-0 mb-4 account-nav-link">
                                        <div className="card-body">
                                            <div className="d-flex align-item gap-3 font-weight-500">
                                                <span>Settings</span>
                                                <img src={settings_icon} alt="" />
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div className="col-lg-6 col-6 ">
                                    <Link className="shadow-sm card rounded border-0 mb-4 account-nav-link">
                                        <div className="card-body">
                                            <div className="d-flex align-item gap-3 font-weight-500">
                                                <span className="truncate-mobile">Follow memmers</span>
                                                <img src={follow_memers} alt="" />
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div className="col-lg-6 col-6">
                                    <Link className="shadow-sm card rounded border-0 mb-4 account-nav-link">
                                        <div className="card-body">
                                            <div className="d-flex align-item gap-3 font-weight-500">
                                                <span className="truncate-mobile">Policy and privacy</span>
                                                <img src={icon_shield} alt="" />
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div className="col-lg-6 col-6">
                                    <Link className="shadow-sm card rounded border-0 mb-4 account-nav-link">
                                        <div className="card-body">
                                            <div className="d-flex align-item gap-3 font-weight-500">
                                                <span className="truncate-mobile">Terms and condition</span>
                                                <img src={icon_shield} alt="" />
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div className="col-lg-12 ">
                                    <div onClick={() => setShowLogoutConfirm(true)} style={{ background: 'rgba(194, 189, 189, 0.24)', cursor: 'pointer' }} className="shadow-sm card rounded border-0 p-2  mb-4 account-nav-link">

                                        <div className="d-flex align-item justify-content-center gap-2">
                                            <span className="font-weight-bold">Log Out</span>
                                            <Icon className="mt-1" icon="mdi:logout" style={{ fontSize: '20px', color: 'black' }} />
                                        </div>
                                    </div>
                                </div>
                                {showLogoutConfirm && (
                                    <LogoutModal setShowLogoutConfirm={setShowLogoutConfirm} />
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default Account;