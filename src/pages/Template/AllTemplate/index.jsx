import React, { useState, useEffect, useRef } from 'react';
import SingleTemplateComponent from '../../../component/Template/singleTemplate';
import SideBarNav from '../../pageAssets/sideBarNav';
import RightBarComponent from '../../pageAssets/rightNav';
import SuggestedFriends from '../../../component/Friends/suggestedFriends';


export default function Templates() {
    return (
        <div className="py-4">
            <div className="container-fluid p-0">
                <SideBarNav />
                <div className="ro offset-xl-2 offset-lg-1 offset-md-1  bg-none home_sectio">
                    <main className="col col-xl-9  col-lg-8  col-md-12 col-sm-12 col-12 main_container  m-1 pt-5" >
                        <div className='row'>
                            <SingleTemplateComponent />
                        </div>
                    </main>
                    <RightBarComponent>
                        <SuggestedFriends />
                        {/* <SideAds /> */}
                    </RightBarComponent>
                </div>
            </div>
        </div>
    );
}