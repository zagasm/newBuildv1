import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { showToast } from "../../../component/ToastAlert";
import AuthContainer from "../assets/auth_container";
import { motion } from "framer-motion";
import googleLogo from "../../../assets/google-logo.png";
import axios from "axios";

export function Signin() {
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username_email: "",
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
    // If email/phone is cleared, hide password field
    if (name === "username_email" && value.trim() === "") {
      setShowPasswordField(false);
    }
  };
  const validateForm = () => {
    const newErrors = {};
    if (!formData.username_email.trim()) newErrors.username_email = "Email or username is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!showPasswordField) {
      if (!formData.username_email.trim()) {
        setErrors({ username_email: "Email or phone number is required" });
        return;
      }
      setShowPasswordField(true);
      return;
    }

    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/users/login`,
        {
          login: formData.username_email,
          password: formData.password
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      const { status, message, data, errors: serverErrors } = response.data;
      if (status === true) {
        const { token, user } = data;
        login({ token, user });
        showToast.success(message || "Login successful!");
        navigate("/");
      } else {
        // Handle possible structured validation errors
        const fieldErrors = {};
        if (serverErrors && typeof serverErrors === "object") {
          if (serverErrors.login) {
            fieldErrors.username_email = serverErrors.login[0];
          }
          if (serverErrors.password) {
            fieldErrors.password = serverErrors.password[0];
          }
        }

        // Fallback for general error message
        setErrors({ ...fieldErrors, server: message || "Invalid credentials." });
        showToast.error(message || "Invalid credentials.");
      }
    } catch (err) {
      const message = err.response?.data?.message || "An error occurred. Please try again.";
      const serverErrors = err.response?.data?.errors;

      const fieldErrors = {};
      if (serverErrors && typeof serverErrors === "object") {
        if (serverErrors.login) {
          fieldErrors.username_email = serverErrors.login[0];
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

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!showPasswordField) {
  //     if (!formData.username_email.trim()) {
  //       setErrors({ username_email: "Email or phone number is required" });
  //       return;
  //     }
  //     setShowPasswordField(true);
  //     return;
  //   }
  //   if (!validateForm()) return;
  //   setIsLoading(false);

  //   try {
  //     const response = await axios.post(
  //       `${import.meta.env.VITE_API_URL}/api/v1/users/login`,
  //       {
  //         login: formData.username_email,
  //         password: formData.password
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json"
  //         }
  //       }
  //     );
  //     const { status, message, data } = response.data;
  //     const { token, user } = data;
  //     if (status === true) {
  //       login({ token, user }); 
  //       showToast.success(message || "Login successful!");
  //       navigate("/");
  //     } else {
  //       showToast.error(message || "Invalid credentials.");
  //       setErrors({ server: message || "Invalid credentials." });
  //     }
  //   } catch (err) {
  //     const status = err.response?.status;
  //     const message = err.response?.data?.message || "An error occurred. Please try again.";
  //     showToast.error(message);
  //     setErrors({ server: message });
  //   }

  // };
  return (
    <AuthContainer title="Enter your email address or Phone number to login your account" >
      <motion.form
        onSubmit={handleSubmit}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="pr-3 pl-3">
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
        <motion.div variants={inputVariants} className="form-group">
          <div className="position-relative icon-form-contro mt-3">
            <label>Email Address / Phone number</label>
            <input
              type="text"
              name="username_email"
              className={`form-control input ${errors.username_email ? 'is-invali' : ''}`}
              placeholder="Phone number or Email Address"
              value={formData.username_email}
              onChange={handleChange}
            />
            {errors.username_email && (
              <div className="invalid-feedback d-block">{errors.username_email}</div>
            )}
          </div>
        </motion.div>
        {/* Password Field */}
        {showPasswordField && formData.username_email.trim() !== "" && (
          <motion.div variants={inputVariants} className="form-group">
            <label>Password</label>
            <div className="position-relative icon-form-control">
              <i className="feather-lock position-absolute input-icon"></i>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className={`form-control input ${errors.password ? 'is-invali' : ''}`}
                style={{ paddingLeft: "60px", paddingRight: "40px" }}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange} />
              <i
                className={`position-absolute input-icon ${showPassword ? "feather-eye" : "feather-eye-off"}`}
                style={{
                  right: "15px",
                  cursor: "pointer",
                  color: '#666'
                }}
                onClick={() => setShowPassword(!showPassword)} />
            </div>
            {errors.password && (
              <div className="invalid-feedback d-block m-0 p-0">{errors.password}</div>
            )}
            <div className="px- text-right">
              <Link to="/auth/forget-password" style={{ color: '#8000FF' }}>
                Forgot password?
              </Link>
            </div>
          </motion.div>
        )}
        {/* Submit Button */}
        <motion.button
          variants={inputVariants}
          type="submit"
          className="bt submit_button btn-block"
          disabled={
            isLoading ||
            formData.username_email.trim() === ""
          }
          style={{
            color: formData.username_email.trim() === ""
              ? 'rgba(153, 153, 153, 1)'
              : 'white',
            backgroundColor:
              formData.username_email.trim() === ""
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
              {/* <i className="fas fa-sign-in-alt mr-2"></i> */}
              {showPasswordField ? "Login" : "Next"}
            </>
          )}
        </motion.button>
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
      </motion.form>
    </AuthContainer>
  );
}
