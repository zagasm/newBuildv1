import React, { Fragment, useState, useEffect } from 'react';
import zagasmLogo from "../../../assets/ZAGASM_LOGO_ICON_V2_350PX.png";
import './style.css';
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';

function AuthContainer({ title, description, children }) {
    return (
        <Fragment>
            <div className="auth-background" >
                {/* Main Content */}
                <div className="container-fluid position-relative auth_container">
                   <div className="row justify-content-center align-items-center d-flex align-center mb-5 inner_form_con">
                        <div className="col-xl-3 col-lg-7 col-md-6  col form_container ">
                            <div className="">
                                <div className="text-center  pr-4 pl-4">
                                    <p style={{ display: 'flex', justifyContent: 'center', marginBottom: '60px' }}>
                                        <a href="#">
                                            <img src={zagasmLogo} alt="Zagasm Logo" style={{ width: '50px', height: '50px', }} />
                                        </a>
                                    </p>
                                    <motion.h5 initial={{ opacity: 0, x: -70 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.9, ease: "easeOut" }} className=" container_heading_text" >{title}</motion.h5>

                                    {/* <motion.p initial={{ opacity: 0, x: 70 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.9, ease: "easeOut" }} className="text-muted" style={{ color: '#0D4049' }} >{description}</motion.p> */}
                                </div>
                                {children}
                            </div>
                        </div>
                    </div>
                     {/* <div className="auth_footer ">
                        <div className=''><a href="">Language</a></div>
                        <ul>
                            <li><a href="#">Terms and conditions </a></li>
                            <li><Link to={'/privacy-policy'}>Privacy and policy  </Link></li>
                            <li><a href="#">Help  </a></li>
                        </ul>
                    </div> */}
                </div>
            </div>
        </Fragment>
    );
}
export default AuthContainer;
