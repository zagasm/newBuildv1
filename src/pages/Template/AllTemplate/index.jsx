import React, { useState, useEffect, useRef } from 'react';
import SingleTemplateComponent from '../../../component/Template/singleTemplate';
import SideBarNav from '../../pageAssets/sideBarNav';
import RightBarComponent from '../../pageAssets/rightNav';
import SuggestedFriends from '../../../component/Friends/suggestedFriends';
import './templateSTyle.css';

export default function Templates() {
    return (
        <div className="py-4">
            <div className="container-fluid p-0 template-card">
                <SideBarNav />
                <div className="ro offset-xl-2 offset-lg-1 offset-md-1  bg-none home_section">
                    <main className="col col-xl-11  col-lg-11  col-md-12 col-sm-12 col-12 main_container  m-1 pt-5" >
                        <div className="template-headSection pt-2 mb-5 ">
                            <div className='page_title'><h1>Template</h1></div>
                            <div><button style={{background:'rgba(238, 218, 251, 1)', fontWeight:'600'}} >+ Create a Template</button></div>
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