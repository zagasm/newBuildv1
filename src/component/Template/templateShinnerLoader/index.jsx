import React from 'react';
import './ShimmerLoader.css'; // Style needed for animation

function TemplateShimmerLoader() {
    return (
        <>
            {Array.from({ length: 4 }).map((_, index) => (
                <div
                    key={index}
                    className=" mb-3 osahan-post car col-xl-3 col-lg-4 col-md-6 col-sm-6 col-6 mb-5 p-0"
                >
                    <div className=" m-1 pb-3 border-botom box shadow-sm border-0 rounded bg-white ">
                        <div className="skeleton-box mt-3 mb-2" style={{ height: 180 }}></div>
                        <div className="skeleton-text long" style={{ height: 50, width:'100%', margin:'auto' }}></div>
                        <div className="skeleton-text long mt-3" style={{ height: 50, width:'75%', margin:'auto', borderRadius:'40px' }}></div>
                    </div>
                </div>
            ))}
        </>
    );
}

export default TemplateShimmerLoader;
