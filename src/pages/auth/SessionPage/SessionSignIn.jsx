import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { showToast } from "../../../component/ToastAlert";
import AuthContainer from "../assets/auth_container";
import { motion } from "framer-motion";
import googleLogo from "../../../assets/google-logo.png";
import axios from "axios";
import { SessionforgetPassword } from "./Forgetpassword";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { isValidPhoneNumber } from 'react-phone-input-2';
export function ModalSignin({ modal, closeModal }) {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [forgetPassword, setforgetPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState("email"); // "email" or "phone"
  const [formData, setFormData] = useState({
    loginInput: "",
    phoneInput: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };

  const inputVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handlePhoneChange = (value, country) => {
    setFormData((prev) => ({ ...prev, phoneInput: value }));
    if (errors.phoneInput) setErrors((prev) => ({ ...prev, phoneInput: null }));
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const validateForm = () => {
    const newErrors = {};

    if (loginMethod === "email") {
      if (!formData.loginInput.trim()) newErrors.loginInput = "Email or username is required";
    } else {
      if (!formData.phoneInput.trim()) {
        newErrors.phoneInput = "Phone number is required";
      } else {
        const phoneNumber = parsePhoneNumberFromString("+" + formData.phoneInput);
        if (!phoneNumber || !phoneNumber.isValid()) {
          newErrors.phoneInput = "Please enter a valid phone number";
        }
      }
    }

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      let loginValue = "";
      let loginType = "";

      if (loginMethod === "email") {
        loginValue = formData.loginInput;
        loginType = detectLoginType(loginValue);
        if (loginType === 'unknown') {
          showToast.error("Please enter a valid email or username");
          setIsLoading(false);
          return;
        }
      } else {
        // For phone, we'll use the formatted value from react-phone-input-2
        loginValue = '+' + formData.phoneInput;
        loginType = "phone";
      }
      //  console.log(formData.phoneInput);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/users/login`,
        {
          login: loginValue,
          password: formData.password,
        },
        {
          headers: { "Content-Type": "application/json" }
        }
      );

      const { status, message, data, errors: serverErrors } = response.data;
      if (status === true) {
        const { token, user } = data;
        console.log(user);
        if (token) {
          login({ token, user }, rememberMe);
          closeModal();
        }
        showToast.success(message || "Login successful!");
      } else {
        const fieldErrors = {};
        if (serverErrors && typeof serverErrors === "object") {
          if (serverErrors.login) {
            if (loginMethod === "email") {
              fieldErrors.loginInput = serverErrors.login[0];
            } else {
              fieldErrors.phoneInput = serverErrors.login[0];
            }
          }
          if (serverErrors.password) fieldErrors.password = serverErrors.password[0];
        }
        setErrors({ ...fieldErrors, server: message || "Invalid credentials." });
        showToast.error(message || "Invalid credentials.");
      }
    } catch (err) {
      const message = err.response?.data?.message || "An error occurred. Please try again.";
      const serverErrors = err.response?.data?.errors;
      const fieldErrors = {};
      if (serverErrors && typeof serverErrors === "object") {
        if (serverErrors.login) {
          if (loginMethod === "email") {
            fieldErrors.loginInput = serverErrors.login[0];
          } else {
            fieldErrors.phoneInput = serverErrors.login[0];
          }
        }
        if (serverErrors.password) fieldErrors.password = serverErrors.password[0];
      }
      setErrors({ ...fieldErrors, server: message });
      showToast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to detect login type (email or username)
  const detectLoginType = (input) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(input)) {
      return "email";
    } else {
      return "username";
    }
  };

  return (
    <div>
      {!forgetPassword ? (
        <motion.form
          onSubmit={handleSubmit}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="pr-4 pl-4 pb-5 signup-form"
        >
          <h6 className="pb-3">Login</h6>
          {errors.server && (
            <motion.div
              className="alert alert-danger m-0 mt-3 p-1 pl-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {errors.server}
            </motion.div>
          )}
          <div className="row">
            {/* Login method selector */}
            <motion.div variants={inputVariants} className="form-group col-12 mb-3">
              <div className="btn-group w-100 p-1 gap-3" role="group" style={{ borderRadius: '40px', boxShadow: 'box-shadow: 0px 18px 7px 0px rgba(140, 140, 140, 0);', background: 'rgba(243, 243, 243, 0.65)' }}>
                <button
                  type="button"
                  style={{
                    width: "50%",
                    borderRadius: '40px',
                    border: "none",
                    backgroundColor: loginMethod === "email"
                      ? "rgba(143, 7, 231, 1)"
                      : "white",
                    color: loginMethod === "email"
                      ? "white"
                      : "rgba(143, 7, 231, 1)"
                  }}
                  className={`btn`}
                  onClick={() => setLoginMethod("email")} >
                  Email / Username
                </button>
                <button
                  type="button"
                  style={{
                    width: "50%",

                    borderRadius: '40px',
                    border: "none",
                    backgroundColor: loginMethod === "phone"
                      ? "rgba(143, 7, 231, 1)"
                      : "white",
                    color: loginMethod === "phone"
                      ? "white"
                      : "rgba(143, 7, 231, 1)"
                  }}
                  className={`btn`}
                  onClick={() => setLoginMethod("phone")}
                >
                  Phone
                </button>
              </div>
            </motion.div>

            {/* Username/Email Input */}
            {loginMethod === "email" && (
              <motion.div variants={inputVariants} className="form-group col-12">
                <span>Email Address or Username</span>
                <div className="position-relative icon-form-control">
                  <input
                    type="text"
                    name="loginInput"
                    className={`form-control input ${errors.loginInput ? 'is-invalid' : ''}`}
                    placeholder="Email or username"
                    value={formData.loginInput}
                    onChange={handleChange}
                  />
                  {errors.loginInput && (
                    <div className="invalid-feedback d-block mb-4">{errors.loginInput}</div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Phone Input */}
            {loginMethod === "phone" && (
              <motion.div variants={inputVariants} className="form-group col-12">
                <span>Phone Number</span>
                <div className="position-relative input_bo">
                  <PhoneInput
                    country={'us'}
                    value={formData.phoneInput}
                    onChange={handlePhoneChange}
                    inputClass={`form-control input custom-phone-input ${errors.phoneInput ? 'is-invalid' : ''}`}
                    containerClass="phone-input-container"

                    inputProps={{
                      name: 'phoneInput',
                      required: true,
                    }}
                    inputStyle={{
                      width: "100%",
                      paddingLeft: "60px",
                      outline: "none"
                    }}
                  />
                  {errors.phoneInput && (
                    <div className="invalid-feedback d-block">{errors.phoneInput}</div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Password */}
            <motion.div variants={inputVariants} className="form-group col-12">
              <span>Password</span>
              <div className="position-relative icon-form-control">
                <i className="feather-lock position-absolute input-icon"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className={`form-control input ${errors.password ? 'is-invalid' : ''}`}
                  style={{ paddingLeft: "60px", paddingRight: "40px", width: '100%' }}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <i
                  className={`position-absolute input-icon ${showPassword ? "feather-eye" : "feather-eye-off"}`}
                  style={{ right: "15px", cursor: "pointer", color: '#666' }}
                  onClick={() => setShowPassword(!showPassword)}
                />
              </div>
              {errors.password && (
                <div className="invalid-feedback d-block m-0 p-0">{errors.password}</div>
              )}
            </motion.div>

            <div className="d-flex justify-content-end">
              <span
                onClick={() => setforgetPassword(true)}
                style={{ color: 'rgb(143, 7, 231)', cursor: 'pointer' }}
              >
                Forget password
              </span>
            </div>

            <motion.div
              variants={inputVariants}
              className="form-group m mb-3"
            >
              <div className="d-flex align-items-center">
                <label className="custom-checkbox" style={{ cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={handleRememberMeChange}
                    style={{ display: 'none' }}
                  />
                  <span
                    className="checkmark"
                    style={{
                      display: 'inline-block',
                      width: '18px',
                      height: '18px',
                      backgroundColor: rememberMe ? '#8000FF' : 'white',
                      border: `2px solid ${rememberMe ? '#8000FF' : '#ddd'}`,
                      borderRadius: '4px',
                      marginRight: '10px',
                      position: 'relative',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {rememberMe && (
                      <svg
                        viewBox="0 0 24 24"
                        width="14"
                        height="14"
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          fill: 'white'
                        }}
                      >
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    )}
                  </span>
                  <span style={{
                    color: '#555',
                    fontSize: '15px',
                    userSelect: 'none',
                  }}>
                    Keep me logged in
                  </span>
                </label>
              </div>
            </motion.div>

            {/* Submit */}
            <div className="col-6 p-0 m-0">
              <motion.button
                variants={inputVariants}
                type="submit"
                className="bt submit_button btn-block"
                disabled={
                  isLoading ||
                  (loginMethod === "email" && formData.loginInput.trim() === "") ||
                  (loginMethod === "phone" && formData.phoneInput.trim() === "") ||
                  formData.password.trim() === ""
                }
                style={{
                  color:
                    (loginMethod === "email" && formData.loginInput.trim() === "") ||
                      (loginMethod === "phone" && formData.phoneInput.trim() === "") ||
                      formData.password.trim() === ""
                      ? 'rgba(153, 153, 153, 1)'
                      : 'white',
                  backgroundColor:
                    (loginMethod === "email" && formData.loginInput.trim() === "") ||
                      (loginMethod === "phone" && formData.phoneInput.trim() === "") ||
                      formData.password.trim() === ""
                      ? 'rgba(230, 230, 230, 1)'
                      : 'rgba(143, 7, 231, 1)'
                }}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm mr-2"></span>
                    Signing in...
                  </>
                ) : (
                  "Login"
                )}
              </motion.button>
            </div>
            <div className="col-6">
              <motion.button
                style={{ background: 'rgba(230, 230, 230, 1)' }}
                className="btn btn-block submit_button font-weight-bold"
                type="button"
                onClick={() => closeModal()}
              >
                Cancel
              </motion.button>
            </div>
          </div>
        </motion.form>
      ) : (
        <SessionforgetPassword toSignin={() => setforgetPassword(false)} closeModal={closeModal} />
      )}
    </div>
  );
}