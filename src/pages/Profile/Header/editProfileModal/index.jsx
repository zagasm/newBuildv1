import React, { useEffect, useState } from "react";
import { FiEdit, FiX, FiLock, FiArrowRight, FiArrowLeft, FiMail, FiEye, FiEyeOff } from 'react-icons/fi';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import './editProfileStyle.css';

const EditProfileModal = ({ isOpen, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(true);
    const [showConfirmPassword, setShowConfirmPassword] = useState(true);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            // Set Nigeria as default country
            setPhone('+234');
        }
    }, [isOpen]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const togglePasswordForm = () => {
        setShowPasswordForm(!showPasswordForm);
    };

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    if (!isOpen && !isVisible) return null;

    return (
        <div className={`modal-overlay m-0 ${isVisible ? 'visible' : ''}`} style={{padding:'0px', margin:'0px'}}>
            <div className={`modal-container  ${isVisible ? 'visible' : ''}`} style={{paddingLeft:'0px', marginLeft:'0px'}}>
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
                    {!showPasswordForm ? (
                        <>
                            <div className="row">
                                <div className="form-group col">
                                    <label>First Name</label>
                                    <input type="text" placeholder="Enter first name" />
                                </div>
                                <div className="form-group col">
                                    <label>Last Name</label>
                                    <input type="text" placeholder="Enter last name" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Phone Number</label>
                                <PhoneInput
                                    country={'ng'} // Default to Nigeria
                                    value={phone}
                                    onChange={setPhone}
                                    inputClass="phone-input"
                                    dropdownClass="phone-dropdown"
                                    enableSearch
                                    searchPlaceholder="Search country"
                                />
                            </div>

                            <div className="form-group">
                                <label>Email Address</label>
                                <div className="email-input-container">
                                    <FiMail className="email-icon" />
                                    <input 
                                        type="email" 
                                        placeholder="Enter email address" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={{paddingLeft:'40px'}}
                                    />
                                </div>
                            </div>

                            <div className="password-change-prompt" onClick={togglePasswordForm}>
                                <div className="prompt-content">
                                    <FiLock className="lock-icon" />
                                    <span>Password</span>
                                </div>
                                <FiArrowRight className="arrow-icon" />
                            </div>

                            <div className="modal-actions">
                                {/* <button className="cancel-btn" onClick={handleClose}>
                                    Cancel
                                </button> */}
                                <button className="save-btn">Update Profile</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="form-group">
                                <label>New Password</label>
                                <div className="password-input-container">
                                    <FiLock className="password-icon" />
                                    <input 
                                        type={showNewPassword ? "text" : "password"} 
                                        placeholder="Enter new password" 
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                         style={{paddingLeft:'40px'}}
                                    />
                                    <button 
                                        type="button" 
                                        className="toggle-password"
                                        onClick={toggleNewPasswordVisibility}
                                    >
                                        {!showNewPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Confirm Password</label>
                                <div className="password-input-container">
                                    <FiLock className="password-icon" />
                                    <input 
                                        type={showConfirmPassword ? "text" : "password"} 
                                        placeholder="Confirm new password" 
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                         style={{paddingLeft:'40px'}}
                                    />
                                    <button 
                                        type="button" 
                                        className="toggle-password"
                                        onClick={toggleConfirmPasswordVisibility}
                                    >
                                        {!showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button className="save-btn">Update Password</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditProfileModal;