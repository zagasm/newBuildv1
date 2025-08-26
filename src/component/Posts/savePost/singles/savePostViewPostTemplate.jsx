import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../../pages/auth/AuthContext";
import default_profilePicture from "../../../../assets/avater_pix.avif";
import TimeAgo from "../../../assets/Timmer/timeAgo";
import "../savePostStyling.css";
import SinglePostTemplate from "../../single";

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
         <SinglePostTemplate data={post} />
        ))
      )}
    </div>
  );
}

export default SavePostViewPostTemplate;
