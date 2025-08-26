import React, { useState, useEffect, useRef } from 'react';
import SingleTemplateComponent from '../../../component/Template/singleTemplate';
import SideBarNav from '../../pageAssets/sideBarNav';
import RightBarComponent from '../../pageAssets/rightNav';
import SuggestedFriends from '../../../component/Friends/suggestedFriends';
import '../AllTemplate/templateSTyle.css';

export default function VewTemplates() {
    return (
        <div className="py-4">
            <div className="container-fluid p-0 template-card">
                <SideBarNav />
                <div className="ro offset-xl-2 offset-lg-1 offset-md-1  bg-none home_section">
                    <main className="col col-xl-11  col-lg-11  col-md-12 col-sm-12 col-12 main_container  m-1 pt-5 " >
                        <div className="template-headSection pt-2 pb-4 m-0 mb-5 ">
                            <div className="col-xl-12 col-lg-12 col-md-8  col-sm-6  m-0 pr-0 ">
                                <div className="row">
                                    <div className="col-xl-3 col-lg-4 col-md-12  col-sm-12 m-0 p-0 ">
                                        <div className="template_title ">
                                            <h6 className="text-muted p-0 mb-2">Template title</h6>
                                            <img className="card-img-top"
                                                src='https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
                                                loading="lazy"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-xl-6 col-lg-4 col-md-12  col-sm-12   pr-0 ">
                                    
                                    
                                    
                                    </div>
                                    <div className="col-xl-3 col-lg-4 col-md-12  col-sm-12  pr-0 ">
                                        <div className='use_template_container' >
                                            <button>Use Template</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer justify-content-between bg-transparen border-0 d-flex align-items-center mb-4">
                            <div className="d-flex">
                                <img
                                    className="rounded-circle "
                                    src="https://randomuser.me/api/portraits/men/41.jpg"

                                    width="32"
                                    height="32"
                                />
                                <div>
                                    <small className="text-muted">Barnabas</small>
                                </div>
                            </div>
                            <a className="right_foot" style={{ color: '#8000FF', fontWeight: '600' }} href="#">
                                More from Creator <i className='fa fa-angle-right' style={{paddingBottom:'-10px'}}></i>
                            </a>
                        </div>
                        <div className='row'>
                            <SingleTemplateComponent />
                        </div>
                    </main>

                </div>
            </div>
        </div>
    );
}