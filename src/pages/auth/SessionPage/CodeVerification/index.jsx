import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChangePassword } from "../ChangePassword";
import axios from "axios";
import { motion } from "framer-motion";
import { showToast } from "../../../../component/ToastAlert";
export function SessioncodeVerification({ toSignin, userId, contact, closeModal, isPhone, setShowCodeVerification }) {
  const CODE_LENGTH = 5;
  const [code, setCode] = useState(Array(CODE_LENGTH).fill(""));
  const [isVerified, setIsVerified] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(60 * 10); // 60 seconds = 1 minute
  const [canResend, setCanResend] = useState(false);
  const [userIdPassword, setUserIdPassword] = useState('');
  const inputsRef = useRef([]);
  // Timer countdown effect
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer <= 1) {
            setCanResend(true);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);
  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  // Mask contact information
  const maskContact = (contact) => {
    if (!contact) return "";

    if (isPhone) {
      // Mask phone number (show last 4 digits)
      return `*******${contact.slice(-4)}`;
    } else {
      // Mask email
      const [username, domain] = contact.split("@");
      if (!username || !domain) return contact; // Fallback if invalid email
      if (username.length <= 2) return contact;
      const visiblePart = username.slice(0, 2);
      const maskedPart = "*".repeat(username.length - 2);
      return `${visiblePart}${maskedPart}@${domain}`;
    }
  };
  // Handle resend code
  const handleResendCode = async () => {
    if (!canResend) return;
    setIsResending(true);
    setError("");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/users/resend-verification`,
        {
          contact: isPhone ? '+' + contact : contact,
          type: isPhone ? "phone_verification" : "email_verification"
        },
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      );

      const result = response.data;
      if (result.status === true) {
        showToast.success("Verification code resent successfully!");
        setTimer(60); // Reset timer to 1 minute
        setCanResend(false);
      } else {
        setError(result.message || "Failed to resend verification code.");
      }
    } catch (error) {
      console.error("Error resending code:", error);
      const message = error.response?.data?.message || "Failed to resend verification code. Please try again.";
      setError(message);
    } finally {
      setIsResending(false);
    }
  };
  // Handle input change
  const handleChange = (e, idx) => {
    const val = e.target.value;
    if (/^\d?$/.test(val)) {
      const newCode = [...code];
      newCode[idx] = val;
      setCode(newCode);
      if (val && idx < CODE_LENGTH - 1) {
        inputsRef.current[idx + 1].focus();
      }
    }
  };
  // Handle keyboard navigation
  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !code[idx] && idx > 0) {
      inputsRef.current[idx - 1].focus();
    } else if (e.key === "ArrowLeft" && idx > 0) {
      inputsRef.current[idx - 1].focus();
    } else if (e.key === "ArrowRight" && idx < CODE_LENGTH - 1) {
      inputsRef.current[idx + 1].focus();
    }
  };
  const verifyCode = async () => {
    const joinedCode = code.join("");
    if (joinedCode.length < CODE_LENGTH) {
      setError(`Please enter the full ${CODE_LENGTH}-digit code.`);
      return;
    }
    setError("");
    // console.log(userId)
    setIsVerifying(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/users/otp-verification/${userId}`,
        {
          otp: joinedCode,
          type: "password_reset"
        },
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      );

      const data = response.data;
      console.log(data);
      if (data.status === true) {
        setSuccessMessage(data.message || "OTP verified successfully!");
        setSuccess(true);
        // Store user ID for password reset if needed
        setUserIdPassword(data.user_id);
        localStorage.setItem("password_reset_user_id", data.user_id);
        setTimeout(() => setIsVerified(true), 1000);
      } else {
        setError(data.message || "Incorrect verification code. Please try again.");
      }
    } catch (err) {
      console.log(err);
      if (err.response) {
        const status = err.response.status;
        const errorData = err.response.data;

        // Handle different error cases
        if (status === 401) {
          setError(errorData.message || "Invalid or expired verification code.");
        } else if (status === 422) {
          // Handle validation errors
          if (errorData.errors?.otp) {
            setError(errorData.errors.otp[0]);
          } else {
            setError(errorData.message || "Validation failed. Please check your input.");
          }
        } else {
          setError(errorData.message || "An error occurred. Please try again.");
        }
      } else if (err.request) {
        // The request was made but no response was received
        setError("Network error. Please check your internet connection.");
      } else {
        // Something happened in setting up the request
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsVerifying(false);
    }
  };
  return (
    <>
      {!isVerified ? (
        <>
          <p className="text-center ml-4" style={{ fontSize: "15px", fontFamily: "Inter" }}>
            <span>A 5 digit code has been sent to: <br /> </span><span style={{ color: "#8000FF" }}> {maskContact(contact)}</span>
          </p>
          <form autoComplete="off" className="" onSubmit={(e) => e.preventDefault()}>
            <div className="code_container row  mt-0 justify-content-center">
              {code.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  ref={(el) => (inputsRef.current[idx] = el)}
                  className="code col card m-1 text-center"
                  style={{
                    width: "50px",
                    height: "50px",
                    fontSize: "24px",
                    textAlign: "center",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                  }}
                />
              ))}
            </div>

            {error && (
              <div className="text-danger text-center mb-3" style={{ fontSize: "14px" }}>
                <i className="fa fa-exclamation-circle mr-1"></i> {error}
              </div>
            )}

            {/* {success && (
              <div className="text-success text-center mb-3" style={{ fontSize: "14px" }}>
                <i className="fa fa-check-circle mr-1"></i> Code verified successfully! Redirecting...
              </div>
            )} */}

            <div className="resend_code_container mb-3">
              <button
                type="button"
                className={`resend_code ${canResend ? 'active' : ''}`}
                onClick={handleResendCode}
                disabled={!canResend || isResending}
                style={{
                  background: 'none',
                  border: 'none',
                  color: canResend ? '#8000FF' : '#999',
                  textDecoration: canResend ? 'underline' : 'none',
                  cursor: canResend ? 'pointer' : 'default',
                  padding: 0,
                }}
              >
                {isResending ? 'Sending...' : 'Resend Code'}
              </button>
              {!canResend && (
                <span className="ml-2">Code expires in <span className="code_timer">{formatTime(timer)}</span></span>
              )}
            </div>
            {/* <input type="text" className="form-control" /> */}
            <div className="signup-for">
              <div className="row w-100  signup-form  " style={{ padding: '0px', margin: '0px', }}>

                <div className="col-6 ">
                  <motion.button
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    type="button"
                    className="bt submit_button  btn-block w-100 m-0 float-left "
                    style={{ color: "white", margin: '0px' }}
                    onClick={verifyCode}
                    disabled={isVerifying} >
                    {isVerifying ? (
                      <>
                        <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                        Verifying...
                      </>
                    ) : (
                      <>
                        {/* <span className="fas fa-sign-in-alt "></span> */}
                        Confirm OTP
                      </>
                    )}
                  </motion.button>
                </div>
                <div className="col-6">
                  <button

                    type="button"
                    style={{ background: 'rgba(230, 230, 230, 1)' }} className=" btn btn-block submit_button font-weight-bold text-dark  w-100 m-0 float-right"
                    onClick={() => closeModal()}>
                    cancel
                  </button>
                </div>

              </div>
            </div>
            <div className="text-center mt-3 border-botto pb-1 mb-1">
              <span style={{ fontSize: '13px', cursor: 'pointer', color: 'rgba(143, 7, 231, 1)' }} onClick={() => setShowCodeVerification()} className="small ">
                <span className="fas fa-arrow-left ml-2"></span>{" "}
                <span className="font-weight-bold" to="/auth/signup">
                  Go  back
                </span>
              </span>
            </div>

            {!isPhone && (
              <div className="py-3 text-center auth-foote">
                <span className="text-info" style={{ fontSize: "13px" }}>
                  <i className="fa fa-exclamation-circle"></i> Check your spam folder if you don't see the email
                </span>
              </div>
            )}
          </form>
        </>
      ) : (
        <ChangePassword toSignin={toSignin} userIdPassword={userIdPassword} setIsVerified={setIsVerified} closeModal={closeModal} />
      )}
    </>
  );
}