import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../../component/ToastAlert";
import AuthContainer from "../assets/auth_container";
import { motion } from "framer-motion";
import axios from "axios";

export function ChangePassword({ userIdPassword,setIsVerified }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    oldPassword: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { password, confirmPassword } = formData;

    if (!password || !confirmPassword) {
      showToast.error("All fields are required.");
      setError("All fields are required.");
      return;
    }

    if (password.length < 8) {
      showToast.error("Password must be at least 8 characters.");
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      showToast.error("Passwords do not match.");
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        password,
        is_authenticated: false,
        user_id: userIdPassword, // from props
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/users/reset-password`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      const message = response.data?.message || "An error occurred";

      if (message.includes("successfully")) {
        showToast.success(message);
        setTimeout(() => {
          navigate("/auth/signin");
        }, 1000);
      } else {
        showToast.error(message);
        setError(message);
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Network error. Please check your internet connection.";
      showToast.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <AuthContainer
      title="Set your new password"
      description="Set a new password for your account"
     backRedirect= {setIsVerified}
    >
      <form autoComplete="off" className="pr-3 pl-3" onSubmit={handleSubmit}>


        {/* New Password */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="form-group mt-2"
        >
          <span>Password</span>
          <div className="position-relative icon-form-control">
            <i
              className="feather-lock position-absolute input-icon"

            ></i>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              className="form-control input"
              placeholder="Enter New Password"
              value={formData.password}
              onChange={handleChange}
              style={{
                paddingLeft: "60px",
                fontSize: "16px",
                paddingRight: "40px",
              }}
            />
            <i
              className={`position-absolute input-icon ${showPassword ? "feather-eye" : "feather-eye-off"
                }`}
              style={{
                right: "15px",
                cursor: "pointer",
                color: '#666'
              }}
              onClick={() => setShowPassword(!showPassword)}
            ></i>
          </div>
        </motion.div>

        {/* Confirm Password */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="form-group"
        >
          <span>Confirm Password</span>
          <div className="position-relative icon-form-control">
            <i
              className="feather-lock position-absolute input-icon"
            ></i>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              className="form-control input"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={{
                paddingLeft: "60px",
                fontSize: "16px",
                paddingRight: "40px",
              }}
            />
            <i
              className={`position-absolute input-icon ${showConfirmPassword ? "feather-eye" : "feather-eye-off"
                }`}
              style={{
                right: "15px",
                cursor: "pointer",
                color: '#666'
              }}
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            ></i>
          </div>
        </motion.div>

        {error && (
          <div className="text-danger mb-3 text-center alert alert-danger">
            {error}
          </div>
        )}

        <motion.button
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="bt submit_button btn-block"
          type="submit"
          style={{ color: 'white' }}
          disabled={loading}
        >
          {loading ? (
            <span className="spinner-border spinner-border-sm mr-2"></span>
          ) : (
            "Confirm Password"
          )}
          {!loading && <span className="fas fa-arrow-right ml-2"></span>}
        </motion.button>

        <div className="py-3 text-center auth-footer mt-3">
          <span className="text-info" style={{ fontSize: "13px" }}>
            <i className="fas fa-shield-alt"></i> Your new password will be
            encrypted and stored securely
          </span>
        </div>
      </form>
    </AuthContainer>
  );
}
