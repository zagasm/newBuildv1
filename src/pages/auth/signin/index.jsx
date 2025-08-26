import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { showToast } from "../../../component/ToastAlert";
import AuthContainer from "../assets/auth_container";
import { motion } from "framer-motion";
import googleLogo from "../../../assets/google-logo.png";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { parsePhoneNumberFromString } from "libphonenumber-js";

export function Signin({ modal }) {
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginMethod, setLoginMethod] = useState("email"); // "email" | "phone"

  const [formData, setFormData] = useState({
    loginInput: "",
    phoneInput: "",
    password: "",
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

    if (name === "loginInput" && value.trim() === "") {
      setShowPasswordField(false);
    }
  };

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({ ...prev, phoneInput: value }));
    if (errors.phoneInput) setErrors((prev) => ({ ...prev, phoneInput: null }));
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const validateForm = () => {
    const newErrors = {};

    if (loginMethod === "email") {
      if (!formData.loginInput.trim())
        newErrors.loginInput = "Email or username is required";
    } else {
      if (!formData.phoneInput.trim()) {
        newErrors.phoneInput = "Phone number is required";
      } else {
        const phoneNumber = parsePhoneNumberFromString(
          "+" + formData.phoneInput
        );
        if (!phoneNumber || !phoneNumber.isValid()) {
          newErrors.phoneInput = "Please enter a valid phone number";
        }
      }
    }

    if (!formData.password)
      newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const detectLoginType = (input) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(input)) {
      return "email";
    } else {
      return "username";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!showPasswordField) {
      if (
        (loginMethod === "email" && !formData.loginInput.trim()) ||
        (loginMethod === "phone" && !formData.phoneInput.trim())
      ) {
        setErrors({
          loginInput:
            loginMethod === "email"
              ? "Email or username is required"
              : "Phone number is required",
        });
        return;
      }
      setShowPasswordField(true);
      return;
    }

    if (!validateForm()) return;
    setIsLoading(true);

    try {
      let loginValue = "";
      if (loginMethod === "email") {
        loginValue = formData.loginInput;
        const loginType = detectLoginType(loginValue);
        if (loginType === "unknown") {
          showToast.error("Please enter a valid email or username");
          setIsLoading(false);
          return;
        }
      } else {
        loginValue = "+" + formData.phoneInput;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/users/login`,
        {
          login: loginValue,
          password: formData.password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const { status, message, data, errors: serverErrors } = response.data;
      if (status === true) {
        const { token, user } = data;
        if (token) {
          login({ token, user }, rememberMe);
          navigate("/");
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
          if (serverErrors.password)
            fieldErrors.password = serverErrors.password[0];
        }
        setErrors({ ...fieldErrors, server: message || "Invalid credentials." });
        showToast.error(message || "Invalid credentials.");
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "An error occurred. Please try again.";
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
        if (serverErrors.password)
          fieldErrors.password = serverErrors.password[0];
      }
      setErrors({ ...fieldErrors, server: message });
      showToast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer
      modal={modal}
      title="Enter your email address, username, or phone number to login your account"
    >
      <motion.form
        onSubmit={handleSubmit}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={modal ? "pb-5" : "pr-3 pl-3"}
      >
        {errors.server && (
          <motion.div
            className="alert alert-danger m-0 mt-3 p-1 pl-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {errors.server}
          </motion.div>
        )}

        {/* Login method selector */}
        <motion.div variants={inputVariants} className="form-group mb-3">
          <div className="btn-group w-100" role="group">
            <button
              type="button"
              style={{
                border:
                  loginMethod === "email"
                    ? "1px solid rgba(143, 7, 231, 1)"
                    : "none",
                backgroundColor:
                  loginMethod === "email"
                    ? "rgba(143, 7, 231, 1)"
                    : "rgba(230, 230, 230, 1)",
                color:
                  loginMethod === "email"
                    ? "white"
                    : "rgba(143, 7, 231, 1)",
              }}
              className="btn"
              onClick={() => setLoginMethod("email")}
            >
              Email/Username
            </button>
            <button
              type="button"
              style={{
                border:
                  loginMethod === "phone"
                    ? "1px solid rgba(143, 7, 231, 1)"
                    : "none",
                backgroundColor:
                  loginMethod === "phone"
                    ? "rgba(143, 7, 231, 1)"
                    : "rgba(230, 230, 230, 1)",
                color:
                  loginMethod === "phone"
                    ? "white"
                    : "rgba(143, 7, 231, 1)",
              }}
              className="btn"
              onClick={() => setLoginMethod("phone")}
            >
              Phone
            </button>
          </div>
        </motion.div>

        {/* Email/Username Input */}
        {loginMethod === "email" && (
          <motion.div variants={inputVariants} className="form-group">
            <span>Email Address or Username</span>
            <input
              type="text"
              name="loginInput"
              className={`form-control input ${
                errors.loginInput ? "is-invalid" : ""
              }`}
              placeholder="Email or username"
              value={formData.loginInput}
              onChange={handleChange}
            />
            {errors.loginInput && (
              <div className="invalid-feedback d-block">
                {errors.loginInput}
              </div>
            )}
          </motion.div>
        )}

        {/* Phone Input */}
        {loginMethod === "phone" && (
          <motion.div variants={inputVariants} className="form-group">
            <span>Phone Number</span>
            <PhoneInput
              country={"us"}
              value={formData.phoneInput}
              onChange={handlePhoneChange}
              inputClass={`form-control input ${
                errors.phoneInput ? "is-invalid" : ""
              }`}
              inputProps={{ name: "phoneInput", required: true }}
              inputStyle={{
                width: "100%",
                paddingLeft: "60px",
                outline: "none",
              }}
            />
            {errors.phoneInput && (
              <div className="invalid-feedback d-block">
                {errors.phoneInput}
              </div>
            )}
          </motion.div>
        )}

        {/* Password Field */}
        {showPasswordField && (
          <motion.div variants={inputVariants} className="form-group">
            <span>Password</span>
            <div className="position-relative icon-form-control">
              <i className="feather-lock position-absolute input-icon"></i>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className={`form-control input ${
                  errors.password ? "is-invalid" : ""
                }`}
                style={{ paddingLeft: "60px", paddingRight: "40px" }}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              <i
                className={`position-absolute input-icon ${
                  showPassword ? "feather-eye" : "feather-eye-off"
                }`}
                style={{
                  right: "15px",
                  cursor: "pointer",
                  color: "#666",
                }}
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
            {errors.password && (
              <div className="invalid-feedback d-block m-0 p-0">
                {errors.password}
              </div>
            )}
          </motion.div>
        )}

        {/* Remember Me */}
        {showPasswordField && (
          <motion.div variants={inputVariants} className="form-group mt-3">
            <div className="d-flex align-items-center">
              <label className="custom-checkbox" style={{ cursor: "pointer" }}>
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                  style={{ display: "none" }}
                />
                <span
                  className="checkmark"
                  style={{
                    display: "inline-block",
                    width: "18px",
                    height: "18px",
                    backgroundColor: rememberMe ? "#8000FF" : "white",
                    border: `2px solid ${rememberMe ? "#8000FF" : "#ddd"}`,
                    borderRadius: "4px",
                    marginRight: "10px",
                    position: "relative",
                    transition: "all 0.3s ease",
                  }}
                >
                  {rememberMe && (
                    <svg
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        fill: "white",
                      }}
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  )}
                </span>
                <span
                  style={{
                    color: "#555",
                    fontSize: "14px",
                    userSelect: "none",
                  }}
                >
                  Keep me logged in
                </span>
              </label>
            </div>
          </motion.div>
        )}

        {/* Forgot password */}
        <div className="text-right pb-3">
          <Link to="/auth/forget-password" style={{ color: "#8000FF" }}>
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <motion.button
          variants={inputVariants}
          type="submit"
          className="bt submit_button btn-block"
          disabled={
            isLoading ||
            (loginMethod === "email" && formData.loginInput.trim() === "") ||
            (loginMethod === "phone" && formData.phoneInput.trim() === "")
          }
          style={{
            color:
              (loginMethod === "email" && formData.loginInput.trim() === "") ||
              (loginMethod === "phone" && formData.phoneInput.trim() === "")
                ? "rgba(153, 153, 153, 1)"
                : "white",
            backgroundColor:
              (loginMethod === "email" && formData.loginInput.trim() === "") ||
              (loginMethod === "phone" && formData.phoneInput.trim() === "")
                ? "rgba(230, 230, 230, 1)"
                : "rgba(143, 7, 231, 1)",
          }}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm mr-2"></span>
              Signing in...
            </>
          ) : (
            <>{showPasswordField ? "Login" : "Next"}</>
          )}
        </motion.button>

        {!modal && (
          <>
            <div className="text-center mt-3 border-botto pb-3 mb-3">
              <p className="small text-muted">Or continue with</p>
              <div className="row">
                <div className="col-6">
                  <button type="button" className="btn-sm api_btn btn-block">
                    <img
                      src={googleLogo}
                      alt="Google Logo"
                      className="mr-2"
                      style={{ width: "20px", height: "20px" }}
                    />
                    Google
                  </button>
                </div>
                <div className="col-6">
                  <button
                    type="button"
                    className="api_btn dark_apple_api_btn btn-block"
                  >
                    <i className="fab fa-apple mr-2"></i> Apple
                  </button>
                </div>
              </div>
            </div>
            <div className="text-center mt-4">
              Don't have an account?{" "}
              <Link to="/auth/signup" className="font-weight-bol">
                Create account
              </Link>
            </div>
          </>
        )}
      </motion.form>

      <div className="auth_footer mt-5">
        <ul>
          <li>
            <Link to={"/support"}>Support </Link>
          </li>
          <li>
            <Link to={"/privacy-policy"}>Privacy and policy </Link>
          </li>
          <li>
            <Link to={"/marketing"}>Marketing </Link>
          </li>
        </ul>
      </div>
    </AuthContainer>
  );
}
