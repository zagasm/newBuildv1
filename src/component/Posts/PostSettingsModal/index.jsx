import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Modal, Toast } from 'react-bootstrap'; // Added Toast
import { Helmet } from 'react-helmet-async';
import SinglePostTemplate, { PostFooter } from '../single';
import PostContentLoader from '../../assets/Loader/postContentSection';
import FullScreenPreloader from './FullScreenPreloader';
import CommentContainer from '../comment/commentContainer';
import PostDownloadButton from '../DownloadAttachment';
import './PostSettingsModalStyling.css';
import { useAuth } from '../../../pages/auth/AuthContext';
import FollowButton from './followButton';
import { encrypt } from '../../encryption/cryptoUtil';
import SavePostButton from './savePostButton';
import ReportPost from './ReportPost';

function PostSettingsModal({ post, show, onHide }) {
    const [isMobile, setIsMobile] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isTextOnlyPost, setIsTextOnlyPost] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [showToast, setShowToast] = useState(false); // Added for toast notification
    const { user } = useAuth();
    //    console.log();
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        if (show && post) {
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
        return () => window.removeEventListener('resize', handleResize);
    }, [show, post]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onHide();
            setIsClosing(false);
        }, 300);
    };

    // New function to copy post link
    const copyPostLink = () => {
        if (!post) return;
        const encryptedId = `${import.meta.env.VITE_BASE_APP_URL}/meme/${post.id}`;

        const postUrl = `${encryptedId}`;
        navigator.clipboard.writeText(postUrl)
            .then(() => {
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000); // Hide after 3 seconds
            })
            .catch(err => {
                console.error('Failed to copy link: ', err);
                // Fallback for browsers that don't support clipboard API
                const textArea = document.createElement('textarea');
                textArea.value = postUrl;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 3000);
                } catch (err) {
                    console.error('Fallback copy failed: ', err);
                }
                document.body.removeChild(textArea);
            });
    };
    // const handleNavigate = (id) => {
    //     const encryptedId = encrypt(id);
    //     navigate(`/${encodeURIComponent(encryptedId)}`);
    // };
    const truncateText = (text, maxLength = 20) => {
        if (!text) return "";
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };
    if (!post) return null;

    return (
        <>
            <Helmet>
                <title>{post.user_name}'s Post</title>
                <meta property="og:title" content={`${post.user_name}'s Post`} />
                {post.text && (
                    <meta property="og:description" content={post.text.substring(0, 160)} />
                )}
            </Helmet>

            {isLoading && <FullScreenPreloader />}

            {/* Toast Notification */}
            <Toast
                onClose={() => setShowToast(false)}
                show={showToast}
                delay={3000}
                autohide
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 9999,
                    backgroundColor: '#333',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '20px'
                }}
            >
                <Toast.Body>Link copied to clipboard!</Toast.Body>
            </Toast>

            <Modal
                show={show && !isLoading}
                onHide={handleClose}
                size="xl"
                centered
                className={`fullscreen-post-settings-modal ${isClosing ? 'closing' : ''}`}
                backdropClassName="modal-post-settings-backdrop"
                dialogClassName="m-0 p-0"
                animation={false}
            // backdrop="static"
            >
                <div className=" d-flex justify-content-center ">
                    <button
                        className="modal-close-bt "
                        onClick={handleClose}
                        aria-label="Close"
                        style={{ background: 'rgba(217, 217, 217, 1)', width: '100px', border: 'none', padding: '2px 0px', borderRadius: 'none' }}
                    >
                    </button>
                </div>
                <Modal.Body style={{ padding: '0px', margin: '0px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                        <div className='w-100 ' style={{ padding: '0px 10px 0px 10px' }}>
                            {user.user_id != post.user_id && <div className="d-flex align-items-center pt-4" >
                                <div className="mr-3" style={{ position: 'relative' }}>
                                    <img
                                        className="rounded-circle"
                                        src={post.user_picture || friendImage}
                                        alt="Friend"
                                        style={{ width: '44px', height: '44px', objectFit: 'cover' }}
                                    />
                                </div>
                                <div className="font-weight-bold" style={{ flex: '1' }}>
                                    <div className='text-truncate text-capitalize'>{truncateText(post.user_name, 10)}</div>
                                </div>
                                <FollowButton userId={post.user_id} following={post.user.is_following} />
                            </div>}

                            <ul className="list-unstyled mt-2">
                                
                                    <PostDownloadButton data={post} />
                               
                                <li>
                                    <SavePostButton memeId={post.id} />
                                </li>
                                <li>
                                    <button
                                        className="w-100 text-left d-flex align-items-center py-3 "
                                        type="button"
                                        onClick={copyPostLink} // Added click handler
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            fontSize: '14px'
                                        }}
                                    >
                                        <i className="fas fa-link mr-3" style={{ width: '24px', fontSize: '20px' }}></i>
                                        <span>Copy Link</span>
                                    </button>
                                </li>
                                {/* <li>
                                    <button
                                        className="w-100 text-left d-flex align-items-center py-3 "
                                        type="button"
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            fontSize: '14px'
                                        }}
                                    >
                                        <i className="far fa-eye-slash mr-3" style={{ width: '24px', fontSize: '20px' }}></i>
                                        <span>Hide</span>
                                    </button>
                                </li> */}
                                <li>
                                    <ReportPost
                                        memeId={post.id}
                                    />
                                </li>
                            </ul>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default PostSettingsModal;