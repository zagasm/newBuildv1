import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import default_profilePicture from '../../../assets/avater_pix.avif';
import Music_plate_icon from '../../../assets/nav_icon/Music_plate_icon.png';
import FollowersFollowingLoader from "./shinner";

function Accountfollowing() {
    const { user, token } = useAuth();
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFollowing = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/v1/users/following/${user.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.data.status) {
                    setFollowing(response.data.data);
                } else {
                    setError("Failed to fetch following.");
                }
            } catch (err) {
                console.error("Error fetching following:", err);
                setError("Something went wrong while fetching following.");
            } finally {
                setLoading(false);
            }
        };

        if (user?.id && token) {
            fetchFollowing();
        }
    }, [user, token]);
    // useEffect(() => {
    //     setTimeout(() => {
    //         setProfile({ name: "John Doe", bio: "Software Engineer" });
    //         setLoading(false);
    //     }, 2000); // fake API delay
    // }, []);

    // if (loading) return <FollowersFollowingLoader />;
    return (
        <div className="py-4">
            <div className="container-fluid p-0">
                <div className="r offset-xl-3 offset-lg-1 offset-md-1 bg-none home_section">
                    <main className="col col-xl-6 col-lg-8 col-md-12 col-sm-12 col-12 main_container pr-3 pl-3 m-0 pt-5">

                        {/* Header */}
                        <div className="account-header">
                            <div className="car r">
                                <div className="card-body d-flex align-items-center justify-content-between">
                                    <Link to={'/account'} className="d-flex align-items-center text-dark">
                                        <i className="fa fa-arrow-left"></i>
                                    </Link>
                                    <div className="d-flex align-items-center">
                                        <h6 className="m-0">Following</h6>
                                    </div>
                                    <div className="d-flex align-items-center"></div>
                                </div>
                            </div>
                        </div>

                        {/* Following List */}
                        <div className="account-nav mt-4">
                            <div className="row follow_inner_container">
                                {loading && <p>Loading following...</p>}
                                {error && <p className="text-danger">{error}</p>}
                                {!loading && !error && following.length === 0 && (
                                    <p>You are not following anyone yet.</p>
                                )}

                                {following.map((followed) => (
                                    <div key={followed.id} className="col-lg-12 col-12">
                                        <Link
                                            to={`/profile/${followed.id}`}
                                            className="shadow-sm card rounded border-0 mb-4"
                                        >
                                            <div className="card-body">
                                                <div className="d-flex align-items-center">
                                                    <img
                                                        src={followed.profile_picture || default_profilePicture}
                                                        className="nav_icon_img img-profile rounded-circle"
                                                        alt={`${followed.first_name} ${followed.last_name}`}
                                                    />
                                                    <div className="ml-2" style={{ lineHeight: "20px" }}>
                                                        <p style={{ fontWeight: "500" }} className="text-dark d-block m-0 text-capitalize">
                                                            {followed.first_name} {followed.last_name}
                                                        </p>
                                                        <p className="p-0 m-0 d-flex align-items-center">
                                                            <img src={Music_plate_icon} alt="" style={{width:'10px',}} />
                                                            <small className="ml-1  p-0">
                                                                {followed.posts_count || 0} posts
                                                            </small>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default Accountfollowing;
