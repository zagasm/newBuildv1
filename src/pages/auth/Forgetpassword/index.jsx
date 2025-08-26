import React, { useState } from "react";
import { Link } from "react-router-dom";
import { showToast } from "../../../component/ToastAlert";
import AuthContainer from "../assets/auth_container";
import { motion } from "framer-motion";
import { CodeVerification } from "../CodeVerification";
import axios from "axios";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

export function ForgetPassword() {
  const [contact, setContact] = useState("");
  const [userId, setuserId] = useState("");
  const [isPhone, setIsPhone] = useState(false);
  const [resetCode, setResetCode] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCodeVerification, setShowCodeVerification] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!contact.trim()) {
      showToast.error(`Please enter a valid ${isPhone ? 'phone number' : 'email address'}`);
      return;
    }
    setIsSubmitting(true);

    // Prepare the data in x-www-form-urlencoded format
    const params = new URLSearchParams();
    params.append('contact', isPhone ? '+'+contact : contact);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/users/forgotten-password`,
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        }
      );
      
      const data = response.data;
      console.log(data);
      
      if (data.status) {
        showToast.success(data.message || "Reset code sent successfully!");
        setuserId(data.user_id);
        setShowCodeVerification(true);
        setResetCode(data.user.reset_key);
      } else {
        showToast.error(data.message || "Something went wrong.");
      }
    } catch (err) {
      console.log(err);
      if (err.response) {
        const status = err.response.status;
        const message = err.response.data?.message || 
          "An error occurred. Please try again.";

        if (status === 401) {
          showToast.error(message || "Invalid contact or not registered on the platform.");
        } else if (status === 422) {
          const errors = err.response.data?.errors;
          if (errors?.contact) {
            showToast.error(errors.contact[0]);
          } else {
            showToast.error(message);
          }
        } else {
          showToast.error(message);
        }
      } else if (err.request) {
        showToast.error("Network error. Please check your connection.");
      } else {
        // showToast.error("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleContactMethod = () => {
    setContact("");
    setIsPhone(!isPhone);
  };

  return (
    <>
      {!showCodeVerification ? (
        <AuthContainer
          title={"Forgot password?"}
          description={`Enter your ${isPhone ? 'phone number' : 'email address'} to receive a reset code`}
        >
          <motion.form
            autoComplete="off"
            className="pr-3 pl-3"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="form-group"
            >
              <div className="position-relative icon-form-control">
                {isPhone ? (
                  <PhoneInput
                    country={'ng'}
                    value={contact}
                    onChange={setContact}
                    inputStyle={{
                      width: '100%',
                      paddingLeft: '48px',
                      height: '40px'
                    }}
                  />
                ) : (
                  <>
                    <input
                      type="email"
                      className="form-control input"
                      placeholder="Email Address"
                      style={{ paddingLeft: "60px", outline: "none" }}
                      autoComplete="off"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                    />
                    <i className="feather-mail position-absolute input-icon"></i>
                  </>
                )}
              </div>
            </motion.div>

            <div className="mb-3 text-right">
              <button 
                type="button" 
                className="btn btn-link p-0"
                onClick={toggleContactMethod}
              >
                Use {isPhone ? 'email' : 'phone'} instead
              </button>
            </div>

            <motion.button
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="bt submit_button btn-block mb-5"
              type="submit"
              style={{ color: "white" }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                  Sending...
                </>
              ) : (
                "Send Reset Code"
              )}
            </motion.button>

            <div className="py-3 text-center auth-foote">
              <span className="text-center">
                <span className="fas fa-arrow-left ml-2"></span>{" "}
                <Link className="font-weight-bold" to="/auth/signin">
                  Back to login
                </Link>
              </span>
            </div>
          </motion.form>
        </AuthContainer>
      ) : (
        <CodeVerification userId={userId} contact={contact} isPhone={isPhone} setShowCodeVerification={setShowCodeVerification}  />
      )}
    </>
  );
}