import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import SinglePostTemplate from "../../component/Posts/single";
import SideBarNav from "../pageAssets/sideBarNav";
import RightBarComponent from "../pageAssets/rightNav";
import SuggestedFriends from "../../component/Friends/suggestedFriends";
import { redirect, useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { decrypt } from "../../component/encryption/cryptoUtil";
import { Spinner } from "react-bootstrap";

const ViewPost = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { postId } = useParams();
  const { user } = useAuth();

  const getVisitorId = useCallback(() => {
    const stored = localStorage.getItem("visitor_id");
    if (stored) return stored;
    const id = "visitor_" + uuidv4();
    localStorage.setItem("visitor_id", id);
    return id;
  }, []);
  // const userId = 'djhdwjdd';
  const userId = user ? user.id : getVisitorId();
  const fetchPost = async () => {
    if (!userId) return;
    console.log('user in view post', userId);
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/meme/${postId}/single/${userId}`
      );
      if (response.data.status) {
        console.log('...............', response.data.data)
        setPost(response.data.data);
      } else {
        setError("Failed to fetch post.");
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching the post.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && postId) {
      fetchPost();
    }
  }, [postId, userId]);

  if (loading && !post) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }
  if (userId == null || userId == undefined) {
    redirect('/');
  }
  if (error && !post) {
    return (
      <div className="py-4">
        <div className="container-fluid p-0">
          <SideBarNav />
          <div className="ro offset-xl-3 offset-lg-1 offset-md-1 bg-none home_section">
            <main className="col col-xl-6 col-lg-8 col-md-12 col-sm-12 col-12 main_container m-0 pt-5 text-center">
              <p className="text-red-500 mb-4">Error: {error}</p>
              <button
                onClick={fetchPost}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                style={{
                  background: 'linear-gradient(84.41deg, #C207E7 1.78%, #490481 69.04%)'
                }}
              >
                Retry
              </button>
            </main>
            <RightBarComponent>
              <SuggestedFriends />
            </RightBarComponent>
          </div>
        </div>
      </div>
    );
  }
  // <main className="col col-xl-11 col-lg-8 col-md-12 col-sm-12 col-12 main-container main_container" style={{ paddingTop: '65px' }}>
  //                          
  //                       </main>
  return (
    <div className="py-4">
      <div className="container-fluid p-0">
        <SideBarNav />
        {/* {console.log('post', post)} */}
        <div className="ro offset-xl-3 offset-lg-1 offset-md-1 bg-none home_section">
          <main className="col col-xl-6 col-lg-8 col-md-12 col-sm-12 col-12 main_container m-0 pt-5">
            {post ? (<SinglePostTemplate data={post} />) : (
              <div className="post-creator-container d-flex justify-content-center align-items-center" style={{ height: 'calc(100vh - 200px)' }}>
                <Spinner animation="grow" style={{ color: '#8000FF' }} />
              </div>
            )}

          </main>
          <RightBarComponent>
            <SuggestedFriends />
          </RightBarComponent>
        </div>
      </div>
    </div>
  );
};

export default ViewPost;
