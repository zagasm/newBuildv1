import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaEnvelope } from "react-icons/fa";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import PostSignupFormModal from "./ModalContainer";
import SignUpCodecomponent from "./SignUpCodecomponent";
import "./postSignupStyle.css";
import { useAuth } from "../../../../pages/auth/AuthContext";
import Alert from "react-bootstrap/Alert";
import axios from "axios";

const PhoneEmailPostSignup = ({ type, userupdate }) => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [proceed, setProceed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { login, token } = useAuth();

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isFormValid =
    (type === "email" && isValidEmail(email)) ||
    (type === "phone" && phone.length >= 8);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Skip if the value hasn't changed
    if (type === "email" && email === userupdate.email) {
      setProceed(true);
      return;
    }
    if (type === "phone" && phone === userupdate.phone) {
      setProceed(true);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/v1/users/update/${userupdate.id}`,
        type === "email" ? { email } : { phone },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = response.data;
      if (result.status === true) {
        setProceed(true);
      } else {
        setErrorMessage(result.message || "Update failed.");
      }
    } catch (error) {
      let errorMsg = "An error occurred while updating.";
      const backendErrors = error.response?.data?.errors;

      if (backendErrors) {
        // Handle both email and phone errors
        if (backendErrors.email) {
          errorMsg = backendErrors.email[0];
        } else if (backendErrors.phone) {
          errorMsg = backendErrors.phone[0];
        } else if (error.response?.data?.message) {
          errorMsg = error.response.data.message;
        }
      }

      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (proceed) {
    return <SignUpCodecomponent userupdate={userupdate} type={type} />;
  }

  function skipProcess() {
    const user = userupdate;
    login({ token, user });
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
          Enter your {type === "email" ? "Email" : "Phone Number"}
        </motion.h2>
        <p>Enter your {type === "email" ? "email address" : "phone number"} to verify.</p>

        {/* Error Message Alert */}
        {errorMessage && (
          <Alert variant="danger" onClose={() => setErrorMessage(null)} dismissible>
            {errorMessage}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {type === "email" ? (
            <div className="form-group">
              <label className="m-0 mb-2">Email</label>
              <div className="email-wrapper">
                <FaEnvelope className="left-icon" />
                <input
                  type="email"
                  className="email-input border-0"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
          ) : (
            <div className="form-group">
              <label className="mb-2">Phone Number</label>
              <PhoneInput
                country={"ng"}
                value={phone}
                onChange={(value, country, e, formattedValue) => {
                  setPhone(formattedValue || value);
                }}
                inputStyle={{
                  width: "100%",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  paddingLeft: "48px",
                  height: "40px",
                }}
                containerStyle={{ width: "100%" }}
                specialLabel=""
              />
            </div>
          )}
          <div className="d-flex">
            <motion.button
              className="skip-btn"
              type="button"
              onClick={skipProcess}
              style={{
                background: "none",
                border: "none",
                color: "rgba(143, 7, 231, 1)",
                marginTop: "15px",
                fontSize: "16px",
                textDecoration: "underline",
                width: "100%",
              }}
            >
              Skip for now
            </motion.button>
            <motion.button
              type="submit"
              disabled={!isFormValid || isLoading}
              whileHover={isFormValid && !isLoading ? { scale: 1.02 } : {}}
              className="submit-btn"
              style={{
                backgroundColor: isFormValid ? "rgba(143, 7, 231, 1)" : "#e6e6e6",
                color: isFormValid ? "#fff" : "#999",
                marginTop: 20,
                padding: "10px 20px",
                border: "none",
                borderRadius: "6px",
                width: "100%",
                cursor: isFormValid && !isLoading ? "pointer" : "not-allowed",
              }}
            >
              {isLoading ? (
                <div className="loader m-0 m-auto p-0">
                  <div className="loader-spinner p-0 m-0"></div>
                </div>
              ) : (
                "Next"
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </PostSignupFormModal>
  );
};

export default PhoneEmailPostSignup;