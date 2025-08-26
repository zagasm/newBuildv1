import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import { BsEmojiSmile } from 'react-icons/bs';
import { FiSend } from 'react-icons/fi';
import EmojiPicker from 'emoji-picker-react';
import CommentComponent from './commentComponent.jsx';
import axios from 'axios';
import { useAuth } from '../../../pages/auth/AuthContext';
import { showToast } from '../../ToastAlert';
import './commentStyle.css';
import { throttle } from 'lodash';

const CommentContainer = ({ post, settotalComments }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isMobile, setIsMobile] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null);
    const [loadingMore, setLoadingMore] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const { user, token, isAuthenticated } = useAuth();

    // const { user, isAuthenticated, logout, showAuthModal } = useAuth();
    const getVisitorId = useCallback(() => {
        const stored = localStorage.getItem("visitor_id");
        if (stored) return stored;
        const id = "visitor_" + uuidv4();
        localStorage.setItem("visitor_id", id);
        return id;
    }, []);
    // const userId = 'djhdwjdmfmdwdwddddddddwdwddd';
    const userId = user ? user.id : getVisitorId();
    const emojiButtonRef = useRef(null);
    const commentEndRef = useRef(null);
    const commentsContainerRef = useRef(null);

    const paginationRef = useRef({
        per_page: 10,
        next_cursor: null,
        next_page_url: null,
        prev_cursor: null,
        prev_page_url: null
    });

    
    const throttledFetch = useCallback(throttle(async (url, options = {}) => {
        try {
            const config = {
                method: options.method || 'get',
                url,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...options.headers
                }
            };

            if (options.data) {
                if (options.method === 'post') {
                    const formData = new URLSearchParams();
                    for (const key in options.data) {
                        formData.append(key, options.data[key]);
                    }
                    config.data = formData;
                    config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
                } else {
                    config.data = options.data;
                }
            }

            const response = await axios(config);
            return response;
        } catch (error) {
            // console.error('API Error:', error);
            if (error.response?.status === 422) {
                showToast.error('Please slow down your requests');
            }
            throw error;
        }
    }, 1000, { leading: true, trailing: false }), [token]);

    const fetchComments = async (url = null, append = false) => {
        if (isFetching) return;
        setIsFetching(true);
        try {
            const endpoint = url || `${import.meta.env.VITE_API_URL}/api/v1/meme/comments/${post.id}/${userId}`;
            const response = await throttledFetch(endpoint);

            if (response.data.status && response.data.data) {
                const { data, ...pagination } = response.data.data;

                paginationRef.current = {
                    per_page: pagination.per_page,
                    next_cursor: pagination.next_cursor,
                    next_page_url: pagination.next_page_url,
                    prev_cursor: pagination.prev_cursor,
                    prev_page_url: pagination.prev_page_url
                };

                setHasMore(!!pagination.next_page_url);

                if (append) {
                    setComments(prev => {
                        // Filter out any existing comments to prevent duplicates
                        const existingIds = new Set(prev.map(c => c.id));
                        const newComments = data.filter(c => !existingIds.has(c.id));
                        return [...prev, ...newComments];
                    });
                } else {
                    setComments(data);
                }
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
            if (error.response?.status !== 422) {
                showToast.error('Failed to load comments');
            }
        } finally {
            setIsFetching(false);
            setLoadingMore(false);
        }
    };

    const postComment = async (commentText, parentId = null) => {
        try {
            const payload = { body: commentText };
            if (parentId) payload.parent_id = parentId;

            const response = await throttledFetch(
                `${import.meta.env.VITE_API_URL}/api/v1/meme/comments/${post.id}`,
                {
                    method: 'post',
                    data: payload
                }
            );

            if (response.data.status) return response.data.data;

            throw new Error(response.data.message || 'Failed to post comment');
        } catch (error) {
            console.error('Error posting comment:', error);
            throw error;
        }
    };
    const insertReply = (commentsList, parentId, reply) => {
        return commentsList.map(comment => {
            if (comment.id === parentId) {
                // Check if reply already exists to prevent duplicates
                const replyExists = comment.replies?.some(r => r.id === reply.id);
                return {
                    ...comment,
                    replies: replyExists ? comment.replies : [reply, ...(comment.replies || [])]
                };
            } else if (comment.replies?.length) {
                return {
                    ...comment,
                    replies: insertReply(comment.replies, parentId, reply)
                };
            }
            return comment;
        });
    };

    const removeTempReply = (commentsList, parentId, tempId) => {
        return commentsList.map(comment => {
            if (comment.id === parentId) {
                return {
                    ...comment,
                    replies: (comment.replies || []).filter(r => r.id !== tempId)
                };
            } else if (comment.replies?.length) {
                return {
                    ...comment,
                    replies: removeTempReply(comment.replies, parentId, tempId)
                };
            }
            return comment;
        });
    };
    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || isSubmitting) return;

        setIsSubmitting(true);
        const tempId = `temp-${Date.now()}`;
        const tempComment = {
            id: tempId,
            user_id: user?.id,
            meme_id: post.id,
            parent_id: replyingTo?.commentId || null,
            body: newComment,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            replies: [],
            user: {
                id: user?.id,
                first_name: user?.first_name,
                last_name: user?.last_name,
                username: user?.username,
                avatar: user?.avatar
            },
            isPending: true
        };

        try {
            if (replyingTo) {
                setComments(prev => insertReply(prev, replyingTo.commentId, tempComment));
            } else {
                setComments(prev => [tempComment, ...prev]);
            }

            setNewComment('');
            setReplyingTo(null);

            const apiComment = await postComment(
                newComment.replace(/^@\w+\s/, ''),
                replyingTo?.commentId
            );

            setComments(prev =>
                replyingTo
                    ? insertReply(
                        removeTempReply(prev, replyingTo.commentId, tempId),
                        replyingTo.commentId,
                        apiComment
                    )
                    : prev.map(comment => comment.id === tempId ? apiComment : comment)
            );
        } catch (error) {
            setComments(prev =>
                replyingTo
                    ? removeTempReply(prev, replyingTo.commentId, tempId)
                    : prev.filter(comment => comment.id !== tempId)
            );

            if (error.response?.status === 401) {
                showToast.error('Please login to comment');
            } else if (error.response?.status === 403) {
                showToast.error('You are not allowed to comment');
            } else if (error.response?.status !== 422) {
                showToast.error(error.response?.data?.error || 'Failed to post comment');
            }
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleLoadMore = useCallback(() => {
        if (paginationRef.current.next_page_url && !loadingMore && !isFetching && hasMore) {
            setLoadingMore(true);
            fetchComments(paginationRef.current.next_page_url, true);
        }
    }, [loadingMore, isFetching, hasMore]);

    const handleReplyClick = (commentId, username) => {
        setReplyingTo({ commentId, username });
        setNewComment(prev => prev.startsWith(`@${username}`) ? prev : `@${username} `);
        setTimeout(() => {
            document.querySelector('.comment-form textarea')?.focus();
        }, 0);
    };

    const handleEmojiClick = (emojiData) => {
        setNewComment(prev => prev + emojiData.emoji);
        // -    setShowEmojiPicker(false);
    };
    const handleScroll = useCallback(() => {
        if (commentsContainerRef.current && !loadingMore && !isFetching && hasMore) {
            const { scrollTop, scrollHeight, clientHeight } = commentsContainerRef.current;
            const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 100;
            if (isNearBottom) handleLoadMore();
        }
    }, [loadingMore, isFetching, hasMore, handleLoadMore]);
    useEffect(() => {
        fetchComments();
    }, [post.id]);

    useEffect(() => {
        const container = commentsContainerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, [handleScroll]);

    useEffect(() => {
        const textarea = document.querySelector('.comment-form textarea');
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.min(textarea.scrollHeight, 100)}px`;
        }
    }, [newComment]);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const emojiWrapperRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiWrapperRef.current && !emojiWrapperRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    // Recursive function to count all comments and replies
    const getTotalCommentsAndReplies = (commentsList) => {
        let count = 0;
        commentsList.forEach(comment => {
            count += 1; // count this comment
            if (comment.replies?.length) {
                count += getTotalCommentsAndReplies(comment.replies); // count its replies
            }
        });
        return count;
    };

    useEffect(() => {
        settotalComments(getTotalCommentsAndReplies(comments));
    }, [comments]);
    useEffect(() => {
        settotalComments(getTotalCommentsAndReplies(comments));
    }, []);



    return (
        <div className={`comments-section  ${isMobile ? 'mobile-comments' : ''}`} >

            <div
                className="comments-list pt-3 pb-5"
                ref={commentsContainerRef}
                style={{ maxHeight: '600px', overflowY: 'auto' }}
            >
                {comments.length > 0 ? (
                    comments.map(comment => (
                        <CommentComponent
                            key={comment.id}
                            comment={comment}
                            onReply={handleReplyClick}
                        />
                    ))
                ) : (
                    <div className="text-center py-4 text-muted">
                        {isFetching ? (
                            <Spinner animation="border" size="sm" />
                        ) : (
                            "No comments yet"
                        )}
                    </div>
                )}

                {loadingMore && (
                    <div className="text-center py-2">
                        <Spinner animation="border" size="sm" />
                    </div>
                )}

                {!hasMore && comments.length > 0 && (
                    <div className="text-center py-2 text-muted small">
                        {/* No more comments to load */}
                    </div>
                )}

                <div ref={commentEndRef} />
            </div>

            <div className="comment-form p-2 border-top">
                {replyingTo && (
                    <div className="replying-to-notice mb-2 d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                            {/* {console.log('replying',replyingTo)} */}
                            Replying to @{replyingTo.username}
                        </small>
                        <Button
                            variant="link"
                            size="sm"
                            className="p-0 text-danger"
                            onClick={() => setReplyingTo(null)}
                        >
                            Cancel
                        </Button>
                    </div>
                )}
                {isAuthenticated ? (<Form onSubmit={handleSubmitComment} className="d-flex align-items-center gap-2">
                    {/* <div ref={emojiWrapperRef} className="position-relative">
                        <Button
                            variant="link"
                            className="p-0 text-muted"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            disabled={isSubmitting}
                            aria-label="Emoji picker"
                        >
                            <BsEmojiSmile size={20} />
                        </Button>

                        {showEmojiPicker && (
                            <div className="emoji-picker-container mb-2">
                                <EmojiPicker
                                    onEmojiClick={handleEmojiClick}
                                    width={300}
                                    height={350}
                                    emojiStyle="native"
                                    previewConfig={{ showPreview: false }}
                                    style={{ zIndex: 999999999 }}
                                />
                            </div>
                        )}
                    </div> */}


                    <Form.Control
                        as="textarea"
                        rows={1}
                        placeholder={replyingTo ? `Reply to @${replyingTo.username}...` : "Add a comment..."}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="flex-grow-1 border-0 bg-light rounded-pill px-3 py-2"
                        disabled={isSubmitting}
                        style={{
                            resize: 'none',
                            minHeight: '38px',
                            maxHeight: '100px',
                            overflowY: 'auto'
                        }}
                    />

                    <Button
                        variant="link"
                        className="p-0 text-primary"
                        type="submit"
                        disabled={!newComment.trim() || isSubmitting}
                        aria-label="Post comment"
                    >
                        {isSubmitting ? (
                            <Spinner animation="border" size="sm" />
                        ) : (
                            <FiSend size={20} />
                        )}
                    </Button>
                </Form>) : (
                    <div className='text-center'>please login to comment </div>
                )}
            </div>
        </div>
    );
};
export default CommentContainer;