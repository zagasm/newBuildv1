import React, { useEffect, useState } from "react";
import { FiX, FiLock, FiArrowLeft, FiMail, FiUser, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import axios from 'axios';
import { Link } from "react-router-dom";
import './linkedAccountStyling.css';


function MemePreference() {
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
                            <div className="row shadow-sm p-3 mb-4">
                                <h5 className="p-0 mb-4">Contents Types</h5>
                                <ul className="list-unstyled   p-0 m-0">
                                    <li className="">
                                        <div className="d-flex align-items-center gap-3  pb-2 justify-content-start">
                                            <span> <input type="checkbox" className="styled-checkbox" />  </span>
                                            <h6>Memes</h6>

                                        </div>
                                    </li>
                                    <li className="">
                                        <div className="d-flex align-items-center gap-3  pb-2 justify-content-start">
                                            <span><input type="checkbox" className="styled-checkbox" /></span>
                                            <h6>Trending Memes</h6>
                                        </div>
                                    </li>
                                    <li className="">
                                        <div className="d-flex align-items-center gap-3  pb-2 justify-content-start">
                                            <span><input type="checkbox" className="styled-checkbox" /></span>
                                            <h6>Templates</h6>
                                        </div>
                                    </li>

                                </ul>

                            </div>
                            <div className="row shadow-sm p-3 mb-4">
                                <div className="mb-4 m-0 p-0">
                                    <h5 className="p-0 m-0">Source Preferences</h5>
                                    <small>Pick the preference you want to show content from:</small>
                                </div>
                                <ul className="list-unstyled   p-0 m-0">
                                    <li className="">
                                        <div className="d-flex align-items-center gap-3  pb-2 justify-content-start">
                                            <span> <input type="checkbox" className="styled-checkbox" />  </span>
                                            <h6>Everyone</h6>

                                        </div>
                                    </li>
                                    <li className="">
                                        <div className="d-flex align-items-center gap-3  pb-2 justify-content-start">
                                            <span><input type="checkbox" className="styled-checkbox" /></span>
                                            <h6>People I follow</h6>
                                        </div>
                                    </li>
                                    <li className="">
                                        <div className="d-flex align-items-center gap-3  pb-2 justify-content-start">
                                            <span><input type="checkbox" className="styled-checkbox" /></span>
                                            <h6>Popular Memers</h6>
                                        </div>
                                    </li>
                                    <li className="">
                                        <div className="d-flex align-items-center gap-3  pb-2 justify-content-start">
                                            <span><input type="checkbox" style={{color:'white'}} className="styled-checkbox" /></span>
                                            <h6>Local Memers (near me)</h6>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="row shadow-sm p-3 mb-4">

                                <ul className="list-unstyled   p-0 m-0">
                                    <li className="switch_card">
                                        <div className="d-flex align-items-center gap-3 pb-2 justify-content-between">
                                            <h6>Safe mode <br /> <small>Hide sensitive or matured memes</small></h6>
                                            <label className="switch">
                                                <input type="checkbox" />
                                                <span className="slider round"></span>
                                            </label>
                                        </div>
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

export default MemePreference;