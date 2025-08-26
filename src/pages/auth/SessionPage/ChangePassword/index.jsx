import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { showToast } from "../../../../component/ToastAlert";

export function ChangePassword({ toSignin, userIdPassword, setIsVerified, closeModal }) {
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
        toSignin();
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
    <form autoComplete="off" className=" mb-5" onSubmit={handleSubmit}>
      {/* New Password */}
      <div className="row ">
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

        <div className="row w-100   signup-form" style={{ padding: '0px', margin: '0px', }}>
          <div className="col-12 mb-3">
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
          </div>
          <div className="col-12">
            <button
              type="button"
              style={{ background: 'rgba(230, 230, 230, 1)', padding: '10px' }} className="btn btn-block btn-sm submit_button font-weight-bold text-dark btn-sm "
              onClick={() => closeModal()}>
              cancle
            </button>
          </div>
        </div>
        <div className="text-center mt-3 border-botto pb-1 mb-1">
          <span style={{ fontSize: '13px', cursor: 'pointer', color: 'rgba(143, 7, 231, 1)' }} onClick={() => setIsVerified(false)} className="small text-muted">
            <span className="fas fa-arrow-left ml-2"></span>{" "}
            <span className="font-weight-bold" to="/auth/signup">
              Go  back
            </span>
          </span>
        </div>

      </div>

    </form>
  );
}
