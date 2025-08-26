import React from 'react';
import './PostShimmerLoader.css'; // CSS styles required

const PostShimmerLoader = ({ tab = 'text' }) => {
    return (

        <div className="col col-xl-11 order-xl-2 col-lg-8 order-lg-1 col-md-12 col-sm-12 col-12 main_container" >
            <div className="post-shimmer-container container card " style={{ padding: '20px', height: '50vh' }}>

                {/* Show Text Tab Shimmer */}
                {tab === 'text' && (
                    <div className="shimmer-tab shimmer-active">
                        <div className="shimmer-textarea"></div>
                        <div className="shimmer-color-palette d-flex flex-wrap justify-content-between">
                            <div className='d-flex flex-wrap justify-content-between gap-2'>
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="shimmer-color-option"></div>
                                ))}
                            </div>
                            <div className='d-flex flex-wrap justify-content-between gap-2'> {[...Array(3)].map((_, i) => (
                                <div key={i} className="shimmer-color-option"></div>
                            ))}</div>
                        </div>
                        <div className="shimmer-submit-button"></div>
                    </div>
                )}


            </div>
        </div>

    );
};

export default PostShimmerLoader;
