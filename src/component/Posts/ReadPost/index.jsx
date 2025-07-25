import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './postViewStyle.css';
import SinglePostTemplate from '../single';
import FullScreenPreloader from './FullScreenPreloader';
import CommentContainer from '../comment/commentContainer';
import { usePost } from '../PostContext';

function Post() {
    const { postId } = useParams();
    const { fetchPostById, currentPost, singlePostLoading } = usePost();
    const [isMobile, setIsMobile] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // if (postId) {
        //     fetchPostById(postId);
        // }
        
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timer);
        };
    }, [postId]);

    // if (singlePostLoading || isLoading) {
    //     return <FullScreenPreloader />;
    // }
    if (!currentPost) {
        return <div className="container py-4">Post not found</div>;
    }
    return (
        <div className="container py-4" >
            <Helmet>
                <title>{currentPost.post_author_name}'s Post</title>
                <meta property="og:title" content={`${currentPost.post_author_name}'s Post`} />
                {currentPost.text && (
                    <meta property="og:description" content={currentPost.text.substring(0, 160)} />
                )}
            </Helmet>

            <div className="row" style={{paddingTop: '65px'}}>
                <div className={`col-md-8 ${isMobile ? 'mobile-post' : ''}`}>
                    <SinglePostTemplate
                        key={currentPost.post_id}
                        data={currentPost}
                    />
                </div>
                
                <div className="col-md-4">
                    <CommentContainer post={currentPost} show={true} comment_data={currentPost.post_comments} />
                </div>
            </div>
        </div>
    );
}

export default Post;