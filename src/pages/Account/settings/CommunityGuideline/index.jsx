import React, { useEffect, useState } from "react";
import { FiX, FiLock, FiArrowLeft, FiMail, FiUser, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import axios from 'axios';
import { Link } from "react-router-dom";
import './CommunityGuidelineStyling.css';


function CommunityGuideline() {
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
                                    <h6 className="m-0">Community Guideline</h6>
                                </div>
                                <div className="d-flex align-items-center"></div>
                            </div>
                        </div>
                        <div>
                            <div className="row shadow-sm p-3 mb-4">
                                <ul className="list-unstyled   p-0 m-0">
                                    <li className="switch_card">
                                        <div className="d-flex align-items-center gap-3 pb-2 justify-content-between">
                                            <p className="text-dark">Choose the quality for saving memes and videos. Higher quality gives you sharper visuals but may use more storage and data.</p>
                                        </div>
                                        <ul>
                                            <li>Be Respectful to others. </li>
                                            <li>No harassment, hate speech or bullying.</li>
                                            <li>No graphic violence or adult content.</li>
                                            <li>No illegal activities.</li>
                                            <li>No spamming or misinformation.</li>
                                        </ul>
                                    </li>
                                </ul>
                                <div className="mt-5">
                                    <p>Report any content that violates our guidelines.</p>
                                </div>
                            </div>

                        </div>
                    </main>
                </div>
            </div >
        </div >
    );
}

export default CommunityGuideline;