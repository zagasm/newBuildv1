import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SessioncodeVerification } from "../CodeVerification";
import axios from "axios";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { showToast } from "../../../../component/ToastAlert";

export function SessionforgetPassword({ toSignin, closeModal }) {
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
    params.append('contact', isPhone ? '+' + contact : contact);

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
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };
  return (
    <>
      {!showCodeVerification ? (
        <motion.form
          autoComplete="off"
          // className="bg-danger"
          onSubmit={handleSubmit}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="pr-4 pl-4 pb-5 signup-for mt-3"
        >

          <div className="row">
            <span htmlFor="">{isPhone ? 'Enter your Phone number' : 'Enter your email addess'}</span>
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="form-group col-12 m-0"
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
                      height: '55px'
                    }}
                    className="mb-2"
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
                    <i className="feather-mail position-absolute input-icon "></i>
                  </>
                )}
              </div>
            </motion.div>

            <div className="mb-4 mt-2 text-right">
              <button
                type="button"
                style={{ color: "#8000FF" }}
                className="btn btn-link p-0"
                onClick={toggleContactMethod}
              >
                Use {isPhone ? 'email' : 'phone'} instead
              </button>
            </div>

            <div className="row signup-form">
              <div className="col-6">
                <motion.button
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  className="bt submit_button btn-block btn-sm mb-3 font-weight-light"
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
                    "Request code"
                  )}
                </motion.button>
              </div>
              <div className="col-6">
                <button
                  type="button"
                  style={{ background: 'rgba(230, 230, 230, 1)', padding: '10px' }} className="btn btn-block btn-sm submit_button font-weight-bold text-dark btn-s "
                  onClick={() => closeModal()}>
                  cancel
                </button>
              </div>
            </div>

            <span style={{ fontSize: '13px', cursor: 'pointer',color:'rgba(143, 7, 231, 1)' }} className=" text-center mt-4">
              <span className="fas fa-arrow-left ml-2"></span>{" "}
              <span onClick={() => toSignin()} className="font-weight-bold" >
                Back to login
              </span>
            </span>
          </div>
        </motion.form>
      ) : (
        <SessioncodeVerification toSignin={toSignin} closeModal={closeModal} userId={userId} contact={contact} isPhone={isPhone} setShowCodeVerification={setShowCodeVerification} />
      )}
    </>
  );
}