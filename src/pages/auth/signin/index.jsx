import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { showToast } from "../../../component/ToastAlert";
import AuthContainer from "../assets/auth_container";
import { motion } from "framer-motion";
import googleLogo from "../../../assets/google-logo.png";
import axios from "axios";

export function Signin() {
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
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const formPayload = new FormData();
      formPayload.append("username_email", formData.username_email);
      formPayload.append("password", formData.password);
// const response = await axios.post(`https://zagasm.com/api/auth/sign_in.php`, formPayload);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/sign_in.php`,
        formPayload
       
      );

      const data = response.data;
    console.log(data);
      // if (data.error) {
      //   throw new Error(data.message || "Login failed");
      // }

      // login({
      //   ...data.user,
      //   token: data.token
      // });

      // showToast.success(data.message || "Login successful!");
      // navigate("/");
    } catch (err) {
      console.error("Error during sign in:", err);

      // Backend responded with an error
      const status = err.response.status;
      const message =
        err.response.data?.message || "An error occurred. Please try again.";

      if (status === 401) {
        showToast.error(message || "Invalid credentails.");
        setErrors(message || "Invalid credentails.");
      } else {
        showToast.error(message);
        setErrors(message);
      }

    }

    finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer title="Welcome Back" description="Sign in to continue your journey">
      <motion.form
        onSubmit={handleSubmit}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="pr-3 pl-3"
      >
        {/* Error Message */}
        {errors.server && (
          <motion.div
            className="alert alert-danger"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {errors.server}
          </motion.div>
        )}

        {/* Username/Email Field */}
        <motion.div variants={inputVariants} className="form-group">
          <div className="position-relative icon-form-control">
            <i className="feather-user position-absolute input-icon"></i>
            <input
              type="text"
              name="username_email"
              className={`form-control input ${errors.username_email ? 'is-invalid' : ''}`}
              style={{ paddingLeft: "60px" }}
              placeholder="Email or Username"
              value={formData.username_email}
              onChange={handleChange}
            />
            {errors.username_email && (
              <div className="invalid-feedback d-block">{errors.username_email}</div>
            )}
          </div>
        </motion.div>

        {/* Password Field */}
        <motion.div variants={inputVariants} className="form-group">
          <div className="position-relative icon-form-control">
            <i className="feather-lock position-absolute input-icon"></i>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className={`form-control input ${errors.password ? 'is-invalid' : ''}`}
              style={{ paddingLeft: "60px", paddingRight: "40px" }}
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <i
              className={`position-absolute ${showPassword ? "feather-eye" : "feather-eye-off"}`}
              style={{ right: "9px", top:'-23px', cursor: "pointer" }}
              onClick={() => setShowPassword(!showPassword)}
            />
            {errors.password && (
              <div className="invalid-feedback d-block">{errors.password}</div>
            )}
          </div>
        </motion.div>

        {/* Forgot Password */}
        <div className="py-3 text-right">
          <Link to="/auth/forget-password" style={{ color: '#8000FF' }}>
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <motion.button
          variants={inputVariants}
          type="submit"
          className="btn submit_button btn-block"
          disabled={isLoading}
          style={{ color: 'white' }}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm mr-2"></span>
              Signing in...
            </>
          ) : (
            <>
              <i className="fas fa-sign-in-alt mr-2"></i>
              Sign In
            </>
          )}
        </motion.button>

        {/* Social Login */}
        <div className="text-center mt-4">
          <p className="small text-muted mb-3">Or continue with</p>
          <div className="row">
            <div className="col-6">
              <motion.button
                initial={{ opacity: 0, y: 70 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                type="button"
                className=" btn-sm api_btn btn-block"
              >
                <img src={googleLogo} alt="Google Logo" className="mr-2" style={{ width: '20px', height: '20px', marginTop: '-5px' }} />
                <span>Google</span>
              </motion.button>
            </div>
            <div className="col-6">
              <motion.button
                initial={{ opacity: 0, y: 70 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                type="button"
                className=" api_btn dark_apple_api_btn btn-block"
              >
                <i className="fab fa-apple mr-2"></i> Apple
              </motion.button>
            </div>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="text-center mt-4">
          Don't have an account?{" "}
          <Link to="/auth/signup" className="font-weight-bold">
            Create account
          </Link>
        </div>
      </motion.form>
    </AuthContainer>
  );
}
