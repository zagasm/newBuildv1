import React from 'react';
import SingleComment from './SingleComment';

const ReplyComponent = ({ reply, onReply, depth = 0 }) => {
    return (
        <div
            className="reply-wrapper"
            style={{
                marginLeft: `${Math.min(depth * 200, 400)}px`,
                borderLeft: depth > 0 ? '2px solid #eee' : 'none',
                paddingLeft: depth > 0 ? '55px' : '60'
            }} >
            <SingleComment
                comment={reply}
                onReply={onReply}
                isPending={reply.isPending} />
            {reply.replies && reply.replies.length > 0 && (
                <div className="replies-container">
                    {reply.replies.map((nestedReply) => (
                        <ReplyComponent 
                            key={nestedReply.id} 
                            reply={nestedReply} 
                            onReply={onReply}
                            depth={depth + 1}
                        />
                    ))}
                    {console.log("replies", reply.replies)}
                </div>
            )}
        </div>
    );
};

export default ReplyComponent;