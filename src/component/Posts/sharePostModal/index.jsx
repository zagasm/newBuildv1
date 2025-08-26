import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, Col, Spinner, Toast, Alert, Form } from 'react-bootstrap';
import {
  FiShare2, FiLink, FiFacebook, FiTwitter,
  FiLinkedin, FiMessageSquare, FiCopy, FiCheck
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import shared_icon from '../../../assets/post_icon/shared_icon.svg';
import { useAuth } from '../../../pages/auth/AuthContext';

function ShareButton({ postId, sharesCount = 0, postUrl, postTitle = '' }) {
  const [showModal, setShowModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState(postUrl);
  const [shareCount, setShareCount] = useState(sharesCount);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const { user, isAuthenticated, logout, showAuthModal } = useAuth();


  // Generate share URL when modal opens
  useEffect(() => {
    if (showModal && !shareUrl) {
      generateShareUrl();
    }
  }, [showModal]);

  const generateShareUrl = async () => {
    // Check if user is authenticated

    // setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/meme/share/${postId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            // Authorization: `Bearer ${token}`, // if needed
          },
        }
      );


      const data = await res.json();
      console.log(data);
      if (data.status) {
        setShareUrl(data.url);
        setShareCount(data.share);
      } else {
        setError(data.message || 'Failed to generate share URL');
        // Fallback to current URL if API fails
        setShareUrl(window.location.href);
      }
    } catch (error) {
      console.error('Error sharing meme:', error);
      setError('Network error. Please try again.');
      // Fallback to current URL
      setShareUrl(window.location.href);
    } finally {
      setIsLoading(false);
    }
  };
  const handleShow = () => {
    if (!isAuthenticated) {
      showAuthModal('login'); // Show login modal if not authenticated
      return;
    }
    setShowModal(true);
    setShowToast(false);
    setError(null);
  };

  const handleClose = () => {
    setShowModal(false);
    setIsCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy:', err);
      setError('Failed to copy to clipboard');
    });
  };

  const shareOnSocialMedia = (platform) => {
    if (!shareUrl) return;

    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(postTitle);
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      messenger: `fb-messenger://share/?link=${encodedUrl}`
    };

    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=900,height=900');
      // Show success toast
      generateShareUrl();
      setShowToast(true);
    }
  };

  const styles = {
    primaryColor: '#8000FF',
    lightPurple: '#F0E6FF',
    darkPurple: '#4B0082',
  };

  const SocialButton = ({ platform, icon: Icon, color, name }) => (
    <Col xs={4} md={4} className="mb-3">
      <Button
        variant="light"
        className="w-100 h-100 d-flex flex-column align-items-center justify-content-center pt-3"
        onClick={() => shareOnSocialMedia(platform)}
        disabled={isLoading || !shareUrl}
        style={{
          // border: `1px solid ${color}`,
          borderRadius: '10px',
          color: color,
          opacity: (isLoading || !shareUrl) ? 0.6 : 1,
          transition: 'all 0.2s ease'
        }}
      >
        <Icon size={24} className="mb-2" />
        {/* <span className="small fw-medium">{name}</span> */}
      </Button>
    </Col>
  );

  return (
    <>
      <Button
        variant="light"
        onClick={handleShow}
        className="d-flex align-items-center border-0 post_icon btn"
        style={{ background: 'none', border: 'none', outline: 'none' }}
        aria-label="Share post"
      >
        <img src={shared_icon} className="me-1 post_icon" alt="share" />
        <span style={{ fontWeight: 100 }}>{shareCount}</span>
      </Button>

      <Modal
        backdrop="stati"
        show={showModal}
        onHide={handleClose}
        centered
        contentClassName="border-0 rounded-3 shadow-lg p-0"
      >
        <Modal.Header closeButton className="border-bottom-0 pb-0">
          <Modal.Title className="fw-bold d-flex align-items-center">
            <FiShare2 className="me-2" style={{ color: styles.primaryColor }} />
            <small>Share this post</small>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ paddingTop: '30px' }}>
          {error && (
            <Alert variant="danger" className="py-2">
              {error}
            </Alert>
          )}

          {isLoading ? (
            <div className="text-center py-5">
              <Spinner
                animation="border"
                variant="primary"
                style={{
                  color: styles.primaryColor,
                  width: '3rem',
                  height: '3rem'
                }}
              />
              <p className="mt-3" style={{ color: styles.primaryColor }}>
                Preparing share options...
              </p>
            </div>
          ) : (
            <>
              {/* URL Copy Section */}
              <div className="mb-4">
                <p className="small text-muted mb-2">Copy link</p>
                <div className="d-flex">
                  <Form.Control
                    type="text"
                    value={postUrl}
                    readOnly
                    className="rounded-end-0"
                    style={{ borderRight: 'none', background:'transparent' }}
                  />
                  <Button
                    variant={isCopied ? "success" : "outline-primary"}
                    onClick={copyToClipboard}
                    className="rounded-start-0 d-flex align-items-center"
                    style={{
                      borderColor: styles.primaryColor,
                      backgroundColor: isCopied ? '#28a745' : 'transparent',
                      color: isCopied ? 'white' : styles.primaryColor
                    }}
                  >
                    {isCopied ? <FiCheck size={18} /> : <FiCopy size={18} />}
                  </Button>
                </div>
                {isCopied && (
                  <div className="text-success small mt-1">Link copied to clipboard!</div>
                )}
              </div>

              {/* Social Share Options */}
              <div className="mb-">
                {/* <p className="small text-muted mb-2">Share via</p> */}
                <Row className="g-2">
                  <SocialButton
                    platform="facebook"
                    icon={FiFacebook}
                    color="#1877F2"
                    name="Facebook"
                  />
                  <SocialButton
                    platform="twitter"
                    icon={FiTwitter}
                    color="#1DA1F2"
                    name="Twitter"
                  />
                  <SocialButton
                    platform="linkedin"
                    icon={FiLinkedin}
                    color="#0A66C2"
                    name="LinkedIn"
                  />
                  <SocialButton
                    platform="whatsapp"
                    icon={FaWhatsapp}
                    color="#25D366"
                    name="WhatsApp"
                  />
                  <SocialButton
                    platform="messenger"
                    icon={FiMessageSquare}
                    color="#006AFF"
                    name="Messenger"
                  />
                </Row>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* Toast Notification */}
      {/* <Toast 
        show={showToast} 
        onClose={() => setShowToast(false)}
        delay={3000}
        autohide
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999,
          backgroundColor: '#f8f9fa',
          border: `1px solid ${styles.primaryColor}`
        }}
      >
        <Toast.Header>
          <strong className="me-auto">Success</strong>
        </Toast.Header>
        <Toast.Body>Shared successfully!</Toast.Body>
      </Toast> */}
    </>
  );
}

export default ShareButton;