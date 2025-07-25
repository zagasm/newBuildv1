import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from 'prop-types';
import LoadingOverlay from "../../assets/projectOverlay.jsx";
import { showToast } from "../../ToastAlert/index.jsx";
import { v4 as uuidv4 } from 'uuid';

const PostContext = createContext();

export const PostProvider = ({ children, user }) => {
    const [HomePostData, setHomePostData] = useState([]);
    const [UserProfilePostData, setUserProfilePostData] = useState([]);
    const [SidepostData, setSidepostData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const [singlePostLoading, setSinglePostLoading] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);

    const getVisitorId = () => {
        const storedVisitorId = localStorage.getItem('visitor_id');
        if (storedVisitorId) {
            return storedVisitorId;
        }
        const newVisitorId = 'visitor_' + uuidv4();
        localStorage.setItem('visitor_id', newVisitorId);
        return newVisitorId;
    };

    const userId = user?.user?.id || getVisitorId();

    useEffect(() => {
        fetchPost();
    }, [userId]);

    const fetchPost = async () => {
        setMessage("");
        setLoading(true);
        try {
            const endpoint = `${import.meta.env.VITE_API_URL}/api/v1/meme/${userId}`;
            const response = await fetch(endpoint, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    ...(user?.token && { Authorization: `Bearer ${user.token}` })
                },
            });
            const responseData = await response.json();
            console.log('responding __', responseData);

            if (responseData.status && Array.isArray(responseData.data)) {
                setHomePostData(responseData.data);
            } else {
                setHomePostData([]);
                console.warn("Unexpected response format:", responseData);
                if (!user?.user?.id) {
                    setMessage({
                        type: 'info',
                        message: 'Sign in to see personalized content'
                    });
                }
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
            setHomePostData([]);
            setMessage({
                type: 'error',
                message: 'Failed to load posts'
            });
        } finally {
            setLoading(false);
        }
    };

    // Function to add a new post to the HomePostData
    const addNewPost = (newPost) => {
        setHomePostData(prevPosts => [newPost, ...prevPosts]);
    };

    return (
        <PostContext.Provider
            value={{
                HomePostData,
                loading,
                UserProfilePostData,
                message,
                currentPost,
                singlePostLoading,
                fetchPost,
                refreshPosts: fetchPost,
                addNewPost // Expose the addNewPost function
            }}
        >
            {loading && <LoadingOverlay />}
            {children}
        </PostContext.Provider>
    );
};

export const usePost = () => useContext(PostContext);

PostProvider.propTypes = {
    user: PropTypes.shape({
        user: PropTypes.shape({
            id: PropTypes.string
        }),
        token: PropTypes.string
    }),
    children: PropTypes.node.isRequired
};

PostProvider.defaultProps = {
    user: null
};