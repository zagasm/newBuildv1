import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from 'prop-types';
import LoadingOverlay from "../../assets/projectOverlay.jsx";
import { showToast } from "../../ToastAlert/index.jsx";

const PostContext = createContext();

export const PostProvider = ({ children, user }) => {
    const [HomePostData, setHomePostData] = useState([]);
    const [UserProfilePostData, setUserProfilePostData] = useState([]);
    const [SidepostData, setSidepostData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const [singlePostLoading, setSinglePostLoading] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);
    //    const []
    if (user) {

    }
    const user_id = user ? user.user.id : '';
    // console.log('checker',user.user.id);

    useEffect(() => {
        if (user_id) {
            fetchUserPost();
            fetchPost();
        } else {
            setLoading(false);
            setMessage({
                type: 'info',
                message: 'Please sign in to view posts'
            });
        }
    }, [user_id]);

    const fetchPostById = async (postId) => {
        if (!user_id) {
            setMessage({
                type: 'error',
                message: 'User not authenticated'
            });
            return null;
        }

        setSinglePostLoading(true);
        setMessage("");

        try {
            const formPayload = new FormData();
            formPayload.append("api_secret_key", import.meta.env.VITE_API_SECRET || 'Zagasm2025!Api_Key_Secret');
            formPayload.append("post_id", postId);
            formPayload.append("user_id", user_id);

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/includes/ajax/posts/get_post_details.php`,
                {
                    method: "POST",
                    body: formPayload,
                    // credentials: 'include'
                }
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const responseData = await response.json();
            console.log("single Post data:", responseData.post);
            if (!responseData.post) {
                throw new Error("Post not found");
            }

            setCurrentPost(responseData.post);
            return responseData.post;

        } catch (error) {
            console.log("Error fetching post:", error);
            setMessage({
                type: "danger",
                message: error.message || "Failed to load post"
            });
            showToast.error(error.message || "Failed to load post");
            return null;
        } finally {
            setSinglePostLoading(false);
        }
    };



    const fetchPost = async () => {
        if (!user_id) {
            setMessage({
                type: 'error',
                message: 'User not authenticated',
            });
            return;
        }

        setMessage("");
        setLoading(true);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/meme/${user_id}`,
                {
                    method: "GET",
                    // headers: {
                    //     "Content-Type": "application/json",
                    // },
                }
            );

            const responseData = await response.json(); // parse the JSON
                console.log(responseData.data)
            // if (responseData.status && Array.isArray(responseData.data)) {
            //     setHomePostData(responseData.data); // set the post data in state
            // } else {
            //     setHomePostData([]);
            //     console.warn("Unexpected response format:", responseData);
            // }
        } catch (error) {
            console.error("Error fetching posts:", error);
            setHomePostData([]);
        } finally {
            setLoading(false);
        }
    };




    const fetchUserPost = async (profileId) => {
        if (!user_id) {
            setMessage({
                type: 'error',
                message: 'User not authenticated'
            });
            return;
        }
        setMessage("");
        setLoading(true);

        try {
            const formPayload = new FormData();
            formPayload.append("api_secret_key", import.meta.env.VITE_API_SECRET || 'Zagasm2025!Api_Key_Secret');
            formPayload.append("profile_id", profileId);
            // formPayload.append("offset", '1');
            formPayload.append("limit", '100');
            formPayload.append("user_id", user_id);

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/includes/ajax/users/get_user_posts.php`,
                {
                    method: "POST",
                    body: formPayload,
                    // credentials: 'include'
                }
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            if (!responseData.posts) {
                throw new Error("Post not found");
            }
            setUserProfilePostData(responseData.posts);
            return responseData.posts;

        } catch (error) {
            console.log("Error fetching posts:", error);
            setUserProfilePostData([]);
        } finally {
            setLoading(false);
        }
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
                fetchPostById,
                // refreshProfilePost: fetchUserPost,
                refreshPosts: fetchPost
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
        user_id: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ])
    }),
    children: PropTypes.node.isRequired
};

PostProvider.defaultProps = {
    user: null
};