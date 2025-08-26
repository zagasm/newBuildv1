import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";
function LogoutModal({ setShowLogoutConfirm }) {
    const { user, logout, token } = useAuth();

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
        // navigate('/');
    };
    return (
        <div className="logout-modal-overlay">
            <div className="logout-modal">
                <h3>Confirm Logout</h3>
                <p>Are you sure you want to log out of your account?</p>
                <div className="logout-modal-buttons">
                    <button className="logout-btn confirm" onClick={handleLogout}>Yes, Logout</button>
                    <button className="logout-btn cancel" onClick={() => setShowLogoutConfirm(false)}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default LogoutModal;