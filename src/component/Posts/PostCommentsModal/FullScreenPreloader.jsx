import React from 'react';
import { Spinner } from 'react-bootstrap';
// import './postViewStyle.css';

const FullScreenPreloader = () => {
    return (
        <div className="fullscreen-preloader">
            <div className="preloader-content">
                <Spinner animation="border" variant="primary" className="preloader-spinner" />
                {/* <h5 className="mt-3">Loading post...</h5> */}
            </div>
        </div>
    );
};

export default FullScreenPreloader;