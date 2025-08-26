import React, { useState, useRef, useEffect } from 'react';
import { FiMic, FiSend, FiX } from 'react-icons/fi';
import { BsEmojiSmile } from 'react-icons/bs';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../pages/auth/AuthContext';
import MessagingSection from '../messages';
import TopSection from './TopChatAreaSection';
import default_profilePicture from '../../../assets/avater_pix.webp';
import './chatAreaStyling.css';
import DefaultChatsArea from './defaultChatArea';

function ChatsArea() {
  const { token } = useAuth();
  const { recipient_id } = useParams();
  const [searchParams] = useSearchParams();
  const chatId = searchParams.get('chat');

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [recording, setRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [audioURL, setAudioURL] = useState(null);

  const fileInputRef = useRef(null);
  const audioInputRef = useRef(null);

  // Handle file selection
  const handleFileSelect = (e) => {
    setMediaFiles(prev => [...prev, ...Array.from(e.target.files)]);
  };

  const handleAudioSelect = (e) => {
    setMediaFiles(prev => [...prev, ...Array.from(e.target.files)]);
  };

  // Remove selected file
  const removeFile = (index) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Voice recording logic
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      let chunks = [];

      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        setMediaFiles(prev => [...prev, new File([audioBlob], 'voice-message.webm', { type: 'audio/webm' })]);
        setAudioURL(URL.createObjectURL(audioBlob));
      };

      mediaRecorder.start();
      setRecorder(mediaRecorder);
      setRecording(true);
    } catch (err) {
      console.error('Mic access denied:', err);
    }
  };

  const stopRecording = () => {
    if (recorder) {
      recorder.stop();
      setRecording(false);
    }
  };

  // Send message
  const handleSendMessage = async () => {
    if (!message && mediaFiles.length === 0) return;

    try {
      const formData = new FormData();
      if (message) formData.append('content', message);
      mediaFiles.forEach(file => formData.append('media[]', file));

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/chats/${chatId}/messages`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (res.status === 200 || res.status === 201) {
        const { status, message: serverMsg, data } = res.data;
        if (status) {
          setMessages(prev => [...prev, data]);
          setMessage('');
          setMediaFiles([]);
          setAudioURL(null);
          if (fileInputRef.current) fileInputRef.current.value = '';
          if (audioInputRef.current) audioInputRef.current.value = '';
        }
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <div className="chatAreaContainer">
      {/* Header */}
      <div className="topSection">
        {recipient_id && <TopSection recipient_id={recipient_id} />}
      </div>

      {/* Chat Body */}
      <div className="bodySection">
        {recipient_id ? <MessagingSection />
          : <DefaultChatsArea />}
      </div>
      {/* Media Preview */}
      {mediaFiles.length > 0 && (
        <div className="mediaPreviewContainer">
          {mediaFiles.map((file, index) => (
            <div key={index} className="mediaPreviewItem">
              {file.type.startsWith('image/') && (
                <img src={URL.createObjectURL(file)} alt="preview" />
              )}
              {file.type.startsWith('video/') && (
                <video src={URL.createObjectURL(file)} controls />
              )}
              {file.type.startsWith('audio/') && (
                <audio src={URL.createObjectURL(file)} controls />
              )}
              <button className="removeMediaBtn" onClick={() => removeFile(index)}>
                <FiX />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      {recipient_id && <div className="footerSection">
        <button className="footerIconBtn">
          <BsEmojiSmile size={22} />
        </button>

        <input
          type="text"
          className="chatInput"
          placeholder="Message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <input
          type="file"
          multiple
          accept="image/*,video/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />
        <input
          type="file"
          accept="audio/*"
          ref={audioInputRef}
          style={{ display: 'none' }}
          onChange={handleAudioSelect}
        />

        {/* Image/Video Picker */}
        <button
          className="footerIconBtn"
          onClick={() => fileInputRef.current?.click()}
        >
          📎
        </button>

        {/* Mic Button (Press & Hold) */}
        <button
          className="footerIconBtn"
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
        >
          <FiMic size={22} color={recording ? 'red' : 'inherit'} />
        </button>

        <button
          className="footerIconBtn sendBtn"
          onClick={handleSendMessage}
        >
          <FiSend size={22} />
        </button>
      </div>}
    </div>
  );
}

export default ChatsArea;
