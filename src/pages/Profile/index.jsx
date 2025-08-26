import React, { useState, useEffect } from "react";
import "./generalStyling.css";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import default_profilePicture from "../../assets/avater_pix.webp";
import UserPost from "./AlluserPosts";

function ProfilePage() {
    const { profileId } = useParams();
    const [activeTab, setActiveTab] = useState("followers");
    const [visibleCount, setVisibleCount] = useState(4);
    const [followersData, setFollowersData] = useState([]);
    const [followingData, setFollowingData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { token } = useAuth();

    const fetchData = async (tab) => {
        setLoading(true);
        setError(null);

        try {
            const endpoint = tab === "followers"
                ? `${import.meta.env.VITE_API_URL}/api/v1/users/followers/${profileId}`
                : `${import.meta.env.VITE_API_URL}/api/v1/users/following/${profileId}`;

            const response = await fetch(endpoint, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data?.status && Array.isArray(data.data)) {
                if (tab === "followers") {
                    setFollowersData(data.data);
                } else {
                    setFollowingData(data.data);
                }
            } else {
                throw new Error(data.message || "Invalid response format");
            }
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message || "Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (profileId) {
            // Fetch both followers and following data when component mounts
            fetchData("followers");
            fetchData("following");
        }
    }, [profileId]);

    const currentData = activeTab === "followers" ? followersData : followingData;
    const visibleData = currentData.slice(0, visibleCount);
    const hasMore = visibleData.length < currentData.length;

    const handleSeeMore = () => setVisibleCount((prev) => prev + 4);

    const handleTabChange = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
            setVisibleCount(4);
        }
    };
    const truncateText = (text, maxLength) =>
        !text ? "" : text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    return (
        <div className="profile_page_section_view mb-5 pb-5">
            <div className="row">
                <div className="col-xl-6 col-sm-12">
                    <ul className="actions_section">
                        <li>
                            <b className="mr-1" style={{fontWeight:'500'}}>0</b>
                            <span>Posts</span>
                        </li>
                        <li>
                            <b className="mr-1" style={{fontWeight:'500'}}>{followersData.length}</b>
                            <span>Followers</span>
                        </li>
                        <li>
                            <b className="mr-1" style={{fontWeight:'500'}}>{followingData.length}</b>
                            <span>Following</span>
                        </li>
                    </ul>

                    <div className="followers_following_user_container mt-5">
                        <div className="tabs">
                            <button
                                className={`tab ${activeTab === "followers" ? "active" : ""}`}
                                onClick={() => handleTabChange("followers")} >
                                Followers
                            </button>
                            <button
                                className={`tab ${activeTab === "following" ? "active" : ""}`}
                                onClick={() => handleTabChange("following")}
                            >
                                Following
                            </button>
                        </div>
                        <div className="tab-content">
                            {error ? (
                                <div className="error-message">
                                    {error}
                                    <button
                                        onClick={() => fetchData(activeTab)}
                                        className="retry-btn px-2 py-2 bg-blue-500 text-white border-0 rounded hover:bg-blue-600"
                                        style={{ background: "rgba(143, 7, 231, 1)" }}
                                    >
                                        Retry
                                    </button>
                                </div>
                            ) : loading ? (
                                <div className="loading-indicator">
                                    <div className="spinner"></div>
                                    <span>Loading...</span>
                                </div>
                            ) : (
                                <>
                                    <div className="users-grid">
                                        {visibleData.length > 0 ? (
                                            visibleData.map((user) => (
                                                <Link  to={`/profile/${user.id}`} key={user.id} className="user-card">
                                                    <div className="user-avatar-container">
                                                        <img
                                                            src={user.profile_picture || default_profilePicture}
                                                            alt={user.username}
                                                            className="user-avatar"
                                                            style={{ borderRadius: "0%" }}
                                                            loading="lazy"
                                                        />
                                                    </div>
                                                    <span className="username">
                                                        <Link
                                                            to={`/profile/${user.id}`}
                                                            className="text-decoration-none text-dark"
                                                        >
                                                            {truncateText(
                                                                user.username ||
                                                                `${user.first_name} ${user.last_name}`,
                                                                10
                                                            )}
                                                        </Link>
                                                    </span>
                                                </Link>
                                            ))
                                        ) : (
                                            <div className="no-data-message">
                                                No {activeTab} found
                                            </div>
                                        )}
                                    </div>
                                    {hasMore && (
                                        <div className="see-more-container">
                                            <button
                                                className="see-more-btn"
                                                onClick={handleSeeMore}
                                                disabled={loading}
                                            >
                                                {loading ? "Loading..." : `See all ${activeTab}`}
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="col-xl-6 col-sm-12">
                    <UserPost profileId={profileId} />
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;