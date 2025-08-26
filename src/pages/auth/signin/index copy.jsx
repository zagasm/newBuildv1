import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { showToast } from "../../../component/ToastAlert";
import AuthContainer from "../assets/auth_container";
import { motion } from "framer-motion";
import googleLogo from "../../../assets/google-logo.png";
import axios from "axios";

export function Signin({ modal }) {
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true); // New remember me state
  const [formData, setFormData] = useState({
    loginInput: "",
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
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    if (name === "loginInput" && value.trim() === "") {
      setShowPasswordField(false);
    }
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.loginInput.trim()) newErrors.loginInput = "Email or username is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const detectLoginType = (input) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d+$/; // only digits (you can make it stricter, e.g. length check)

    if (emailRegex.test(input)) {
      return "email";
    } else if (phoneRegex.test(input)) {
      return "phone";
    } else {
      return "unknown"; // fallback for invalid input
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!showPasswordField) {
      if (!formData.loginInput.trim()) {
        setErrors({ loginInput: "Email or phone number is required" });
        return;
      }
      setShowPasswordField(true);
      return;
    }

    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const loginType = detectLoginType(formData.loginInput);
      // console.log("Detected type:", loginType);
      if (loginType == 'unknown') {
        showToast.error("please check your login credential, it's either email or phone number");
        return false;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/users/login`,
        {
          login: loginType === 'phone' ? '+' + formData.loginInput : formData.loginInput,
          password: formData.password
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      // console.log()

      const { status, message, data, errors: serverErrors } = response.data;
      if (status === true) {
        const { token, user } = data;
        if (token !== null || token !== undefined || token !== "") {
          login({ token, user }, rememberMe);
          navigate("/");
        }
        showToast.success(message || "Login successful!");
      } else {
        const fieldErrors = {};
        if (serverErrors && typeof serverErrors === "object") {
          if (serverErrors.login) {
            fieldErrors.loginInput = serverErrors.login[0];
          }
          if (serverErrors.password) {
            fieldErrors.password = serverErrors.password[0];
          }
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
          fieldErrors.loginInput = serverErrors.login[0];
        }
        if (serverErrors.password) {
          fieldErrors.password = serverErrors.password[0];
        }
      }
      setErrors({ ...fieldErrors, server: message });
      showToast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer modal={modal} title="Enter your email address or Phone number to login your account">
      <motion.form
        onSubmit={handleSubmit}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={modal ? 'pb-5' : "pr-3 pl-3"}
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

        {/* Username/Email Field */}
        <motion.div variants={inputVariants} className="form-group p-0 m-0">
          <div className="position-relative icon-form-contro mt-3">
            <span>Email Address / Phone number</span>
            <input
              type="text"
              name="loginInput"
              className={`form-control input ${errors.loginInput ? 'is-invali' : ''}`}
              placeholder="Phone number or Email Address"
              value={formData.loginInput}
              onChange={handleChange}
            />
            {errors.loginInput && (
              <div className="invalid-feedback d-block">{errors.loginInput}</div>
            )}
          </div>
        </motion.div>

        {/* Password Field */}
        {showPasswordField && formData.loginInput.trim() !== "" && (
          <>
            <motion.div variants={inputVariants} className="form-group">
              <span>Password</span>
              <div className="position-relative icon-form-control">
                <i className="feather-lock position-absolute input-icon"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className={`form-control input ${errors.password ? 'is-invali' : ''}`}
                  style={{ paddingLeft: "60px", paddingRight: "40px" }}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <i
                  className={`position-absolute input-icon ${showPassword ? "feather-eye" : "feather-eye-off"}`}
                  style={{
                    right: "15px",
                    cursor: "pointer",
                    color: '#666'
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                />
              </div>
              {errors.password && (
                <div className="invalid-feedback d-block m-0 p-0">{errors.password}</div>
              )}



            </motion.div>

            {/* Remember Me Checkbox */}
            <motion.div
              variants={inputVariants}
              className="form-group mt-3 "
            >
              <div className="d-flex align-items-center">
                <span className="custom-checkbox" style={{ cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={handleRememberMeChange}
                    style={{ display: 'none' }} // Hide default checkbox
                  />
                  <span className="checkmark" style={{
                    display: 'inline-block',
                    width: '18px',
                    height: '18px',
                    backgroundColor: rememberMe ? '#8000FF' : 'white',
                    border: `2px solid ${rememberMe ? '#8000FF' : '#ddd'}`,
                    borderRadius: '4px',
                    marginRight: '10px',
                    position: 'relative',
                    transition: 'all 0.3s ease'
                  }}>
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
                    fontSize: '14px',
                    userSelect: 'none',
                  }}>
                    Keep me logged in
                  </span>
                </span>
              </div>
            </motion.div>
          </>
        )}
        <div className="px- text-right pb-3">
          <Link to="/auth/forget-password" style={{ color: '#8000FF' }}>
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
            formData.loginInput.trim() === ""
          }
          style={{
            color: formData.loginInput.trim() === ""
              ? 'rgba(153, 153, 153, 1)'
              : 'white',
            backgroundColor:
              formData.loginInput.trim() === ""
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
            <>
              {showPasswordField ? "Login" : "Next"}
            </>
          )}
        </motion.button>

        {!modal && (
          <>
            <div className="text-center mt-3 border-botto pb-3 mb-3">
              <p className="small text-muted">Or continue with</p>
              <div className="row">
                <div className="col-6">
                  <button type="button" className="btn-sm api_btn btn-block">
                    <img src={googleLogo} alt="Google Logo" className="mr-2" style={{ width: '20px', height: '20px' }} />
                    Google
                  </button>
                </div>
                <div className="col-6">
                  <button type="button" className="api_btn dark_apple_api_btn btn-block">
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
          <li><Link to={'/support'}>Support </Link></li>
          <li><Link to={'/privacy-policy'}>Privacy and policy  </Link></li>
          <li><Link to={'/marketing'}>Marketing  </Link></li>
        </ul>
      </div>
    </AuthContainer>
  );
}