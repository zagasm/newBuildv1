import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './CommentReactionStyle.css';
import clickSound from './click.mp3';
import { useAuth } from '../../../../pages/auth/AuthContext';

export function CommentReactionButton({
  initialCount,
  emoji = "😂",
  CommentId,
  userId,
  i_react
}) {
  const [reactionCount, setReactionCount] = useState(initialCount);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [current_i_react, setIscurrent_i_react] = useState(i_react);
  const audioRef = useRef(null);
  const { user, isAuthenticated, logout, showAuthModal } = useAuth();
  // console.log('comment IDDD',CommentId)
  // Load sound effect
  useEffect(() => {
    audioRef.current = new Audio(clickSound);
    audioRef.current.volume = 0.3;
    audioRef.current.preload = 'auto';

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playSound = () => {
    try {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => playFallbackBeep());
    } catch {
      playFallbackBeep();
    }
  };

  const playFallbackBeep = () => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = 800;
    gainNode.gain.value = 0.2;

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();
    setTimeout(() => oscillator.stop(), 100);
  };

  const sendReactionToServer = async () => {
    setIsLoading(true);
    const actionType = current_i_react ? 'unlike' : 'like';

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/meme/comments/${CommentId}/${actionType}/${userId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          console.warn("Rate limit exceeded");
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      // console.log(data);
      if (data.status) {
        setReactionCount(data.likes_count);
        setIscurrent_i_react(data.liked);
      } else {
        console.warn("Unexpected response format:", data);
      }
    } catch (error) {
      console.error("Error sending reaction:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReactionClick = (e) => {
    e.preventDefault();
    if (isAnimating || isLoading) return;

    // Check if user is authenticated
    if (!isAuthenticated) {
      showAuthModal('login'); // Show login modal if not authenticated
      return;
    }

    setIsAnimating(true);
    playSound();
    sendReactionToServer();

    setTimeout(() => setIsAnimating(false), 800);
  };

  return (
    <button
      className={`comment_reaction-container ${current_i_react ? 'i_react' : ''}`}
      onClick={handleReactionClick}
      aria-label="Toggle like"
      disabled={isLoading}
      title={!isAuthenticated ? "Login to react" : ""}
    >
      <span className="emoji-and-count">
        <span className={`emoji-wrapper ${isAnimating ? 'animate' : ''}`}>
          {emoji}
        </span>
        <span className={ reactionCount >0 || current_i_react ?  `comment_reaction-count `: 'd-none'}>
          {current_i_react
            ? reactionCount > 1
              ? `You & ${reactionCount - 1}`
              : 'You'
            : reactionCount !== 0 && reactionCount}
        </span>
      </span>
    </button>
  );
}

CommentReactionButton.propTypes = {
  initialCount: PropTypes.number,
  emoji: PropTypes.string,
  CommentId: PropTypes.string,
  userId: PropTypes.string,
  i_react: PropTypes.bool,
};