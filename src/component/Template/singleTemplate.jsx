import React, { useState, useEffect, useRef } from 'react';


export default function SingleTemplateComponent() {
    return (
        <>
         <div className='card col-lg-3 col-md-4 col-sm-6 col-12 p-0'>
             <div className="card-header">
                Today Go better pass yesterday
             </div>
             <div className="card-body" style={{backgroundImage: 'https://randomuser.me/api/portraits/male/3.jpg'}}>
                <img src="" alt="" />
             </div>
             <div className="card-footer">
                <img src="" alt="" />
             </div>
        </div></>
    );
}