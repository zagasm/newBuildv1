import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../pageAssets/Navbar';
import default_profilePicture from '../../../assets/avater_pix.avif';
import { FiEdit, FiCamera } from 'react-icons/fi';
import './headerStyling.css';
import { useAuth } from "../../auth/AuthContext";
import { useProfile } from "../../context/ProfileContext"; // <-- import the profile context
import EditProfileModal from "./editProfileModal";
import profile_page_frame from '../../../assets/profile_page_frame.png';
import camera_filled from '../../../assets/nav_icon/camera_filled.png';

function ProfileHeader() {
    const { user, logout } = useAuth();
    const { profileId } = useParams();
    const { ProfileData, fetchProfileById, isProfileLoading } = useProfile();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const navigate = useNavigate();

    // Fetch profile data when profileId changes
    useEffect(() => {
        if (profileId) {
            fetchProfileById(profileId);
        }
    }, [profileId]);

    // Memoize all user-derived values to prevent unnecessary recalculations
    const { ProfileId, email, isOwnProfile, fullName, username, profileImage } = useMemo(() => {
        const safeUser = ProfileData || {};

        // Handle profile image with fallback
        let imgSrc;
        try {
            imgSrc = safeUser?.meta_data?.profile_picture || default_profilePicture;
            if (imgSrc && !imgSrc.startsWith('http') && !imgSrc.startsWith('data:')) {
                imgSrc = default_profilePicture;
            }
        } catch {
            imgSrc = default_profilePicture;
        }
        return {
            ProfileId: safeUser?.id ? safeUser?.id : profileId,
            isOwnProfile: user?.id === profileId,
            fullName: `${safeUser?.first_name || ''} ${safeUser?.last_name || ''}`.trim(),
            username: safeUser?.username ? `@${safeUser.username}` : '',
            email: safeUser?.email || '',
            profileImage: imgSrc
        };
    }, [ProfileData, user, profileId]);

    const toggleUserProfileUpdateModal = () => {
        setIsModalOpen(prev => !prev);
    };

    const confirmLogout = () => {
        setShowLogoutConfirm(true);
    };

    const cancelLogout = () => {
        setShowLogoutConfirm(false);
    };

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
        navigate('/');
    };

    if (isProfileLoading) {
        return (
            <div className="profile-header-container">
                <Navbar />
                <p className="text-center mt-5">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="profile-header-container">
            <Navbar />
            <div className="cover-photo mt-5">
                <div
                    className="cover-gradient"
                    style={{
                        background: `linear-gradient(to bottom, rgba(0, 0, 0, 0.36), rgba(0, 0, 0, 0.29)), url(${profile_page_frame})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }} >
                    {isOwnProfile && (
                        <div>
                            <button onClick={toggleUserProfileUpdateModal} className="edit-user-details-btn ">
                                <FiEdit />
                            </button>
                            <button className="edit-cover-btn cover_picture " >
                                <img src={camera_filled} alt="" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className="profile-content">
                <div className="profile-picture-container">
                    <div className="profile-picture-wrapper">
                        <img
                            src={profileImage}
                            alt="Profile"
                            className="profile-picture"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = default_profilePicture;
                            }}
                        />
                        {isOwnProfile && (
                            <button className="edit-picture-btn ">
                                <FiCamera />
                            </button>
                        )}
                    </div>
                </div>
                <div className="profile-info d-flex justify-content-center">
                    <div className=" text-center line-height">
                        <h1 className="profile-name text-capitalize">{fullName || 'User'}</h1>
                        {username || email ? <p className="profile-username">{username || email}</p> : null}
                    </div>
                </div>

                {ProfileData && (
                    <div className="profile-actions">
                        {isOwnProfile && (
                            <button className="edit-profile-btn" onClick={toggleUserProfileUpdateModal}>
                                <FiEdit />
                                <span>Edit Profile</span>
                            </button>
                        )}
                    </div>
                )}
            </div>

            <EditProfileModal isOpen={isModalOpen} onClose={toggleUserProfileUpdateModal} />
        </div>
    );
}

export default ProfileHeader;
