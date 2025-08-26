import { useState } from "react";
import axios from "axios";
// import { getCroppedImg } from "../components/profilePage/cropImage";
// import { showToast } from "../component/ToastAlert";
// import { useAuth } from "../components/auth/AuthContext";
// import { useProfile } from "../components/profilePage/profileContext";
import { getCroppedImg } from "./cropImage";
import { showToast } from "../../../component/ToastAlert";
import { useAuth } from "../../auth/AuthContext";
import { useProfile } from "../profileContext";

export function useProfileImageUpload() {
  const { token, login, user } = useAuth();
  const { updateProfileData } = useProfile();

  const [profileUploading, setProfileUploading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);

  // Upload profile picture (no crop)
  const uploadProfilePicture = async (file) => {
    if (!file) return;
    setProfileUploading(true);
    try {
      const formData = new FormData();
      formData.append("profile_picture", file);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/users/update-profile-images`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      if (res.data.status) {
        const updatedUser = res.data.data;
        login({ token, user: updatedUser }, true);
        showToast.success(res.data.message || "Profile picture updated successfully!");
      }
    } catch {
      showToast.error("Failed to update profile picture");
    } finally {
      setProfileUploading(false);
    }
  };

  // Upload cropped cover photo
  const uploadCoverPhoto = async (imageSrc, croppedAreaPixels) => {
    if (!croppedAreaPixels) {
      showToast.error("Please crop your image before saving.");
      return;
    }
    setCoverUploading(true);
    try {
      const croppedImageUrl = await getCroppedImg(imageSrc, croppedAreaPixels);
      const blob = await fetch(croppedImageUrl).then(r => r.blob());

      const formData = new FormData();
      formData.append("cover_photo", blob, "cover.jpg");

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/users/update-profile-images`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      if (res.data.status) {
        const updatedUser = res.data.data;
        login({ token, user: updatedUser }, true);
        updateProfileData({
          ...updatedUser,
          meta_data: {
            ...updatedUser.meta_data,
            cover_photo: `${updatedUser.meta_data.cover_photo}?t=${Date.now()}`
          }
        });
        showToast.success(res.data.message || "Cover photo updated successfully!");
      }
    } catch {
      showToast.error("Failed to update cover photo");
    } finally {
      setCoverUploading(false);
    }
  };

  return {
    profileUploading,
    coverUploading,
    uploadProfilePicture,
    uploadCoverPhoto
  };
}
