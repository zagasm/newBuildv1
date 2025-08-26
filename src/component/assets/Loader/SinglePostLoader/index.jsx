import React from 'react';
import './loader.css'; // Style needed for animation

function    SinglePostLoader() {
    return (
        <div className="box shadow-sm border rounded bg-white mb-3 osahan-post car">
            {/* Header Loader */}
            <div className="p-3 d-flex align-items-center border-bottom">
                <div className="skeleton-circle mr-3" style={{ width: 40, height: 40 }}></div>
                <div className="flex-grow-1">
                    <div className="skeleton-text short mb-1"></div>
                    <div className="skeleton-text xshort"></div>
                </div>
            </div>

            {/* Post Body Loader */}
            <div className="p-3 border-bottom">
                <div className="skeleton-text long mb-2"></div>
                <div className="skeleton-text medium mb-2"></div>
                <div className="skeleton-text short mb-2"></div>
                <div className="skeleton-box mt-3" style={{ height: 180 }}></div>
            </div>

            {/* Footer Icons Loader */}
            <div className="p-3 border-bottom d-flex justify-content-between text-center w-100 row">
                {[...Array(4)].map((_, index) => (
                    <div key={index} className="col">
                        <div className="skeleton-icon mx-auto mb-1" style={{ width: 20, height: 20 }}></div>
                        <div className="skeleton-text xshort mx-auto"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SinglePostLoader;
