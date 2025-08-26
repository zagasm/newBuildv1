import React, { useState, useEffect } from 'react';
import { Button, Image } from 'react-bootstrap';
import { Eye, EyeOff, X } from 'lucide-react';
import defaultAvatar from '../../../assets/avater_pix.webp';
import add_user_icon from '../../../assets/nav_icon/add_user_icon.png';
import './browserSessionStyle.css';

const SessionPage = ({ onContinue, onGuestLogin, onFreshLogin,closeModal }) => {
  const [sessionUsers, setSessionUsers] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(sessionStorage.getItem('sessionUsers')) || [];
    
    // Filter duplicates: Keep only the first occurrence of each email OR phone
    const uniqueSessions = stored.reduce((acc, current) => {
      const isDuplicate = acc.some(session => 
        (session.email && current.email && session.email === current.email) ||
        (session.phone && current.phone && session.phone === current.phone)
      );
      if (!isDuplicate) {
        acc.push(current);
      }
      return acc;
    }, []);

    setSessionUsers(uniqueSessions);
  }, []);

  // Rest of the component remains the same...
  const handleContinue = async () => {
    if (!password.trim()) {
      setError('Password is required');
      return;
    }
    setLoading(true);
    sessionStorage.setItem('sessionUser', JSON.stringify(sessionUsers[selectedIndex]));
    const success = await onContinue(password);
    if (!success) {
      setError('Incorrect password or session expired.');
    }else{
      closeModal();
    }
    setLoading(false);
  };

  const handleRemove = (index) => {
    const updated = [...sessionUsers];
    updated.splice(index, 1);
    setSessionUsers(updated);
    sessionStorage.setItem('sessionUsers', JSON.stringify(updated));
    if (selectedIndex === index) setSelectedIndex(null);
  };
  
  return (
    <div className="session-page p-4">
      <div className="heading_section" style={{ textAlign: 'left' }}>
        <img src={add_user_icon} alt="" />
        <br />
        <span>Continue as</span>
        <p>Continue to create memes and have fun by logging in as</p>
      </div>

      <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
        {/* {console.log(sessionUsers)} */}
        {sessionUsers.map((sessionUser, index) => (
          <div
            key={index}
            className={`user_session_btn text-left d-flex align-items-center osahan-post-header mb-3 people-list ${selectedIndex === index ? 'selected' : ''}`}
            style={{ cursor: 'pointer', position: 'relative' }}
            onClick={() => setSelectedIndex(index)}
          >
            <div className="dropdown-list-image mr-3 position-relative">
              <Image
                src={sessionUser.profilePicture || defaultAvatar}
                roundedCircle
                width={80}
                height={80}
                onError={(e) => (e.target.src = defaultAvatar)}
              />
            </div>
            <div className="mr-2" style={{ lineHeight: '15px' }}>
              <b className="m-0 text-capitalize">{sessionUser?.firstName}</b>
              <br />
              <span className="small text-lowercase">
                { sessionUser?.phone || sessionUser?.email}
              </span>
            </div>
            <span
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(index);
              }}
              className="ml-auto mr-3"
              style={{
                borderRadius: '50%',
                padding: '2px',
                cursor: 'pointer',
              }}
            >
              <X size={16} />
            </span>
          </div>
        ))}
      </div>

      {selectedIndex !== null && (
        <div className="animate__animated animate__fadeIn">
          <div className="form-group text-left position-relative">
            <label>Enter Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
            />
            <span
              className="position-absolute"
              style={{
                right: '10px',
                top: '35px',
                cursor: 'pointer',
                zIndex: 2,
              }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
            {error && <div className="text-danger mt-1">{error}</div>}
          </div>

          <Button
            className="mt-3 w-100 btn-outline continue_button"
            onClick={handleContinue}
            disabled={loading}
          >
            {loading
              ? 'Continuing...'
              : `Continue as ${sessionUsers[selectedIndex]?.firstName}`}
          </Button>
        </div>
      )}

      <Button className="mt-3 w-100 guest_btn" onClick={onGuestLogin}>
        Continue as guest
      </Button>

      {selectedIndex === null && (
        <Button
          style={{
            background: 'rgba(143, 7, 231, 1)',
            color: 'white',
            borderRadius: '20px',
          }}
          className="mt-2 w-100 refresh_btn"
          onClick={onFreshLogin}
        >
          Login with different account
        </Button>
      )}
    </div>
  );
};

export default SessionPage;