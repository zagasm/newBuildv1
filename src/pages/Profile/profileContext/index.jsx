import React, { createContext, useContext, useState, useEffect } from "react";
import { showToast } from "../../../component/ToastAlert";
import { useAuth } from "../../auth/AuthContext";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [message, setMessage] = useState(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [ProfileData, setProfileData] = useState(null);

  const { user_id, token, login } = useAuth();

  const fetchProfileById = async (profileId) => {
    setIsProfileLoading(true);
    setMessage(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/users/profile/${profileId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data?.user) {
        setProfileData(data.user);
        // const user = data.user;
        // console.log('Fetched profile data:', user);
        
        return data.user;
      } else {
        throw new Error("No profile data found");
      }
    } catch (error) {
      const errMsg = error.message || "Failed to load profile";
      setMessage({ type: "error", message: errMsg });
      // showToast.error(errMsg);
      return null;
    } finally {
      setIsProfileLoading(false);
    }
  };

  // Load the logged-in user's profile automatically
  useEffect(() => {
    if (user_id && token) {
      fetchProfileById(user_id);
    }
  }, [user_id, token]);
  const updateProfileData = (newData) => {
    setProfileData(prev => ({ ...prev, ...newData }));
  };
  return (
    <ProfileContext.Provider
      value={{
        ProfileData,
        fetchProfileById,
        isProfileLoading,
        message,
         updateProfileData 
        // const user = data.user;

      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
