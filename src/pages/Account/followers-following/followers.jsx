import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import default_profilePicture from '../../../assets/avater_pix.avif';
import Music_plate_icon from '../../../assets/nav_icon/Music_plate_icon.png';

function Accountfollowers() {
    const { user, token } = useAuth(); // Assuming AuthContext provides token and user
    const [followers, setFollowers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFollowers = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/v1/users/followers/${user.meta_data.user_id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.data.status) {
                    setFollowers(response.data.data);
                } else {
                    setError("Failed to fetch followers.");
                }
            } catch (err) {
                console.error("Error fetching followers:", err);
                setError("Something went wrong while fetching followers.");
            } finally {
                setLoading(false);
            }
        };

        if (user?.id && token) {
            fetchFollowers();
        }
    }, [user, token]);

    return (
        <div className="py-4">
            <div className="container-fluid p-0">
                <div className="r offset-xl-3 offset-lg-1 offset-md-1 bg-none home_section">
                    <main className="col col-xl-6 col-lg-8 col-md-12 col-sm-12 col-12 main_container m-0 pr-3 pl-3 pt-5">
                        {/* Header */}
                        <div className="account-header">
                            <div className="car rounded">
                                <div className="card-body d-flex align-items-center justify-content-between">
                                    <Link to={'/account'} className="d-flex align-items-center text-dark">
                                        <i className="fa fa-arrow-left"></i>
                                    </Link>
                                    <div className="d-flex align-items-center">
                                        <h6 className="m-0">Followers</h6>
                                    </div>
                                    <div className="d-flex align-items-center"></div>
                                </div>
                            </div>
                        </div>

                        {/* Followers List */}
                        <div className="account-nav mt-4">
                            <div className="row follow_inner_container">
                                {loading && <p>Loading followers...</p>}
                                {error && <p className="text-danger">{error}</p>}
                                {!loading && !error && followers.length === 0 && (
                                    <p>No followers found.</p>
                                )}
                                {followers.map((follower) => (
                                    <div key={follower.id} className="col-lg-12 col-12">
                                        <Link
                                            to={`/profile/${follower.id}`}
                                            className="shadow-sm card rounded border-0 mb-4"
                                        >
                                            <div className="card-body">
                                                <div className="d-flex align-items-center">
                                                    <img
                                                        src={follower.profile_picture || default_profilePicture}
                                                        className="nav_icon_img img-profile rounded-circle"
                                                        alt={`${follower.first_name} ${follower.last_name}`}
                                                    />
                                                    <div className="ml-2" style={{ lineHeight: "20px" }}>
                                                        <p style={{ fontWeight: "500" }} className="text-dark d-block m-0 text-capitalize">
                                                            {follower.first_name} {follower.last_name}
                                                        </p>
                                                        <p className="p-0 m-0 d-flex align-items-center">
                                                            <img src={Music_plate_icon} alt="" style={{width:'10px'}}/>
                                                            <small className="ml-1 p-0"> follower</small>
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

export default Accountfollowers;
