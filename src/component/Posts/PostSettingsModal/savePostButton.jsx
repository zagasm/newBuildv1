import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../../pages/auth/AuthContext";
import { showToast } from "../../ToastAlert";

const SavePostButton = ({  memeId }) => {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const{user,token} = useAuth()

  const handleSaveToggle = async () => {
    if (loading) return; // prevent spamming
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/meme/${memeId}/save-unsave`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status) {
        if (response.data.action === "saved") {
          setSaved(true);
        } else if (response.data.action === "unsaved") {
          setSaved(false);
        }
          showToast.info(response.data.message);
      }
    } catch (error) {
      console.error("Error saving meme:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <button
      className="w-100 text-left d-flex align-items-center py-3"
      type="button"
      onClick={handleSaveToggle}
      disabled={loading}
      style={{
        background: "none",
        border: "none",
        fontSize: "14px",
        opacity: loading ? 0.6 : 1,
        cursor: loading ? "not-allowed" : "pointer",
      }}
    >
      <i
        className={`${saved ? "fas" : "far"} fa-bookmark mr-3`}
        style={{ width: "24px", fontSize: "20px" }}
      ></i>
      <span>{saved ? "Unsave Post" : "Save Post"}</span>
    </button>
  );
};

export default SavePostButton;
