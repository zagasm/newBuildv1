import React, { useEffect, useState } from 'react';
import { Modal, Tab, Tabs } from 'react-bootstrap';
import { SignUp } from '../signup';
import { Signin } from '../signin';
import { useAuth } from '../AuthContext';
import './AuthModal.css';
import SessionPage from '../SessionPage/BrowserSession';
import { SignUpModal } from '../SessionPage/SessionSignUp';
import { ModalSignin } from '../SessionPage/SessionSignin';
import AUthModalContent from './AUthModalContent';

const AuthModal = () => {
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

  return (
    <Modal
      show={authModal.show}
      onHide={closeAuthModal}
      centered
      dialogClassName="auth-modal"
      contentClassName="auth-modal-content"
    >
      <Modal.Body className="p-0 auth-modal-body">
        <AUthModalContent />
        
      </Modal.Body>
    </Modal>
  );
};

export default AuthModal;
