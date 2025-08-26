import React, { useEffect, useState } from "react";
import { FiX, FiLock, FiArrowRight, FiArrowLeft, FiMail, FiUser, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import axios from 'axios';
import './editProfileStyle.css';
import { useAuth } from "../../../auth/AuthContext";
import { showToast } from "../../../../component/ToastAlert";

const EditProfileModal = ({ isOpen, onClose }) => {
    const { user, token, login } = useAuth();
    const [isVisible, setIsVisible] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '+234'
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            setFormData({
                username: user?.username || '',
                first_name: user?.first_name || '',
                last_name: user?.last_name || '',
                email: user?.email || '',
                phone: user?.phone || '+234'
            });
            setFieldErrors({});
        }
    }, [isOpen]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
        setError('');
        setFieldErrors({});
    };

 
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear field-specific error when user types
        if (fieldErrors[name]) {
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };
    const handlePhoneChange = (value) => {
        setFormData(prev => ({
            ...prev,
            phone: value
        }));
    };
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setFieldErrors({});

        try {
            const payload = {
                username: formData.username,
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                phone: formData.phone
            };

            const response = await axios.patch(
                `${import.meta.env.VITE_API_URL}/api/v1/users/update`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            const result = response.data;
            if (result.status === true) {
                const user = result.data;
                console.log(user)
                login({token, user}, true);
                showToast.success(result.message);
                handleClose();
            } else {
                setError(result.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error("Update error:", error);
            if (error.response?.status === 422) {
                const serverErrors = error.response.data?.errors || {};
                setFieldErrors(serverErrors);
                setError(error.response.data?.message || 'Validation failed');
            } else {
                setError(error.response?.data?.message || 'An error occurred while updating');
            }
        } finally {
            setIsLoading(false);
        }
    };

   const togglePasswordForm = () => {
        setShowPasswordForm(!showPasswordForm);
        setError('');
        setFieldErrors({});
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setFieldErrors({});

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError("Passwords don't match!");
            setIsLoading(false);
            return;
        }

        if (passwordData.newPassword.length < 8) {
            setError("Password must be at least 8 characters");
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/v1/users/reset-password`,
                {
                    password: passwordData.newPassword,
                    is_authenticated: true,
                    old_password: passwordData.currentPassword,
                    user_id: user.id
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.status == 200) {
                showToast.success(response.data.message || 'Password updated successfully!');
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                handleClose();
            } else {
                setError(response.data.message || 'Failed to update password');
            }
        } catch (error) {
            console.error("Password update error:", error);
            if (error.response?.status === 422) {
                const serverErrors = error.response.data?.errors || {};
                setFieldErrors(serverErrors);
                setError(error.response.data?.message || 'Validation failed');
            } else {
                setError(error.response?.data?.message || 'An error occurred while updating password');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen && !isVisible) return null;

    return (
        <div className={`modal-overlay ${isVisible ? 'visible' : ''}`}>
            <div className={`modal-container ${isVisible ? 'visible' : ''}`}>
                <div className="modal-header">
                    {showPasswordForm && (
                        <button className="back-btn" onClick={togglePasswordForm}>
                            <FiArrowLeft />
                        </button>
                    )}
                    <h2>{showPasswordForm ? 'Change Password' : 'Edit Profile'}</h2>
                    <button className="close-btn" onClick={handleClose}>
                        <FiX />
                    </button>
                </div>

                <div className="modal-content">
                    {error && <div className="error-message alert alert-danger p-2">{error}</div>}

                    {!showPasswordForm ? (
                        <form onSubmit={handleProfileUpdate}>
                            <div className="form-group">
                                <label>Username</label>
                                <div className="input-container">
                                    <FiUser className="input-icon d-none" />
                                    <input
                                        type="text"
                                        name="username"
                                        placeholder="Enter username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                    />
                                    {fieldErrors.username && (
                                        <div className="field-error-message">{fieldErrors.username[0]}</div>
                                    )}
                                </div>
                            </div>

                            <div className="row">
                                <div className="form-group col">
                                    <label>First Name</label>
                                    <div className="input-container">
                                        <FiUser className="input-icon d-none" />
                                        <input
                                            type="text"
                                            name="first_name"
                                            placeholder="Enter first name"
                                            value={formData.first_name}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    {fieldErrors.first_name && (
                                        <div className="field-error-message">{fieldErrors.first_name[0]}</div>
                                    )}
                                </div>
                                <div className="form-group col">
                                    <label>Last Name</label>
                                    <div className="input-container">
                                        <FiUser className="input-icon d-none" />
                                        <input
                                            type="text"
                                            name="last_name"
                                            placeholder="Enter last name"
                                            value={formData.last_name}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                     {fieldErrors.last_name && (
                                        <div className="field-error-message">{fieldErrors.last_name[0]}</div>
                                    )}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Phone Number</label>
                                <div className="input-container">
                                    <FiPhone className="input-icon d-none" />
                                    <PhoneInput
                                        country={'ng'}
                                        value={formData.phone}
                                        onChange={handlePhoneChange}
                                        inputClass="phone-input"
                                        dropdownClass="phone-dropdown"
                                        enableSearch
                                        searchPlaceholder="Search country"
                                    />
                                </div>
                                  {fieldErrors.phone && (
                                        <div className="field-error-message">{fieldErrors.phone[0]}</div>
                                    )}
                            </div>

                            <div className="form-group">
                                <label>Email Address</label>
                                <div className="input-container">
                                    <FiMail className="input-icon d-none" />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter email address"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                    />
                                    {fieldErrors.email && (
                                        <div className="field-error-message">{fieldErrors.email[0]}</div>
                                    )}
                                </div>
                            </div>

                            <div
                                className="password-change-prompt"
                                onClick={togglePasswordForm}
                            >
                                <div className="prompt-content">
                                    <FiLock className="lock-icon" />
                                    <span>Password</span>
                                </div>
                                <FiArrowRight className="arrow-icon" />
                            </div>

                            <div className="modal-actions">
                                <button
                                    className="save-btn"
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Updating...' : 'Update Profile'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handlePasswordUpdate}>
                            <div className="form-group">
                                <label>Current Password</label>
                                <div className="input-container">
                                    <FiLock className="input-icon d-none" />
                                    <input
                                        type={showCurrentPassword ? "text" : "password"}
                                        name="currentPassword"
                                        placeholder="Enter current password"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    >
                                        {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>New Password</label>
                                <div className="input-container">
                                    <FiLock className="input-icon d-none" />
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        name="newPassword"
                                        placeholder="Enter new password"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        required
                                        minLength="6"
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                    >
                                        {showNewPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Confirm Password</label>
                                <div className="input-container">
                                    <FiLock className="input-icon d-none" />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        placeholder="Confirm new password"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        required
                                        minLength="6"
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                            </div>
                            {fieldErrors.password && (
                                <div className="field-error-message mb-3">{fieldErrors.password[0]}</div>
                            )}
                            <div className="modal-actions">
                                <button
                                    className="save-btn"
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Updating...' : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditProfileModal;