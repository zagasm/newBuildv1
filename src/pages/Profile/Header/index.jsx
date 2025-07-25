import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../pageAssets/Navbar';
import default_profilePicture from '../../../assets/avater_pix.avif';
import { FiEdit, FiCamera, FiMoreHorizontal, FiX } from 'react-icons/fi';
import './headerStyling.css';
import ShimmerLoader from '../../../component/assets/Loader/profileHeaderLoader';
import { useAuth } from "../../auth/AuthContext";
import EditProfileModal from "./editProfileModal";
import profile_page_frame from '../../../assets/profile_page_frame.png'



// Mock data
const mockProfileData = {
    user_id: "12345",
    user_firstname: "John",
    user_lastname: "Doe",
    user_name: "johndoe",
    user_picture: null,
    post_count: 42,
    followers_count: 1024,
    following_count: 56,
    i_am_following: false,
    bio: "Digital creator | Photography enthusiast | Travel lover"
};

function ProfileHeader() {
    const { user, isAuthenticated, logout, showAuthModal } = useAuth();
    const { profileId } = useParams();
    const [isProfileLoading, setIsProfileLoading] = useState(true);
    const [profileData, setProfileData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setProfileData(mockProfileData);
            setIsProfileLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, [profileId]);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    if (isProfileLoading) return <ShimmerLoader />;
    if (!profileData) return <div className="error-message">Profile not found</div>;

    const isOwnProfile = user?.user_id === profileId;
    const profileImage = profileData.user_picture || default_profilePicture;
    const fullName = `${profileData.user_firstname} ${profileData.user_lastname}`;
    const username = profileData.user_name ? `@${profileData.user_name}` : "";

    return (
        <div className="profile-header-container">
            <Navbar />

            {/* Cover Photo */}
            <div className="cover-photo">
                <div
                    className="cover-gradient"
                    style={{
                        background: `linear-gradient(to bottom, rgba(0, 0, 0, 0.36), rgba(0, 0, 0, 0.29)), url(${profile_page_frame})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                >
                    <button className="edit-cover-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.05l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Profile Content */}
            <div className="profile-content">
                {/* Profile Picture */}
                <div className="profile-picture-container">
                    <div className="profile-picture-wrapper">
                        <img
                            src={profileImage}
                            alt="Profile"
                            className="profile-picture"
                            onError={(e) => e.target.src = default_profilePicture}
                        />
                        {isOwnProfile && (
                            <button className="edit-picture-btn">
                                <FiCamera />
                            </button>
                        )}
                    </div>
                </div>

                {/* Profile Info */}
                <div className="profile-info">
                    <h1 className="profile-name">{fullName}</h1>
                    <p className="profile-username">{username}</p>
                </div>

                {user && (
                    <>
                        <div className="profile-actions">
                            <button className="edit-profile-btn" onClick={toggleModal}>
                                <FiEdit />
                                <span>Edit Profile</span>
                            </button>
                        </div>
                        <a style={{ cursor: 'pointer' }} onClick={() => logout()} className="text-center"><i className="fa fa-lock"></i> Log out</a>
                    </>
                )}
            </div>

            {/* Edit Profile Modal */}
            <EditProfileModal isOpen={isModalOpen} onClose={toggleModal} />
        </div>
    );
}

export default ProfileHeader;