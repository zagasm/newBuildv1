import React, { useEffect, useState } from 'react';
import './SingleTemplateComponent.css';
import TemplateShimmerLoader from './templateShinnerLoader';
import ImageGallery from '../assets/ImageGallery';
import { Link } from 'react-router-dom';

export default function SingleTemplateComponent({ handleCreatePostComponent, loading, visiblePosts, error }) {
   const [expandedDescriptions, setExpandedDescriptions] = useState({});
   const [descriptionLoading, setDescriptionLoading] = useState({});
   const [selectedImageIndex, setSelectedImageIndex] = useState(0);
   const [showGallery, setShowGallery] = useState(false);
   const [galleryImages, setGalleryImages] = useState([]);

   const toggleDescription = (postId) => {
      setDescriptionLoading(prev => ({ ...prev, [postId]: true }));
      setTimeout(() => {
         setExpandedDescriptions(prev => ({
            ...prev,
            [postId]: !prev[postId]
         }));
         setDescriptionLoading(prev => ({ ...prev, [postId]: false }));
      }, 300);
   };

   // ✅ Image loader with shimmer only once per image
   const ImageWithLoader = ({ src, alt, className, index }) => {
      const [hasLoaded, setHasLoaded] = useState(false);
      const [showPlaceholder, setShowPlaceholder] = useState(true);

      useEffect(() => {
         const img = new Image();
         img.src = src;

         img.onload = () => {
            setHasLoaded(true);
            setShowPlaceholder(false); // shimmer disappears permanently
         };

         img.onerror = () => {
            setHasLoaded(true);
            setShowPlaceholder(false);
         };

         return () => {
            img.onload = null;
            img.onerror = null;
         };
      }, [src]);

      return (
         <div className="image-container">
            {/* {showPlaceholder && (
               <div className={`${className} image-loading-placeholder shimmer`}></div>
            )} */}

            {/* {hasLoaded && ( */}
               <img
                  onClick={() => openGallery(index)}
                  className={className}
                  src={src}
                  alt={alt}
                  loading="lazy"
               />
            {/* // )} */}
         </div>
      );
   };

   const renderDescription = (description, postId) => {
      if (!description) return null;
      const isExpanded = expandedDescriptions[postId];
      const isLoading = descriptionLoading[postId];
      const shouldTruncate = description.length > 10;

      return (
         <p className="text-mute text-capitalize" style={{ fontSize: '14px', cursor: 'pointer',lineHeight:'18px' }}>
            {shouldTruncate && !isExpanded ? `${description.substring(0, 10)}...` : description}
            {shouldTruncate && (
               <span
                  onClick={(e) => {
                     e.preventDefault();
                     toggleDescription(postId);
                  }}
                  className="text-primary bt btn-lin bg-none p-0 ml-1 border-0"
                  style={{
                     fontSize: '10px',
                     cursor: 'pointer',
                     color: '#8000FF',
                  }}
               >
                  {isLoading ? (
                     <span className="description-loader" style={{ display: 'inline-block' }}>
                        <span className="loader-dot" style={{ backgroundColor: '#8000FF' }}></span>
                        <span className="loader-dot" style={{ backgroundColor: '#8000FF' }}></span>
                        <span className="loader-dot" style={{ backgroundColor: '#8000FF' }}></span>
                     </span>
                  ) : isExpanded ? 'Show less' : 'Show more'}
               </span>
            )}
         </p>
      );
   };

   const truncateText = (text, maxLength = 20) => {
      if (!text) return "";
      return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
   };

   // ✅ Show all post images in gallery
   const openGallery = (index) => {
      setSelectedImageIndex(index);
      setShowGallery(true);
      setGalleryImages(
         visiblePosts.map(post => ({ source: post.image }))
      );
   };

   return (
      <div className="row">
         {error && (
            <div className="col-12 text-center text-danger mb-4">
               {error}
            </div>
         )}

         {loading && visiblePosts.length === 0 ? (
            <TemplateShimmerLoader />
         ) : (
            visiblePosts.map((post, idx) => (
               <div key={post.id} className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-6 mb-5 pr-0">
                     {renderDescription(post.description, post.id)}
                  <div className="car shadow-s rounded h-100 blog-card border-0 position-relative">
                     <div className="text-decoration-none text-dark">
                        <ImageWithLoader
                           className="card-img-top"
                           src={post.image}
                           alt={post.description}
                           index={idx}
                        />
                        <Link to={'/profile/'+post.user_id}  className="card-footer bg-transparen border-0 d-flex align-items-center">
                           <img
                              className="rounded-circle"
                              src={post.authorAvatar}
                              alt={post.authorName}
                              width="32"
                              height="32"
                           />
                           <div>
                              <small className="text-muted text-capitalize">
                                 {truncateText(post.authorName, 8)}
                              </small>
                           </div>
                        </Link>
                        <div className='d-flex justify-content-center align-items-center w-100'>
                           <button onClick={() => handleCreatePostComponent('remixPost', post)}>
                              Use Template
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            ))
         )}

         {loading && visiblePosts.length > 0 && (
            <div className="text-center mt-3">
               <span>Loading more templates...</span>
            </div>
         )}

         {!loading && !error && visiblePosts.length === 0 && (
            <div className="col-12 text-center text-muted">
               No templates found
            </div>
         )}

         {/* ✅ Global gallery across all posts */}
         {showGallery && (
            <ImageGallery
               images={galleryImages}
               currentIndex={selectedImageIndex}
               onClose={() => setShowGallery(false)}
               onNavigate={(step) =>
                  setSelectedImageIndex((prev) =>
                     Math.min(Math.max(prev + step, 0), galleryImages.length - 1)
                  )
               }
            />
         )}
      </div>
   );
}
