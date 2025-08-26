import React, { useEffect, useState } from "react";
import { FiX, FiLock, FiArrowLeft, FiMail, FiUser, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import axios from 'axios';
import { Link } from "react-router-dom";
import { useAuth } from "../../../auth/AuthContext";
import { showToast } from "../../../../component/ToastAlert";
import './editProfileStyle.css';
// import './settingStyling.css';
function SettingChangePassword() {
    const { user, token, login } = useAuth();
       const [isVisible, setIsVisible] = useState(false);
        const [showPasswordForm, setShowPasswordForm] = useState(false);
       
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
    return (
        <div className="py-4">
            <div className="container-fluid p-0">
                <div className="r offset-xl-3 offset-lg-1 offset-md-1 bg-none home_section">
                    <main className="col col-xl-6 col-lg-8 col-md-12 col-sm-12 col-12 main_container m-0 pr-3 pl-3  pt-5 ">
                        <div className="account-header" style={{ marginBottom: '50px' }}>
                            <div className="d-flex align-items-center justify-content-between mb-5">
                                <Link to={'/account/change-user-profile'} className="d-flex align-items-center text-dark ">
                                    <i className="fa fa-arrow-left"></i>
                                </Link>
                                <div className="d-flex align-items-center">
                                    <h6 className="m-0">Change Password</h6>
                                </div>
                                <div className="d-flex align-items-center"></div>
                            </div>
                        </div>
                        <div>
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
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default SettingChangePassword;