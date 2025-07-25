import React, { useRef, useState } from "react";
import {
  FaCalendarAlt,
  FaChevronDown,
  FaMars,
  FaVenus,
  FaGenderless,
} from "react-icons/fa";
import { motion } from "framer-motion";
import PostSignupFormModal from "./ModalContainer";
import SignUpCodecomponent from "./SignUpCodecomponent";
import "./postSignupStyle.css";
import { useAuth } from "../../../../pages/auth/AuthContext";
import axios from "axios";

const PostSignupForm = () => {
  const { user, isAuthenticated } = useAuth();
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [tosendUserdata, settosendUserdata] = useState();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dateInputRef = useRef(null);

  // Return null if user is not authenticated or doesn't exist
  if (!isAuthenticated || !user?.user) {
    return null;
  }

  // Return null if user already has gender set
  if (user.user.gender) {
    return null;
  }

  const handleWrapperClick = () => {
    if (dateInputRef.current?.showPicker) {
      dateInputRef.current.showPicker();
    } else {
      dateInputRef.current?.focus();
    }
  };

  const isFormValid = dob && gender;
  
  const isAtLeast15 = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      return age - 1 >= 15;
    }

    return age >= 15;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) return;
    if (!isAtLeast15(dob)) {
      alert("You must be at least 15 years old to use this platform.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/v1/users/update/${user.user.id}`,
        {
          gender: gender,
          date_of_birth: dob,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      
      const result = response.data;
      if (result.status === true) {
        settosendUserdata(result.data);
        setFormSubmitted(true);
      } else {
        console.error("Update failed:", result.message, result.errors || result);
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "An error occurred while updating.";
      const errors = error.response?.data?.errors;
      console.error("Update failed:", message, errors || error.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  if (formSubmitted) {
    return <SignUpCodecomponent token={user.token} userupdate={tosendUserdata} type="phone" />;
  }

  return (
    <PostSignupFormModal>
      <motion.div
        className="container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          Complete your Profile
        </motion.h2>
        <p>Just a few more details to completing your profile</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="p-0 m-0 mb-2">Date of Birth</label>
            <motion.div
              className="dob-wrapper"
              onClick={handleWrapperClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaCalendarAlt className="left-icon" />
              <input
                type="date"
                name="dob"
                id="dob"
                className="dob-input border-0"
                ref={dateInputRef}
                value={dob}
                max={new Date(
                  new Date().setFullYear(new Date().getFullYear() - 15)
                ).toISOString().split("T")[0]}
                onChange={(e) => setDob(e.target.value)}
              />
              <FaChevronDown className="right-icon" />
            </motion.div>
          </div>

          <div className="form-group">
            <label className="m-0 mb-2">Gender</label>
            <div className="gender-buttons">
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                className={`gender-btn ${gender === "male" ? "selected" : ""}`}
                onClick={() => setGender("male")}
              >
                <FaMars size={20} />
                Male
              </motion.button>

              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                className={`gender-btn ${gender === "female" ? "selected" : ""}`}
                onClick={() => setGender("female")}
              >
                <FaVenus size={20} />
                Female
              </motion.button>

              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                className={`gender-btn ${gender === "others" ? "selected" : ""}`}
                onClick={() => setGender("others")}
              >
                <FaGenderless size={20} />
                Others
              </motion.button>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={!isFormValid || isLoading}
            whileHover={isFormValid ? { scale: 1.02 } : {}}
            className="submit-btn"
            style={{
              backgroundColor: isFormValid
                ? "rgba(143, 7, 231, 1)"
                : "rgba(230, 230, 230, 1)",
              color: isFormValid ? "#fff" : "#999",
              cursor: isFormValid ? "pointer" : "not-allowed",
              marginTop: 20,
              padding: "10px 20px",
              border: "none",
              borderRadius: "6px",
              width: "100%",
            }}
          >
            {isLoading ? (
              <div className="loader">
                <div className="loader-spinner"></div>
              </div>
            ) : (
              "Complete Profile"
            )}
          </motion.button>
        </form>
      </motion.div>
    </PostSignupFormModal>
  );
};

export default PostSignupForm;