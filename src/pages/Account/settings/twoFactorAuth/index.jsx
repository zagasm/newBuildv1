import React, { useEffect, useState } from "react";
import { FiX, FiLock, FiArrowLeft, FiMail, FiUser, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import axios from 'axios';
import { Link } from "react-router-dom";
import './twoFactocAuthStyling.css';


function TwoFactorAuth() {
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
                                    <h6 className="m-0">Two Factor Authenticator</h6>

                                </div>
                                <div className="d-flex align-items-center"></div>
                            </div>
                            <p className="text-center">Add an extra layer of security to your account.</p>
                        </div>
                        <div className="twoFactorContainer">
                            <div className="row shadow-sm p-3 mb-4">
                                <ul className="list-unstyled   p-0 m-0">
                                    <li className="switch_card" >
                                        <div className="d-flex align-items-center gap-3 pb-2 justify-content-between">
                                            <h6>Authentication App (Recommended) <br />
                                                <small className="text-muted">
                                                    Connect with Google Authenticator.
                                                </small>
                                            </h6>
                                            <button className="twoFactorAuthBtn">Set up</button>
                                        </div>
                                    </li>
                                </ul>
                                <ul className="list-unstyled   p-0 m-0 mt-4">
                                    <li className="switch_card" >
                                        <div className="d-flex align-items-center gap-3 pb-2 justify-content-between">
                                            <h6>SMS Authentication <br />
                                                <small className="text-muted">
                                                    Receive a one-time code via text message
                                                </small>
                                            </h6>
                                            <button className="twoFactorAuthBtn">Add Phone number</button>
                                        </div>
                                    </li>
                                </ul>
                                <ul className="list-unstyled   p-0 m-0 mt-4">
                                    <li className="switch_card" >
                                        <div className="d-flex align-items-center gap-3 pb-2 justify-content-between">
                                            <h6>Email Authentication <br /> <small>Connect with Google Authenticator.</small></h6>
                                            <label className="switch">
                                                <input type="checkbox" />
                                                <span className="slider round"></span>
                                            </label>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                             <div className="row shadow-sm p-3 mb-4">
                                <ul className="list-unstyled   p-0 m-0">
                                    <li className="switch_card" >
                                        <div className="d-flex align-items-center gap-3 pb-2 justify-content-between">
                                            <h6>Backup Options
                                            </h6>
                                        </div>
                                    </li>
                                </ul>
                                <ul className="list-unstyled   p-0 m-0 mt-4">
                                    <li className="switch_card" >
                                        <div className="d-flex align-items-center gap-3 pb-2 justify-content-between">
                                            <h6>Recovery Email <br />
                                                <small className="text-muted">
                                                   Add a secondary email email for account recovery.
                                                </small>
                                            </h6>
                                            <button className="twoFactorAuthBtn">Add email</button>
                                        </div>
                                    </li>
                                </ul>
                                <ul className="list-unstyled   p-0 m-0 mt-4">
                                    <li className="switch_card" >
                                            <p style={{fontSize:'12px'}}><small>Keep your backup codes safe. If you lose your phone and codes, you may be locked out of your account.</small></p>
                                    </li>
                                </ul>
                            </div>
                            <div className="twofactorButtonSection">
                                <button className="cancleBtn">Cancle</button>
                                <button className="saveBtn">Save Settings</button>
                            </div>
                        </div>
                    </main>
                </div>
            </div >
        </div >
    );
}

export default TwoFactorAuth;