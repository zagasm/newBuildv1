import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { showToast } from "../../../component/ToastAlert";
import AuthContainer from "../assets/auth_container";
import { motion } from "framer-motion";
import googleLogo from "../../../assets/google-logo.png";
import axios from "axios";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export function SignUpModal({closeModal}) {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    password: "",
    reset_key: "",
    user_logged_in: true
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setFieldErrors(prev => ({ ...prev, [name]: null }));
  };

  const handlePhoneChange = (value) => {
    setFormData(prev => ({
      ...prev,
      phone: value
    }));
    setFieldErrors(prev => ({ ...prev, phone: null }));
  };

  const validatePhoneNumber = (phone) => {
    try {
      const phoneNumber = parsePhoneNumberFromString("+" + phone);
      return phoneNumber && phoneNumber.isValid();
    } catch (error) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (!formData.first_name || !formData.last_name || !formData.phone || !formData.password) {
      showToast.error("Please fill in all fields");
      return;
    }

    if (!validatePhoneNumber(formData.phone)) {
      showToast.error("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);
    try {

      console.log(formData.phone);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/users/register`,
        {
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: '+' + formData.phone,
          password: formData.password
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      const { status, message, data } = response.data;
      if (status) {
        showToast.success(message || "Registration successful!");
        setIsLoading(false);
        setFormData({});
        const { user, token } = data;
        login({ token, user });
        
      } else {
        showToast.error(message || "An error occurred. Please try again.");
        setError(message || "An error occurred. Please try again.");
      }
    } catch (err) {
      const message = err.response?.data?.message || "An error occurred. Please try again.";
      const errors = err.response?.data?.errors || {};
      setError(message);
      setFieldErrors(errors);
      showToast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormComplete = formData.first_name && formData.last_name && formData.phone && formData.password;

  return (

    <form autoComplete="off" className='signup-form pt-4 pb-4' onSubmit={handleSubmit}>
      <h6 className="pb-3">Create your account</h6>
      {error && <div className="text-danger mb-3 alert alert-danger">{error}</div>}
      <div className="row p-0 m-0">
        <div className=" col-md-6 col-6 col-sm-6 col-lg-6 col-xl-6 p-0 m-0">
          <label htmlFor="">First name</label>
          <div className="position-relative icon-form-contro input_box field_margin_container_f_name">
            <input
              type="text"
              name="first_name"
              className="form-control input"
              style={{ outline: "none" }}
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
            {fieldErrors.first_name && (
              <small className="text-danger d-block mt-1">{fieldErrors.first_name[0]}</small>
            )}
          </div>
        </div>

        <div className=" col-md-6 col-6 col-sm-6 col-lg-6 col-xl-6 p-0 m-0">
          <label htmlFor="">Last name</label>
          <div className="position-relative icon-form-contro input_box field_margin_container_l_name">
            <input
              type="text"
              name="last_name"
              className="form-control input"
              style={{ outline: "none" }}
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
            {fieldErrors.last_name && (
              <small className="text-danger d-block mt-1">{fieldErrors.last_name[0]}</small>
            )}
          </div>
        </div>
      </div>

      <div className="form-group">
        <label>Phone number</label>
        <div className="position-relative icon-form-contro input_box">
          <PhoneInput
            country={'ng'}
            value={formData.phone}
            onChange={handlePhoneChange}
            inputStyle={{
              width: "100%",
              paddingLeft: "60px",
              outline: "none"
            }}
            inputClass="form-control input custom-phone-input"
            specialLabel=""
            enableSearch
          />
          {fieldErrors.phone && (
            <small className="text-danger d-block mt-1">{fieldErrors.phone[0]}</small>
          )}
        </div>
      </div>

      <div className="form-group">
        <label>Password</label>
        <div className="position-relative icon-form-control input_box">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            className="form-control input"
            style={{ paddingLeft: "60px", paddingRight: "40px" }}
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
          />
          <i className="feather-lock position-absolute input-icon"></i>
          <i
            className={`position-absolute input-icon ${showPassword ? "feather-eye" : "feather-eye-off"}`}
            style={{
              right: "15px",
              cursor: "pointer",
              color: '#666'
            }}
            onClick={() => setShowPassword(!showPassword)}
          ></i>
          {fieldErrors.password && (
            <small className="text-danger d-block mt-1">{fieldErrors.password[0]}</small>
          )}
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-6">
        <motion.button
          className="bt submit_button btn-block input_bo font-weight-bold"
          type="submit"
          disabled={!isFormComplete || isLoading}
          style={{
            color: isFormComplete
              ? "white"
              : "rgba(153, 153, 153, 1)",
            backgroundColor: isFormComplete
              ? "rgba(143, 7, 231, 1)"
              : "rgba(230, 230, 230, 1)"
          }}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm mr-2"></span>
              Submitting...
            </>
          ) : (
            <>Create Account</>
          )}
        </motion.button>
      </div>
      <div className="col-6">
        <motion.button style={{ background: 'rgba(230, 230, 230, 1)' }} className="btn btn-block submit_button font-weight-bold" type="button" onClick={() => closeModal()}>cancel</motion.button>
      </div>
      </div>



    </form>
  );
}
