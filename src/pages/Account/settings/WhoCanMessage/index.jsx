import React, { useEffect, useState } from "react";
import { FiX, FiLock, FiArrowLeft, FiMail, FiUser, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import axios from 'axios';
import { Link } from "react-router-dom";
import './whoCanMessageStyling.css';


function WhoCanMessage() {
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
                                    <h6 className="m-0">Who Can Message Me</h6>
                                </div>
                                <div className="d-flex align-items-center"></div>
                            </div>
                        </div>
                        <div>
                            <div className="row shadow-sm p-3 mb-4">
                                <ul className="list-unstyled   p-0 m-0">
                                    <li className="switch_card">
                                        <div className="d-flex align-items-center gap-3 pb-2 justify-content-between">
                                            <h6>Safe mode</h6>
                                            <label className="switch">
                                                <input type="checkbox" />
                                                <span className="slider round"></span>
                                            </label>
                                        </div>
                                        <ul>
                                            <li>Anyone on Zagasm can send you a message. </li>
                                            <li>⚠️ May include spam or unknown users.</li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                             <div className="row shadow-sm p-3 mb-4">
                                <ul className="list-unstyled   p-0 m-0">
                                    <li className="switch_card">
                                        <div className="d-flex align-items-center gap-3 pb-2 justify-content-between">
                                            <h6>People I Follow</h6>
                                            <label className="switch">
                                                <input type="checkbox" />
                                                <span className="slider round"></span>
                                            </label>
                                        </div>
                                        <ul>
                                            <li>Only users you follow can message you.  </li>
                                            <li>✅ Best for keeping your inbox cleaner.</li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                             <div className="row shadow-sm p-3 mb-4">
                                <ul className="list-unstyled   p-0 m-0">
                                    <li className="switch_card">
                                        <div className="d-flex align-items-center gap-3 pb-2 justify-content-between">
                                            <h6>Followers Only</h6>
                                            <label className="switch">
                                                <input type="checkbox" />
                                                <span className="slider round"></span>
                                            </label>
                                        </div>
                                        <ul>
                                            <li>Anyone who follows you can message.  </li>
                                            <li>💬 Good for creators who want audience access.</li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                             <div className="row shadow-sm p-3 mb-4">
                                <ul className="list-unstyled   p-0 m-0">
                                    <li className="switch_card">
                                        <div className="d-flex align-items-center gap-3 pb-2 justify-content-between">
                                            <h6>Nobody</h6>
                                            <label className="switch">
                                                <input type="checkbox" />
                                                <span className="slider round"></span>
                                            </label>
                                        </div>
                                        <ul>
                                            <li>Blocks all direct messages. </li>
                                            <li>🔒 You won’t receive any new chats. </li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                            
                        </div>
                    </main>
                </div>
            </div >
        </div >
    );
}

export default WhoCanMessage;