import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../../pages/auth/AuthContext";
import default_profilePicture from "../../../../assets/avater_pix.avif";
import TimeAgo from "../../../assets/Timmer/timeAgo";
import "../savePostStyling.css";

function SavePostViewPostTemplate() {
  const { token } = useAuth();
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/meme/get-saved`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSavedPosts(res.data.data || []);
      } catch (err) {
        console.error("Error fetching saved memes:", err);
        setError("Failed to load saved posts");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedPosts();
  }, [token]);

  if (loading) return <p className="loading-text">Loading saved posts...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="savePostWrapper">
      {savedPosts.length === 0 ? (
        <p className="no-posts">No saved posts yet.</p>
      ) : (
        savedPosts.map((post) => (
          <div key={post.id} className="savePostContainer">
            <div className="postRow">
              {/* Post Media */}
              <div className="postImageSection">
                {post.meme.media_path.length === 0 ? (
                  <div
                    className="mediaContent"
                    style={{
                      background: post.meme.background_color || "#f4f4f4",
                      color: post.meme.text_color || "#000",
                      fontFamily: post.meme.font_family,
                      fontSize: post.meme.font_size,
                    }}>
                    {post.meme.text_content+'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Maiores velit voluptas sequi laudantium magnam eum, nemo quos. Porro assumenda illo amet. Error voluptatem voluptatum dolorem veritatis quasi repellat quae earum? Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem est, exercitationem ipsa hic expedita, aperiam vitae, odit porro necessitatibus dolor incidunt. Accusamus veniam provident officiis est unde illo harum! Earum.'}
                    
                  </div>
                ) : (
                  <div className="mediaWrapper">
                    <img
                      src={post.meme.media_path[0]}
                      alt="Meme"
                      className="memeImage"
                    />
                  </div>
                )}
              </div>

              {/* Post Details */}
              <div className="postDetails">
                <div className="postHeader">
                  {/* User Info */}
                  <div className="userDetails">
                    <img
                      className="userAvatar"
                      src={default_profilePicture}
                      alt="User Avatar"
                    />
                    <div>
                      <div className="username">User {post.meme.user_id}</div>
                      <small className="userMeta">
                        Meme ID: {post.meme.id.slice(0, 6)}...
                      </small>
                    </div>
                  </div>

                  {/* Menu */}
                  <div className="miniFeatures">
                    <i className="feather-more-vertical"></i>
                  </div>
                </div>

                {/* Meme Content */}
                <div className="memeContent">
                  {post.meme.text_content || "No caption"}
                </div>

                {/* Reactions */}
                <div className="reactionSection">
                  <button className="reactionBtn">
                    {post.meme.like_count} reactions
                  </button>
                </div>

                {/* Time Ago */}
                <div className="MemeTimeAgo">
                  <div className="timeAgoRow">
                    <div className="timeDot"></div>
                    Saved <TimeAgo date={post.created_at} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default SavePostViewPostTemplate;
