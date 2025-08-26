import React, { useEffect, useState } from "react";
import { FiX, FiLock, FiArrowLeft, FiMail, FiUser, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import axios from 'axios';
import { Link } from "react-router-dom";
import './linkedAccountStyling.css';
import plan_icon from '../../../../assets/nav_icon/plan_icon.png';
import instagram_icon from '../../../../assets/nav_icon/instagram_icon.png';
import apple_icon from '../../../../assets/nav_icon/apple_icon.png';
import google_icon from '../../../../assets/nav_icon/google_icon.png';
import x_icon from '../../../../assets/nav_icon/x_icon.png';
import facebook_icon from '../../../../assets/nav_icon/facebook_icon.png';

function ChangeLanguage() {
    return (
        <div className="py-4">
            <div className="container-fluid p-0">
                <div className="r offset-xl-3 offset-lg-1 offset-md-1 bg-none home_section">
                    <main className="col col-xl-6 col-lg-8 col-md-12 col-sm-12 col-12 main_container m-0 pr-3 pl-3  pt-5 ">
                        <div className="account-header" style={{ marginBottom: '50px' }}>
                            <div className="d-flex align-items-center justify-content-between mb-5">
                                <Link to={'/account/settings'} className="d-flex align-items-center text-dark ">
                                    <i className="fa fa-arrow-left"></i>
                                </Link>
                                <div className="d-flex align-items-center">
                                    <h6 className="m-0">Manage Connected Devices</h6>
                                </div>
                                <div className="d-flex align-items-center"></div>
                            </div>
                        </div>
                        <div>
                            <div className="row">
                                <ul className="list-unstyled   p-0 m-0">
                                    <li className="shadow-sm linkedaccount_card">
                                        <div className="d-flex align-items-center p-2 m-0 justify-content-between">
                                            <span><img src={google_icon} alt="" /></span>
                                            <button className="btn">Connect <img src={plan_icon} alt="" /></button>
                                        </div>
                                    </li>
                                    <li className="shadow-sm linkedaccount_card">
                                        <div className="d-flex align-items-center p-2 m-0 justify-content-between">
                                            <span><img src={apple_icon} alt="" /> <small>Apple</small></span>
                                            <button className="btn">Connect <img src={plan_icon} alt="" /></button>
                                        </div>
                                    </li>
                                    <li className="shadow-sm linkedaccount_card">
                                        <div className="d-flex align-items-center p-2 m-0 justify-content-between">
                                            <span><img src={instagram_icon} alt="" /> </span>
                                            <button className="btn">Connect <img src={plan_icon} alt="" /></button>
                                        </div>
                                    </li>
                                    <li className="shadow-sm linkedaccount_card">
                                        <div className="d-flex align-items-center p-2 m-0 justify-content-between">
                                            <span><img src={x_icon} alt="" /> </span>
                                            <button className="btn">Connect <img src={plan_icon} alt="" /></button>
                                        </div>
                                    </li>
                                    <li className="shadow-sm linkedaccount_card">
                                        <div className="d-flex align-items-center p-2 m-0 justify-content-between">
                                            <span><img src={facebook_icon} alt="" /> <small>Facebook</small></span>
                                            <button className="btn">Connect <img src={plan_icon} alt="" /></button>
                                        </div>
                                    </li>
                                </ul>
                                <div className="col-lg-12 m-0 p-0">
                                        <b>NB:</b>
                                        <p>Connecting accounts helps secure your profile and makes logging in across devices easier.</p>
                                   

                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div >
        </div >
    );
}

export default ChangeLanguage;