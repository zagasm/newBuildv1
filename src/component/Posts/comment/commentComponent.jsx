import React, { useState } from 'react';
import { Image, Button, Badge, Spinner, Form } from 'react-bootstrap';
import TimeAgo from '../../assets/Timmer/timeAgo';
import { BsReply } from 'react-icons/bs';
import defaultAvatar from '../../../assets/avater_pix.webp';
import './commentStyle.css';
import { CommentReactionButton } from './CommentReactionButton';
import { useAuth } from '../../../pages/auth/AuthContext';
import axios from 'axios';
import { showToast } from '../../ToastAlert';
import { Link } from 'react-router-dom';

const CommentComponent = ({
    comment,
    onReply,
    isReply = false,
    depth = 0
}) => {
    const { user, token } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [editedBody, setEditedBody] = useState(comment.body);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    // console.log('Comment:', comment);
    const fullName = comment.user?.first_name + ' ' + comment.user?.last_name || comment.user?.username || user?.last_name + " " + user?.first_name || 'Anonymous';
    const displayName = fullName.length > 20 ? fullName.slice(0, 20) + '...' : fullName;
    const user_id = comment.user.meta_data.user_id;
    const [showReplies, setShowReplies] = useState(false);
    const [isLoadingReplies, setIsLoadingReplies] = useState(false);
    const MAX_NESTING_DEPTH = 3;

    // Function to format text with styled hashtags and links
    const formatTextWithStyles = (text) => {
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
                            fontWeight: '600'
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

    const handleReply = () => {
        if (onReply) onReply(comment.id, comment.user?.username || comment.user?.first_name + '_' + comment.user?.last_name);
    };
    const toggleReplies = async () => {
        if (showReplies) {
            setShowReplies(false);
        } else {
            setIsLoadingReplies(true);
            await new Promise(resolve => setTimeout(resolve, 800));
            setShowReplies(true);
            setIsLoadingReplies(false);
        }
    };
    const handleEdit = () => {
        setIsEditing(true);
        setEditedBody(comment.body);
    };
    const handleCancelEdit = () => {
        setIsEditing(false);
    };
    // console.log("comment", comment);
    const handleUpdateComment = async () => {
        if (!editedBody.trim() || isUpdating) return;

        setIsUpdating(true);
        try {
            const response = await axios.patch(
                `${import.meta.env.VITE_API_URL}/api/v1/meme/comments/${comment.id}`,
                { body: editedBody },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );

            if (response.data.status) {
                setIsEditing(false);
                comment.body = editedBody;
                comment.updated_at = new Date().toISOString();
                showToast.success('Comment updated successfully');
            }
        } catch (error) {
            console.error('Error updating comment:', error);
            showToast.error(error.response?.data?.error || 'Failed to update comment');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeleteComment = async () => {
        if (isDeleting) return;

        const confirmDelete = window.confirm('Are you sure you want to delete this comment?');
        if (!confirmDelete) return;

        setIsDeleting(true);
        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_API_URL}/api/v1/meme/comments/${comment.id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data.status) {
                showToast.success('Comment deleted successfully');
                // Remove the comment from the UI by setting isDeleted flag
                comment.isDeleted = true;
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
            showToast.error(error.response?.data?.message || 'Failed to delete comment');
        } finally {
            setIsDeleting(false);
        }
    };

    if (comment.isDeleted) {
        return (
            <div className={`comment-item mb-3 d-flex ${isReply ? 'nested-comment' : ''}`}>
                <small className="text-muted">Comment deleted</small>
            </div>
        );
    }

    return (
        <div className={`comment-item mb-3 d-flex ${comment.isPending ? 'opacity-75' : ''} ${isReply ? 'nested-comment' : ''}`} >
            <div className="flex-shrink-0">
                <Image
                    src={defaultAvatar}
                    roundedCircle
                    width={36}
                    height={36}
                    className="me-2"
                    alt={displayName}
                // onError={(e) => {
                //     e.target.onerror = null;
                //     e.target.src = defaultAvatar;
                // }}
                />
            </div>

            {isEditing ? (
                <div className="flex-grow-1">
                    <Form.Control
                        as="textarea"
                        rows={2}
                        value={editedBody}
                        onChange={(e) => setEditedBody(e.target.value)}
                        className="mb-2"
                    />
                    <div className="d-flex gap-2">
                        <Button
                            size="sm"
                            onClick={handleUpdateComment}
                            disabled={isUpdating || !editedBody.trim()}
                            className='pl-2 pr-2 border-0 bg-none'
                            style={{ background: '#8F07E7', }}
                        >
                            {isUpdating ? <Spinner size="sm" /> : 'Update'}
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleCancelEdit}
                            disabled={isUpdating}
                            className='border-none'
                            style={{ background: '#b0aab3ff', color: 'white', border: 'none' }}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center m-0 p-0">
                        <div className='p-0 m-0'>
                            <Link to={'/profile/'+user_id} style={{ fontWeight: '500' }} className="commenter_name mr-2 text-dark">{displayName}</Link>
                            <small className="text-muted"><TimeAgo date={comment.created_at} /></small>
                        </div>
                        {comment.isPending && (
                            <Badge bg="secondary" pill className="ms-2">Pending</Badge>
                        )}
                        {/* {console.log('commenting', comment)} */}
                        <span>
                            <CommentReactionButton
                                initialCount={comment.like_count}
                                CommentId={comment.id}
                                userId={user && user.id}
                                i_react={comment.is_liked}

                            /> </span>
                    </div>

                    <small className="comment_content mb d-block" style={{ whiteSpace: 'pre-wrap' }}>
                        {formatTextWithStyles(comment.body)}
                    </small>

                    {depth < MAX_NESTING_DEPTH && (
                        <div className="d-flex gap-2">
                            <Button
                                variant="link"
                                className="p-0 text-muted small text-decoration-none"
                                onClick={handleReply}
                            >
                                <BsReply className="me-1" />
                                Reply
                            </Button>
                            {user?.id === comment.user_id && (
                                <>
                                    <Button
                                        variant="link"
                                        className="p-0 text-muted small text-decoration-none"
                                        onClick={handleEdit}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="link"
                                        className="p-0 text-muted small text-decoration-none"
                                        onClick={handleDeleteComment}
                                        disabled={isDeleting}
                                    >
                                        {isDeleting ? 'Deleting...' : 'Delete'}
                                    </Button>
                                </>
                            )}
                        </div>
                    )}

                    {comment.replies?.length > 0 && (
                        <div className="replies-section">
                            <Button
                                variant="link"
                                className="p-0 m-0 small"
                                style={{
                                    color: 'rgba(6, 1, 10, 1)',
                                    textDecoration: 'none',
                                    fontWeight: 'bolder',
                                    fontSize: '13px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}
                                onClick={toggleReplies}
                                disabled={isLoadingReplies}
                            >
                                {isLoadingReplies ? (
                                    <>
                                        <Spinner animation="border" size="sm" />
                                        Loading...
                                    </>
                                ) : (
                                    showReplies ? 'Hide replies' : `View ${comment.replies.length} repl${comment.replies.length === 1 ? 'y' : 'ies...'}`
                                )}
                            </Button>

                            {showReplies && !isLoadingReplies && (
                                <div className="nested-replies mt-2 ps-3 border-start border-2 border-light">
                                    {comment.replies.map(reply => (
                                        <CommentComponent
                                            key={reply.id}
                                            comment={reply}
                                            onReply={depth < MAX_NESTING_DEPTH - 1 ? onReply : null}
                                            isReply={true}
                                            depth={depth + 1}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CommentComponent;

