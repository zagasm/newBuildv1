import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import SinglePostTemplate, { PostFooter } from '../single';
import PostContentLoader from '../../assets/Loader/postContentSection';
import FullScreenPreloader from './FullScreenPreloader';
import CommentContainer from '../comment/commentContainer';
import './CommentModalStyle.css';
import Message_square from '../../../assets/post_icon/Message_square.svg';
function PostCommentButton({ post }) {
    const [isMobile, setIsMobile] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isClosing, setIsClosing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [totalComments, settotalComments] = useState(post.comments);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        if (showModal && post) {
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 1000);

            return () => clearTimeout(timer);
        }
        return () => window.removeEventListener('resize', handleResize);
    }, [showModal, post]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setShowModal(false);
            setIsClosing(false);
        }, 300); // match with CSS animation duration
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

            {/* {isLoading && <FullScreenPreloader />} */}

            {/* ✅ open comment modal button */}
            <button
                onClick={() => setShowModal(true)}
                type="button"
                className="text-secondary border-0 bg-transparent post_icon"
            >
                <img src={Message_square} alt="comments" />
                <span style={{ marginLeft: '1px' }}>{ totalComments || 0}</span>
            </button>

            {/* ✅ modal */}
            <Modal
                show={showModal && !isLoading}
                onHide={handleClose}
                size="md"
                centered
                className={`fullscreen-post-comment-modal m-0 comment_modal ${isClosing ? 'closing' : ''}`}
                backdropClassName="modal-backdrop"
                dialogClassName="m-0"
                animation={false}
            >
                {/* close bar */}
                <div className="d-flex justify-content-center w-100">
                    <span
                        className="modal-close-btn fa fa-angle-down"
                        onClick={handleClose}
                        aria-label="Close"
                        style={{
                            color: 'rgba(112, 110, 110, 1)',
                            // borderRadius: '50%',
                            height: '10px',
                            width: '10px',
                        }}
                    ></span>
                </div>

                <Modal.Header className="modal-header-custom border-0 pb-1 mb-4">
                    <div className="mx-auto border-none">
                        <h6 className="mb-0 border-0" style={{ fontSize: '12px' }}>
                            Comments
                        </h6>
                    </div>
                </Modal.Header>

                <Modal.Body className="comment_sector p-0 m-0 pb-5">
                    <CommentContainer post={post} settotalComments={settotalComments} />
                </Modal.Body>
            </Modal>
        </>
    );
}

export default PostCommentButton;