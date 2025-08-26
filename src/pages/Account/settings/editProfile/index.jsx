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
function SettingEditProfile() {
    const { user, token, login } = useAuth();

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

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    useEffect(() => {

        setFormData({
            username: user?.username || '',
            first_name: user?.first_name || '',
            last_name: user?.last_name || '',
            email: user?.email || '',
            phone: user?.phone || '+234'
        });
        setFieldErrors({});

    }, [user]);

    const handleClose = () => {
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
                login({ token, user }, true);
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
    return (
        <div className="py-4">
            <div className="container-fluid p-0">
                <div className="r offset-xl-3 offset-lg-1 offset-md-1 bg-none home_section">
                    <main className="col col-xl-6 col-lg-8 col-md-12 col-sm-12 col-12 main_container m-0 pr-3 pl-3  pt-5 ">
                        <div className="account-header" style={{marginBottom:'50px'}}>
                            <div className="d-flex align-items-center justify-content-between mb-5">
                                <Link to={'/account/settings'} className="d-flex align-items-center text-dark ">
                                    <i className="fa fa-arrow-left"></i>
                                </Link>
                                <div className="d-flex align-items-center">
                                    <h6 className="m-0">Change User Information</h6>
                                </div>
                                <div className="d-flex align-items-center"></div>
                            </div>
                        </div>
                        <div>
                            <form onSubmit={handleProfileUpdate}>
                                <div className="form-group">
                                    <label className="p-0 m-0 mb-2">Username</label>
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
                                        <label className="p-0 m-0 mb-2">First Name</label>
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
                                        <label className="p-0 m-0 mb-2">Last Name</label>
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
                                    <label className="p-0 m-0 mb-2">Phone Number</label>
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
                                    <label className="p-0 m-0 mb-2">Email Address</label>
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

                                <Link to={'/account/change-password'}
                                    className="password-change-prompt"
                                >
                                    <div className="prompt-content">
                                        <FiLock className="lock-icon" />
                                        <span>Password</span>
                                    </div>
                                    {/* <FiAngleRight className="arrow-icon" /> */}
                                    <i className="fa fa-angle-right"></i>
                                </Link>

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
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default SettingEditProfile;