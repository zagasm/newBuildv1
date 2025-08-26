import React, { Fragment, useState, useEffect } from 'react';
import zagasmLogo from "../../../assets/ZAGASM_LOGO_ICON_V2_350PX.png";
import './style.css';
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';

function AuthContainer({ backRedirect, modal, title, description, children }) {
    return (
        <Fragment>
            <div className={modal ?'':"auth-background"} >
                {/* Main Content */}
                <div className="container-fluid position-relative auth_container">
                   <div style={modal&&{height:'200px'}} className={modal?'d-flex align-center mt-5':"row justify-content-center align-items-center d-flex align-center mb-5 inner_form_con"}>
                        <div className={modal ? ``:`col-xl-3 col-lg-7 col-md-6  col form_container `}>
                              {backRedirect && <button onClick={()=>backRedirect(false)} style={{color:'rgba(143, 7, 231, 1)'}} className='btn'> <i className='fa fa-angle-left'></i></button>}
                            <div className="">
                                <div className="text-center pl-3">
                                  {!modal &&  <p style={{ display: 'flex', justifyContent: 'center', marginBottom: '60px' }}>
                                        <a href="#">
                                            <img src={zagasmLogo} alt="Zagasm Logo" style={{ width: '50px', height: '50px', }} />
                                        </a>
                                    </p>}
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
                   
                </div>
            </div>
        </Fragment>
    );
}
export default AuthContainer;
