import React, { useEffect, useState } from 'react';
import { Modal, Tab, Tabs } from 'react-bootstrap';
import { SignUp } from '../signup';
import { Signin } from '../signin';
import { useAuth } from '../AuthContext';
import './AuthModal.css';
import SessionPage from '../SessionPage/BrowserSession';
import { SignUpModal } from '../SessionPage/SessionSignUp';
import { ModalSignin } from '../SessionPage/SessionSignin';

const AUthModalContent = ({ closrefresh, refresh }) => {
    const {
        authModal,
        closeAuthModal,
        user,
        restoreSession,
        setShowSessionPage,
        showSessionPage,
        logout,
    } = useAuth();

    const [sessionUsers, setSessionUsers] = useState([]);
    if (user) return null;
    useEffect(() => {
        if (authModal.show && !user) {
            const stored = sessionStorage.getItem('sessionUsers');
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setSessionUsers(parsed);
                    setShowSessionPage(true);
                } else {
                    setShowSessionPage(false);
                }
            } else {
                setShowSessionPage(false);
            }
        }
    }, [authModal.show, user]);

    const handleContinueSession = async (password, sessionUser) => {
        const success = await restoreSession(password, sessionUser);
        if (success) {
            closeAuthModal();
            return true;
        }
        return false;
    };

    const handleFreshLogin = () => {
        setShowSessionPage(false);
    };

    const handleGuestLogin = () => {
        closeAuthModal();
    };

    const handleRemoveSession = (userId) => {
        const updated = sessionUsers.filter((user) => user.id !== userId);
        sessionStorage.setItem('sessionUsers', JSON.stringify(updated));
        setSessionUsers(updated);
        if (updated.length === 0) {
            setShowSessionPage(false);
        }
    };

    const handleClearAllSessions = () => {
        sessionStorage.removeItem('sessionUsers');
        setSessionUsers([]);
        setShowSessionPage(false);
    };

    return (
        <>
            {showSessionPage ? (
                <SessionPage
                    sessions={sessionUsers}
                    onContinue={handleContinueSession}
                    onRemove={handleRemoveSession}
                    onClearAll={handleClearAllSessions}
                    onFreshLogin={handleFreshLogin}
                    onGuestLogin={refresh ? closrefresh : handleGuestLogin}
                    closeModal={refresh ? closrefresh : handleGuestLogin}
                />
            ) : (
                <Tabs
                    defaultActiveKey={authModal.defaultTab}
                    className="auth-tabs mb-0"
                    fill
                >
                    <Tab
                        eventKey="login"
                        title="Login"
                        className="auth-tab"
                        tabClassName="auth-tab-button"
                    >
                        <div className="auth-content p-0">
                            <ModalSignin closeModal={refresh ? closrefresh : handleGuestLogin} onSuccess={closeAuthModal} />
                        </div>
                    </Tab>
                    <Tab
                        eventKey="signup"
                        title="Sign Up"
                        className="auth-tab"
                        tabClassName="auth-tab-button"
                    >
                        <div className="auth-content p-0">
                            <SignUpModal closeModal={refresh ? closrefresh : handleGuestLogin} onSuccess={closeAuthModal} />
                        </div>
                    </Tab>


                </Tabs>
            )}
        </>
    );
};

export default AUthModalContent;
