import React from 'react';
import { Modal, Tab, Tabs } from 'react-bootstrap';
import { SignUp } from '../signup';
import { Signin } from '../signin';
import { useAuth } from '../AuthContext';
import './AuthModal.css';

const AuthModal = () => {
  const { authModal, closeAuthModal } = useAuth();

  return (
    <Modal 
      show={authModal.show} 
      onHide={closeAuthModal} 
      centered
      backdrop="static"
      dialogClassName="auth-modal"
      contentClassName="auth-modal-content"
      style={{padding:'0px'}} >
      <Modal.Body className="p-0 auth-modal-body">
        <Tabs
          defaultActiveKey={authModal.defaultTab}
          className="auth-tabs mb-0"
          fill>
          <Tab 
            eventKey="login" 
            title="Login"
            className="auth-tab"
            tabClassName="auth-tab-button"
          >
            <div className="auth-content">
              <Signin modal={true} onSuccess={closeAuthModal} />
            </div>
          </Tab>
          <Tab 
            eventKey="signup" 
            title="Sign Up"
            className="auth-tab"
            tabClassName="auth-tab-button"
          >
            <div className="auth-content">
              <SignUp modal={true} onSuccess={closeAuthModal} />
            </div>
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
};

export default AuthModal;
