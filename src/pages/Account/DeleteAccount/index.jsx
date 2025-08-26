import React, { useEffect, useState } from "react";
import { FiX, FiLock, FiArrowLeft, FiMail, FiUser, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import axios from 'axios';
import { Link } from "react-router-dom";
// import './CommunityGuidelineStyling.css';
import exclamation_icon_delete from '../../../assets/nav_icon/exclamation_icon_delete.png';
import deleteAccountExclamation_icon_modal from '../../../assets/nav_icon/deleteAccountExclamation_icon_modal.png';

import './deleteaccountStyling.css';
import { useAuth } from "../../auth/AuthContext";
function DeleteAccount() {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showloading, setShowloading] = useState(false);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { user, token,logout } = useAuth();
    console.log('token-----', token);
    // 0198cd3a-f978-73e4-8b32-412b83dc21ab
    async function deleteAccount() {
        setShowloading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/v1/users/deactivate/${user.id}`,
                { password }, // body data
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log(response);
            if (response.data.status) {
                alert(response.data.message);
                logout();
                setShowloading(false);
            } else {
                alert("Failed to deactivate account");
                setShowloading(false);
            }
        } catch (error) {
            console.error("Deactivate Error:", error);
            alert("Something went wrong while deactivating your account.");
            setShowloading(false);
        }
    }

    return (
        <div className="py-4">
            <div className="container-fluid p-0">
                <div className="r offset-xl-3 offset-lg-1 offset-md-1 bg-none home_section">
                    <main className="col col-xl-6 col-lg-8 col-md-12 col-sm-12 col-12 main_container m-0 pr-3 pl-3  pt-5 ">
                        <div className="account-header" style={{ marginBottom: '50px' }}>
                            <div className="d-flex align-items-center justify-content-between mb-5">
                                <Link to={'/account/settings'} className="d-flex align-items-center text-dark ">
                                    <i className="fa fa-arrow-left"></i>
                                </Link>
                                <div className="d-flex align-items-center">
                                    <h6 className="m-0">Delete Account</h6>
                                </div>
                                <div className="d-flex align-items-center"></div>
                            </div>
                        </div>
                        <div>
                            <div className="row shadow-s p-3 mb-4">
                                <ul className="list-unstyled   p-0 m-0">
                                    <li className="switch_card">
                                        <div className="pb-4">
                                            <h3>We’re sorry to see you go! </h3>
                                            <h5>Deactivating your account will:</h5>
                                        </div>
                                        <ul>
                                            <li>Permanently remove your profile, followers, and posts,</li>
                                            <li>Erase all chats and saved memes.</li>
                                            <li>No graphic violence or adult content.</li>
                                            <li>Disable your username - it can’t be recovered.</li>
                                        </ul>
                                    </li>
                                </ul>
                                <div className="mt-5 d-flex gap-2 align-items-center p-2" style={{ background: 'rgba(255, 241, 219, 1)' }}>
                                    <img src={exclamation_icon_delete} className="avatar" style={{ width: '20px', height: '20px' }} />
                                    <div>This action is irreversible. Are you sure you want to continue?</div>
                                </div>
                            </div>
                            <div className="deleteAccountBtn">
                                <Link to={'/account/settings'} className="cancleBtn text-dark">Cancle</Link>
                                <button onClick={() => setShowDeleteConfirm(true)} className="saveBtn">Deactivate Account</button>
                            </div>

                        </div>
                        {showDeleteConfirm && (
                            <div className="Delete_logout-modal-overlay">
                                <div className="Delete_logout-modal container text-left">
                                    <div>
                                        <img src={deleteAccountExclamation_icon_modal} alt="" />
                                        <h3>Confirm Account Deactivation</h3>
                                        <p>For your security, please enter your password to confirm account deletion.</p>
                                        <p>Once confirmed, your account will be deactivated</p>

                                        <form>
                                            <div className="position-relative mt-3">
                                                {/* lock icon at left */}
                                                <FiLock className="position-absolute" style={{ top: "50%", left: "15px", transform: "translateY(-50%)", color: "#666" }} />

                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    className="form-control"
                                                    placeholder="Enter your password"
                                                    style={{ paddingLeft: "45px", paddingRight: "45px" }}
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />

                                                {/* eye toggle at right */}
                                                {showPassword ? (
                                                    <FiEyeOff
                                                        className="position-absolute"
                                                        style={{ top: "50%", right: "15px", transform: "translateY(-50%)", cursor: "pointer", color: "#666" }}
                                                        onClick={() => setShowPassword(false)}
                                                    />
                                                ) : (
                                                    <FiEye
                                                        className="position-absolute"
                                                        style={{ top: "50%", right: "15px", transform: "translateY(-50%)", cursor: "pointer", color: "#666" }}
                                                        onClick={() => setShowPassword(true)}
                                                    />
                                                )}
                                            </div>
                                        </form>




                                        <div className="mt-5 d-flex gap-2 align-items-center p-2" style={{ background: "rgba(255, 241, 219, 1)" }}>
                                            <img src={exclamation_icon_delete} className="avatar" style={{ width: "20px", height: "20px" }} />
                                            <small>This action cannot be undone.</small>
                                        </div>
                                        <div className="deleteAccountBtn d-flex justify-content-end mt-4  ">

                                            <button className="cancleBtn " onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                                            <button className="saveBtn " onClick={() => deleteAccount()}>
                                                {showloading ? "De-activating..." : "Confirm & Deactivate"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </main>
                </div>
            </div >
        </div >
    );
}

export default DeleteAccount;