import React, { useState, useEffect, useRef } from 'react';
import friendImage from '../../assets/img/IMG_9488.jpeg';
import SinglePostLoader from '../assets/Loader/SinglePostLoader';
import { Carousel } from 'react-bootstrap';
import './postcss.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import TimeAgo from '../assets/Timmer/timeAgo';
import Linkify from 'react-linkify';
import { Link, useNavigate, useParams } from 'react-router-dom';
// import PostCommentButton from './comment/PostCommentButton';
import TextFormatter from './PostTextFormatter';
// import PostViewModal from './PostCommentsModal';
import { useAuth } from '../../pages/auth/AuthContext';
import axios from 'axios';
import { Toast } from 'bootstrap/dist/js/bootstrap.bundle.min';
import { showToast } from '../ToastAlert';
import ShareButton from './sharePostModal';
import { ReactionButton } from './ReactionButton';
// import DownloadStyledText from './DownloadAttachment';
// import PostDownloadButton from './DownloadAttachment';
import ImageGallery from '../assets/ImageGallery';
import globe_icon from '../../assets/post_icon/bx_world.png';
// import Message_square from '../../assets/post_icon/Message_square.svg';
// import laugh_icon from '../../assets/post_icon/laugh_icon.png';
import post_chart from '../../assets/post_icon/post_chart.svg';
import PostSettingsModal from './PostSettingsModal';
import { post } from 'jquery';
import { encrypt } from '../encryption/cryptoUtil';
import default_profilePicture from '../../assets/avater_pix.webp';
import PostCommentButton from './PostCommentsModal';
function SinglePostTemplate({ data, hideCommentButton = false, seachQuery }) {
    // console.log('SinglePostTemplate data:', data);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showCommentsModal, setShowCommentsModal] = useState(false);
    const { user } = useAuth();
    useEffect(() => {
        if (data) {
            const timer = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(timer);
                        setLoading(false);
                        return 100;
                    }
                    return prev + 10;
                });
            }, 100);

            return () => clearInterval(timer);
        }
    }, [data]);
    if (loading) {
        return <SinglePostLoader />;
    }
    // Transform new data structure to match expected format
    const transformedData = {
        ...data,
        user_picture: data.user?.meta_data.profile_picture || default_profilePicture,
        user_name: data.user?.username || data.user?.last_name + ' ' + data.user?.first_name || 'Anonymous',
        user_id: data.user_id,
        time: data.created_at,
        text: data.text_content,
        photos: data.media_path?.map(media => ({ source: media })) || [],
        background_color_code: data.background_color,
        text_color_code: data.text_color,
        comments: data.comment_count,
        views: data.view_count,
        reaction_haha_count: data.like_count,
        i_react: data.is_liked,
        post_id: data.id,
        shares: data.shares
    };

    return (
        <div className="box shadow-s border-0 rounded bg-white osahan-post">
            <PostHeader data={transformedData} />
            <PostContent
                seachQuery={seachQuery}
                data={transformedData}
                currentImageIndex={currentImageIndex}
                onImageClick={setCurrentImageIndex}
            />
            <PostFooter
                data={transformedData}
                totalComment={transformedData.comments}
                hideCommentButton={hideCommentButton}
            />
        </div>
    );
}
function PostHeader({ data }) {
    const [showModal, setShowModal] = useState(false);
    const { user, isAuthenticated } = useAuth();
    // console.log(data);
    const handlePostSettingModalClick = (e) => {
        e.preventDefault();
        setShowModal(true);
    };
    return (
        <div className="p-3 d-flex align-items-center border-botto osahan-post-header m-0" style={{ background: '#edf2fe75' }}>
            <div className="dropdown-list-image mr-3" style={{ background: '#edf2fe75' }}>
                <img
                    // data.user.meta_data.profile_picture ||
                    className="rounded-circle"
                    src={data.user_picture}
                    alt={data.user_name}
                />
                {/* <div className="status-indicator bg-secondary"></div> */}
            </div>
            <div className="font-weight-bold">
                <div className="text-truncate text-capitalize">
                    <Link to={`/profile/${data.user_id}`} className="text-dark">
                        {data.user_name}
                    </Link>
                </div>
                <div className="small text-gray-500">
                    <img className='mr-1' style={{ width: '16px' }} src={globe_icon} alt="" />
                    {/* {console.log(data.time)} */}
                    <TimeAgo date={data.time} />
                </div>
            </div>
            {isAuthenticated && (<span className="ml-auto small">
                <div className="btn-group">
                    <button type="button"
                        onClick={handlePostSettingModalClick}
                        className="btn btn-light btn-sm rounded"
                        style={{ background: 'none', border: 'none' }}
                        data-bs-toggle="dropdown"
                        aria-expanded="false">
                        <i className="feather-more-vertical"></i>
                    </button>
                </div>
                {showModal && (
                    <PostSettingsModal
                        post={data}
                        show={showModal}
                        onHide={() => setShowModal(false)}
                    />
                )}
            </span>)}
        </div>
    );
}
export function PostContent({ data, currentImageIndex, onImageClick, seachQuery }) {
    const [imageLoadError, setImageLoadError] = useState({});
    const [imageLoading, setImageLoading] = useState(true);
    const [showGallery, setShowGallery] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [detectedLinks, setDetectedLinks] = useState([]);
    const [expanded, setExpanded] = useState(false);
    const { postId } = useParams();
    const navigate = useNavigate();
    
    // Calculate if text is long enough to need truncation
    const textNeedsTruncation = data.text?.length > 300;
    const displayText = postId ? data.text : expanded || !textNeedsTruncation
        ? data.text
        : `${data.text.substring(0, 300)}...Read more`;
    
    const decodeHtmlEntities = (str) => {
        const txt = document.createElement("textarea");
        txt.innerHTML = str;
        return txt.value;
    };

    // Function to format text with styled hashtags, links, and search query highlighting
    const formatTextWithStyles = (text) => {
        if (!text) return text;

        // First decode HTML entities
        const decodedText = decodeHtmlEntities(text);

        // If there's a search query, highlight it
        if (seachQuery && seachQuery.trim()) {
            const searchRegex = new RegExp(`(${seachQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
            const parts = decodedText.split(searchRegex);

            return parts.map((part, index) => {
                // Check if this part matches the search query (case insensitive)
                if (part.toLowerCase() === seachQuery.toLowerCase()) {
                    return (
                        <span
                            key={index}
                            style={{
                                color: '#8000FF',
                                fontWeight: 'bold',
                                backgroundColor: 'rgba(128, 0, 255, 0.1)',
                                padding: '0 2px',
                                borderRadius: '2px'
                            }}
                        >
                            {part}
                        </span>
                    );
                }
                
                // For non-matching parts, apply the original formatting
                return formatRegularText(part);
            });
        }

        // If no search query, use the original formatting
        return formatRegularText(decodedText);
    };

    // Helper function to format regular text with hashtags and links
    const formatRegularText = (text) => {
        if (!text) return text;

        // Split text by hashtags and links while preserving them
        const parts = text.split(/(\#\w+|https?:\/\/[^\s]+|www\.[^\s]+)/g);

        return parts.map((part, index) => {
            // Check if it's a hashtag
            if (part.match(/^\#\w+$/)) {
                return (
                    <span
                        key={index}
                        style={{
                            color: '#8000FF',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        {part}
                    </span>
                );
            }
            // Check if it's a link (http/https or www)
            else if (part.match(/^(https?:\/\/[^\s]+|www\.[^\s]+)$/)) {
                return (
                    <span
                        key={index}
                        style={{
                            color: '#8000FF',
                            fontWeight: '600'
                        }}
                    >
                        {part}
                    </span>
                );
            }
            // Regular text
            else {
                return part;
            }
        });
    };

    const isTextOnlyPost = !data.photos || data.photos.length === 0;
    
    useEffect(() => {
        if (data.text) {
            const links = detectLinks(data.text);
            setDetectedLinks(links);
        }
    }, [data.text]);
    
    const detectLinks = (text) => {
        const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
        return text.match(urlRegex) || [];
    };
    
    const openGallery = (index) => {
        setSelectedImageIndex(index);
        setShowGallery(true);
    };
    
    const handleImageError = (index) => {
        setImageLoadError(prev => ({ ...prev, [index]: true }));
        setImageLoading(false);
    };
    
    const handleImageLoad = () => {
        setImageLoading(false);
    };
    
    const handleNavigate = (id) => {
        navigate(`/meme/${id}`);
    };
    
    return (
        <div className="border-bottom osahan-post-body" style={{ background: 'white' }}>
            {/* TEXT CONTENT */}
            {data.text && (
                <div className="post-text-container text-dark" style={{ background: 'white' }}>
                    <div
                        onClick={() => !postId && handleNavigate(data.id)}
                        className="mb- text pt-3 pb-3"
                        style={isTextOnlyPost ? {
                            background: data.background_color_code,
                            color: data.text_color_code || 'black',
                            cursor: 'pointer',
                            textAlign: data.text_align || 'center',
                            fontSize: `${data.font_size}px`,
                            fontFamily: data.font_family || 'Arial',
                            wordWrap: 'break-word',
                            overflowWrap: 'break-word',
                            border: 'none',
                            padding: '10px',
                            whiteSpace: 'normal',
                            wordBreak: 'break-all'
                        } : {
                            padding: '10px',
                            wordWrap: 'break-word',
                            overflowWrap: 'break-word',
                            border: 'none',
                            whiteSpace: 'normal',
                            wordBreak: 'break-all'
                        }}
                    >
                        <div style={
                            isTextOnlyPost && {
                                display: 'flex',
                                alignItems: data.vertical_align || 'middle',
                                justifyContent: 'center',
                                minHeight: '300px',
                                alignItems: 'center',
                                textAlign: data.text_align || 'center',
                                fontSize: `${data.font_size || 15}px`,
                                fontFamily: data.font_family || 'Arial',
                                wordWrap: 'break-word',
                                overflowWrap: 'break-word',
                                border: 'none',
                                padding: '10px',
                                whiteSpace: 'normal',
                                wordBreak: 'break-all'
                            }}
                        >
                            {formatTextWithStyles(displayText)}
                        </div>
                    </div>
                </div>
            )}

            {/* IMAGE(S) CONTENT */}
            {data.photos?.length > 0 && (
                <div className="mt position-relative meme_image_container" style={{ background: '#edf2fe75' }}>
                    {data.photos.length > 1 && (
                        <div className="image-counter-overlay ">
                            {currentImageIndex + 1}/{data.photos.length}
                        </div>
                    )}
                    {data.photos.length > 1 ? (
                        <Carousel
                            activeIndex={currentImageIndex}
                            onSelect={onImageClick}
                            interval={null}
                            indicators={false}
                            controls
                            className="zagasm-carousel"
                            wrap={false}
                        >
                            {data.photos.map((photo, index) => (
                                <Carousel.Item key={index}>
                                    <div className="carousel-image-container" onClick={() => openGallery(index)}>
                                        {imageLoadError[index] ? (
                                            <div className="image-error-placeholder">
                                                <i className="feather-image text-muted"></i>
                                                <p>Image failed to load</p>
                                            </div>
                                        ) : (
                                            <>
                                                {imageLoading && (
                                                    <div className="image-loading-placeholder">
                                                        <div className="spinner-border text-primary" role="status"></div>
                                                    </div>
                                                )}
                                                <img
                                                    src={photo.source}
                                                    className={`carousel-image ${imageLoading ? 'd-none' : ''}`}
                                                    alt="Post content"
                                                    onError={() => handleImageError(index)}
                                                    onLoad={handleImageLoad}
                                                />
                                            </>
                                        )}
                                    </div>
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    ) : (
                        <div onClick={() => openGallery(0)} style={{ cursor: 'pointer' }}>
                            {imageLoadError[0] ? (
                                <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                                    <i className="feather-image text-muted" style={{ fontSize: '48px' }}></i>
                                    <p>Image failed to load</p>
                                </div>
                            ) : (
                                <>
                                    {imageLoading && (
                                        <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                                            <div className="spinner-border text-primary" role="status"></div>
                                        </div>
                                    )}
                                    <img
                                        src={data.photos[0].source}
                                        className={`img-fluid meme_image w-100 ${imageLoading ? 'd-none' : ''}`}
                                        alt="Post content"
                                        style={{ maxHeight: '500px', objectFit: 'cover', borderRadius: '0px', aspectRatio: '1/1' }}
                                        onError={() => handleImageError(0)}
                                        onLoad={handleImageLoad}
                                    />
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}

            {showGallery && (
                <ImageGallery
                    images={data.photos}
                    currentIndex={selectedImageIndex}
                    onClose={() => setShowGallery(false)}
                    onNavigate={(step) => setSelectedImageIndex(prev => prev + step)}
                />
            )}
        </div>
    );
}
export function PostFooter({ data }) {
    const { user } = useAuth();
    return (
        <footer className="pb-3 pt-0 pr-3 pl-3 osahan-post-footer border-bottom pt-2" style={{ background: '#edf2fe75' }}>
            <div className="p-0 d-flex justify-content-between text-center w-100">
                <button className="text-secondary border-0 bg-transparent post_icon">
                    <img src={post_chart} alt="" />
                    <span className="ms-1">{data.views}</span>
                </button>
                {/* {console.log('shares',data.shares)} */}
                <ShareButton
                    sharesCount={data.shares || 0}
                    postUrl={`${import.meta.env.VITE_BASE_APP_URL}/meme/${data.post_id}`}
                    postTitle={data.text?.substring(0, 50) || "Check this out!"}
                    postId={data.post_id}

                />
                <PostCommentButton
                    post={data}
                />
                <ReactionButton
                    initialCount={data.like_count}
                    emoji="😂"
                    postId={data.id}
                    userId={user?.user?.id}
                    i_react={data.is_liked}
                    totalShare={data.shares}
                />
            </div>
        </footer>
    );
}
export default SinglePostTemplate;