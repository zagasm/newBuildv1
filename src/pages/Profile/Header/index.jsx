import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../pageAssets/Navbar';
import default_profilePicture from '../../../assets/avater_pix.webp';
import { FiCamera, FiEdit } from 'react-icons/fi';
import './headerStyling.css';
import { useAuth } from "../../auth/AuthContext";
import profile_page_frame from '../../../assets/profile_page_frame.png';
import camera_filled from '../../../assets/nav_icon/camera_filled.png';
import Cropper from "react-easy-crop";
import EditProfileModal from "./editProfileModal";
import FollowButton from "../../../component/Posts/PostSettingsModal/followButton";
import StartChatButton from "../../../component/chats/startConversationBtn";
import { useProfileImageUpload } from "./useProfileImageUpload";
import ProfilePage from "..";

function ProfileHeader() {
    const { user, logout, token } = useAuth();
    const { profileId } = useParams();
    const { profileUploading, coverUploading, uploadProfilePicture, uploadCoverPhoto } = useProfileImageUpload();
    const [ProfileData, setProfileData] = useState(null);
    const [isProfileLoading, setIsProfileLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [selectedCover, setSelectedCover] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    // 🔹 Fetch profile from API
    const fetchProfileById = async (id) => {
        setIsProfileLoading(true);
        setMessage(null);
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/users/profile/${id}/${user?.meta_data.id || ''}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            if (data?.user) {
                setProfileData(data.user);
                return data.user;
            } else {
                throw new Error("No profile data found");
            }
        } catch (error) {
            setMessage({ type: "error", message: error.message || "Failed to load profile" });
            return null;
        } finally {
            setIsProfileLoading(false);
        }
    };

    useEffect(() => {
        if (!profileId) return;

        // 🔹 If the logged-in user is viewing their own profile → use session data
        if (user?.id === profileId) {
            setProfileData(user);
            setIsProfileLoading(false);
        } else {
            fetchProfileById(profileId);
        }
    }, [profileId, user]);

    // 🔹 Derived profile info
    const { email, isOwnProfile, fullName, cover_photo, username, profileImage } = useMemo(() => {
        const safeUser = ProfileData || {};
        const timestamp = Date.now();
        const processImageUrl = (url, fallback) =>
            url?.startsWith('http') ? `${url.split('?')[0]}?t=${timestamp}` : fallback;

        return {
            isOwnProfile: user?.id === profileId,
            fullName: `${safeUser?.first_name || ''} ${safeUser?.last_name || ''}`.trim(),
            username: safeUser?.username ? `@${safeUser.username}` : '',
            email: safeUser?.email || '',
            profileImage: processImageUrl(safeUser?.meta_data?.profile_picture, default_profilePicture),
            cover_photo: processImageUrl(safeUser?.meta_data?.cover_photo, profile_page_frame)
        };
    }, [ProfileData, user, profileId]);

    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (file) uploadProfilePicture(file);
    };

    const handleCoverPicSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            setSelectedCover(reader.result);
            setCropModalOpen(true);
        };
        reader.readAsDataURL(file);
    };

    const onCropComplete = (_, croppedPixels) => setCroppedAreaPixels(croppedPixels);
    const toggleUserProfileUpdateModal = () => setIsModalOpen(prev => !prev);

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
        navigate('/');
    };
 console.log(ProfileData);
    // 🔹 Loading skeleton
    if (isProfileLoading) {
        return (
            <div className="profile-header-container">
                <Navbar />
                <div className="cover-photo mt-5 shimmer-cover"></div>
                <div className="profile-content">
                    <div className="profile-picture-container shimmer-circle"></div>
                    <div className="profile-info d-flex justify-content-center">
                        <div className="text-center line-height">
                            <div className="shimmer-line w-50"></div>
                            <div className="shimmer-line w-25 mt-2"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="profile-header-container">
                <Navbar />

                {/* COVER PHOTO */}
                <div className="cover-photo mt-5">
                    <div
                        className="cover-gradient "
                        style={{
                            background: `linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.14)), url(${cover_photo}) center / cover no-repeat`
                        }}
                    >
                        {coverUploading && (
                            <div className="cover-upload-overlay">
                                <div className="spinner-border text-light" role="status"></div>
                            </div>
                        )}

                        {isOwnProfile && (
                            <div>
                             
                                <label className="edit-cover-btn cover_picture">
                                    <img src={camera_filled} alt="" style={{ width: '15px' }} />
                                    <input type="file" accept="image/*" hidden onChange={handleCoverPicSelect} />
                                </label>
                            </div>
                        )}
                    </div>
                    <div>
                        <Link to={'/account'} className="backBtn ">
                            <i className="fa fa-angle-left"></i>
                        </Link>
                    </div>
                </div>
                {/* PROFILE PICTURE */}
                <div className="profile-content">
                    <div className="profile-picture-container">
                        <div className="profile-picture-wrapper">
                            <img src={profileImage} alt="Profile" className="profile-picture" />
                            {profileUploading && (
                                <div className="profile-upload-loade upload-profile-image-loade">
                                    <div className="spinner-border" style={{ color: '#8000ff' }} role="status"></div>
                                </div>
                            )}
                            {isOwnProfile && (
                                <label className="edit-picture-btn">
                                    <FiCamera />
                                    <input type="file" accept="image/*" hidden onChange={handleProfilePicChange} />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* INFO */}
                    <div className="profile-info">
                        <div className="text-center line-height text-capitalize">
                            <h1 className="profile-name">{fullName || 'User'}</h1>
                            {username || email ? <p className="profile-username">{username || email}</p> : null}
                        </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    {user && (
                        <div className="profile-actions" style={{ minWidth: "200px" }}>
                            {isOwnProfile ? (
                                <div>
                                    <button className="edit-profile-btn" onClick={toggleUserProfileUpdateModal}>
                                        <FiEdit />
                                        <span>Edit Profile</span>
                                    </button>

                                </div>
                            ) : (
                                <div className="d-flex justify-content-center align-items-center gap-2">
                                    <FollowButton following={ProfileData && ProfileData.is_following} profile={true} userId={profileId} />
                                    <StartChatButton
                                        recipientId={profileId}
                                        onChatStarted={(chatData) => {
                                            if (chatData.users[0].meta_data.user_id) {
                                                navigate(`/chat/${chatData.users[0].meta_data.user_id}`);
                                            }
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* CROP MODAL */}
                {cropModalOpen && (
                    <div className="crop-modal">
                        <div className="crop-container">
                            <div className="cropper-wrapper">
                                <Cropper
                                    image={selectedCover}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={3 / 1}
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onCropComplete={onCropComplete}
                                />
                            </div>
                            <div className="crop-actions">
                                <button type="button" onClick={() => setCropModalOpen(false)}>Cancel</button>
                                <button
                                    type="button"
                                    onClick={() => uploadCoverPhoto(selectedCover, croppedAreaPixels)}
                                    disabled={coverUploading}
                                    style={{ background: '#8000ff', color: '#fff' }}
                                >
                                    {coverUploading ? "Uploading..." : "Save"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <EditProfileModal isOpen={isModalOpen} onClose={toggleUserProfileUpdateModal} />
            </div>
            <ProfilePage />
        </>
    );
}

export default ProfileHeader;
