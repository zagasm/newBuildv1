import React, { useState } from 'react';
import { Image, Button, Badge, Spinner, Form } from 'react-bootstrap';
import TimeAgo from '../../assets/Timmer/timeAgo';
import { BsReply } from 'react-icons/bs';
import defaultAvatar from '../../../assets/avater_pix.webp';
import './commentStyle.css';
import { useAuth } from '../../../pages/auth/AuthContext';
import axios from 'axios';
import { showToast } from '../../ToastAlert';

const SingleComment = ({
    comment,
    onReply,
    loadMoreReplies,
    isReply = false,
    depth = 0
}) => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [editedBody, setEditedBody] = useState(comment.body);
    const [isUpdating, setIsUpdating] = useState(false);
    
    const fullName = comment.user?.first_name || comment.user?.username || 'Anonymous';
    const displayName = fullName.length > 20 ? fullName.slice(0, 20) + '...' : fullName;
    const [showReplies, setShowReplies] = useState(false);
    const [isLoadingReplies, setIsLoadingReplies] = useState(false);
    const MAX_NESTING_DEPTH = 3;

    const handleReply = () => {
        if (onReply) onReply(comment.id, comment.user?.username || 'user');
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

    const handleUpdateComment = async () => {
        if (!editedBody.trim() || isUpdating) return;
        
        setIsUpdating(true);
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/api/v1/meme/comments/${comment.id}`,
                { body: editedBody },
                {
                    headers: {
                        'Authorization': `Bearer ${user?.token}`,
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
            // console.error('Error updating comment:', error);
            // showToast.error(error.response?.data?.message || 'Failed to update comment');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className={`comment-item mb-3  d-flex ${comment.isPending ? 'opacity-75' : ''} ${isReply ? 'nested-comment' : ''}`}>
            <div className="flex-shrink-0">
                <Image
                    src={comment.user.meta_data.profile_picture || defaultAvatar}
                    roundedCircle
                    width={36}
                    height={36}
                    className="me-2"
                    alt={displayName}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultAvatar;
                    }}
                />
            </div>

            {isEditing ? (
                <div className="flex-grow-1">
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={editedBody}
                        onChange={(e) => setEditedBody(e.target.value)}
                        className="mb-2"
                    />
                    <div className="d-flex gap-2">
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={handleUpdateComment}
                            disabled={isUpdating || !editedBody.trim()}
                        >
                            {isUpdating ? <Spinner size="sm" /> : 'Update'}
                        </Button>
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={handleCancelEdit}
                            disabled={isUpdating}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center m-0 p-0">
                        <div className='p-0 m-0'>
                            <span className="commenter_name fw-bold mr-2">{displayName}</span>
                            <small className="text-muted"><TimeAgo date={comment.created_at} /></small>
                        </div>
                        {comment.isPending && (
                            <Badge bg="secondary" pill className="ms-2">Pending</Badge>
                        )}
                    </div>

                    <small className="comment_content mb d-block" style={{ whiteSpace: 'pre-wrap' }}>
                        {comment.body}
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
                                <Button
                                    variant="link"
                                    className="p-0 text-muted small text-decoration-none"
                                    onClick={handleEdit}
                                >
                                    Edit
                                </Button>
                            )}
                        </div>
                    )}

                    {comment.replies?.length > 0 && (
                        <div className="mt-2">
                            <Button
                                variant="link"
                                className="p-0 small"
                                style={{
                                    color: 'rgba(143, 7, 231, 1)',
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
                                    showReplies ? 'Hide replies' : `View ${comment.replies.length} repl${comment.replies.length === 1 ? 'y' : 'ies'}`
                                )}
                            </Button>
                        </div>
                    )}

                    {comment.replies?.length > 0 && showReplies && !isLoadingReplies && (
                        <div className="nested-replies mt-3">
                            {comment.replies.map(reply => (
                                <SingleComment
                                    key={reply.id}
                                    comment={reply}
                                    onReply={depth < MAX_NESTING_DEPTH - 1 ? onReply : null}
                                    loadMoreReplies={loadMoreReplies}
                                    isReply={true}
                                    depth={depth + 1}
                                />
                            ))}
                        </div>
                    )}

                    {comment.hasMoreReplies && comment.repliesPagination?.next_page_url && (
                        <div className="mt-2">
                            <Button
                                variant="link"
                                className="p-0 small text-primary"
                                onClick={() => loadMoreReplies(comment.id)}
                            >
                                View more replies
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SingleComment;