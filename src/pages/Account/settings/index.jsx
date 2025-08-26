import React, { useState } from "react";
import { Icon } from "@iconify/react";
import default_profilePicture from '../../../assets/avater_pix.webp';
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import Music_plate_icon from '../../../assets/nav_icon/Music_plate_icon.png';
import './settingStyling.css';
import LogoutModal from "../logout";
import axios from "axios";

function AccountSettings() {
    const { user, logout, token } = useAuth();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
   
    return (
        <div className="py-4">
            <div className="container-fluid p-0">
                <div className="r offset-xl-3 offset-lg-1 offset-md-1 bg-none home_section">
                    <main className="col col-xl-6 col-lg-8 col-md-12 col-sm-12 col-12 main_container m-0 pr-3 pl-3  pt-5 ">
                        <div className="account-header">
                            <div className="car rounded ">
                                <div className="card-body d-flex align-items-center justify-content-between">
                                    <Link to={'/account'} className="d-flex align-items-center text-dark ">
                                        <i className="fa fa-arrow-left"></i>
                                    </Link>
                                    <div className="d-flex align-items-center">
                                        <h6 className="m-0">Settings</h6>
                                    </div>
                                    <div className="d-flex align-items-center"></div>
                                </div>
                            </div>
                        </div>
                        <div className="account-nav mt-4 ">
                            <div className="row">
                                <h6 className="p-0 pb-2">Account</h6>
                                <div className=" shadow-sm setting_card p-0">
                                    <ul className="list-unstyled  card-body p-0 m-0">
                                        <li>
                                            <Link to={'/account/change-user-profile'} className="d-flex align-items-center p-2 m-0 justify-content-between">
                                                <span>Change User Info</span>
                                                <span className="fa fa-angle-right mt-2"></span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to={'/account/manage-linked-account'} className="d-flex align-items-center p-2 m-0 justify-content-between">
                                                <span>Manage Linked Accounts</span>
                                                <span className="fa fa-angle-right mt-2"></span>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="row mt-4 ">
                                <h6 className="p-0 pb-2">Personalization</h6>
                                <div className=" shadow-sm setting_card p-0">
                                    <ul className="list-unstyled  card-body p-0 m-0">
                                        <li>
                                            <Link className="d-flex align-items-center p-2 m-0 justify-content-between">
                                                <span>Language</span>
                                                <span className="fa fa-angle-right mt-2"></span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to={'/account/meme-feed-preference'} className="d-flex align-items-center p-2 m-0 justify-content-between">
                                                <span>Meme Feed Preferences</span>
                                                <span className="fa fa-angle-right mt-2"></span>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="row mt-4 ">
                                <h6 className="p-0 pb-2">Privacy & Security</h6>
                                <div className=" shadow-sm setting_card p-0">
                                    <ul className="list-unstyled  card-body p-0 m-0">
                                        <li>
                                            <Link className="d-flex align-items-center p-2 m-0 justify-content-between">
                                                <span>Private Account</span>
                                                <div className="switch_card">
                                                    <label className="switch">
                                                        <input type="checkbox" />
                                                        <span className="slider round"></span>
                                                    </label>
                                                </div>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to={'/account/who-can-message'} className="d-flex align-items-center p-2 m-0 justify-content-between">
                                                <span>Who Can Message Me</span>
                                                <span className="fa fa-angle-right mt-2"></span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to={'/account/two-factor-authentication'} className="d-flex align-items-center p-2 m-0 justify-content-between">
                                                <span>Two - Factor Authentication</span>
                                                <span className="fa fa-angle-right mt-2"></span>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="row mt-4 ">
                                <h6 className="p-0 pb-2">App Preferences</h6>
                                <div className=" shadow-sm setting_card p-0">
                                    <ul className="list-unstyled  card-body p-0 m-0">
                                        <li>
                                            <Link className="d-flex align-items-center p-2 m-0 justify-content-between">
                                                <span>Download Quality</span>
                                                <span className="fa fa-angle-right mt-2"></span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="d-flex align-items-center p-2 m-0 justify-content-between">
                                                <span>Auto-Play Memes</span>
                                                <div className="switch_card">
                                                    <label className="switch">
                                                        <input type="checkbox" />
                                                        <span className="slider round"></span>
                                                    </label>
                                                </div>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="d-flex align-items-center p-2 m-0 justify-content-between">
                                                <span>Save memes to Device</span>
                                                <span className="fa fa-angle-right mt-2"></span>
                                            </Link>
                                        </li>
                                       
                                    </ul>
                                </div>
                            </div>
                            <div className="row mt-4 ">
                                <h6 className="p-0 pb-2">Legal & Support</h6>
                                <div className=" shadow-sm setting_card p-0">
                                    <ul className="list-unstyled  card-body p-0 m-0">
                                        <li>
                                            <Link to={'/account/community-guideline'} className="d-flex align-items-center p-2 m-0 justify-content-between">
                                                <span>Community Guideline</span>
                                                <span className="fa fa-angle-right mt-2"></span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="d-flex align-items-center p-2 m-0 justify-content-between">
                                                <span>Terms of Service</span>
                                                <div className="switch_card">
                                                    <label className="switch">
                                                        <input type="checkbox" />
                                                        <span className="slider round"></span>
                                                    </label>
                                                </div>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="d-flex align-items-center p-2 m-0 justify-content-between">
                                                <span>Privacy Policy</span>
                                                <span className="fa fa-angle-right mt-2"></span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="d-flex align-items-center p-2 m-0 justify-content-between">
                                                <span>Report a Problem</span>
                                                <span className="fa fa-angle-right mt-2"></span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to={'/account/delete-account'} style={{ color: 'rgba(179, 38, 30, 1)' }} className="d-flex align-items-center p-2 m-0 justify-content-between">
                                                <span>Delete Account</span>
                                                <span className="fa fa-angle-right mt-2"></span>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="row mt-4 ">
                                <div onClick={() => setShowLogoutConfirm(true)} style={{ background: 'rgba(224, 220, 220, 0.24)', cursor: 'pointer' }} className="shadow-sm card rounded border-0 p-2  mb-4 account-nav-link">
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

                       
                    </main>
                </div>
            </div>
        </div>
    );
}

export default AccountSettings;