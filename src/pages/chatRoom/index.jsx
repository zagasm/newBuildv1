import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import EmojiPicker from 'emoji-picker-react';
import SideBarNav from '../pageAssets/sideBarNav';
import './Chatstyle.css';
import { useAuth } from '../auth/AuthContext';
import AllChats from '../../component/chats/rightbarChat';
import RightBarComponent from '../pageAssets/rightNav';

const API_KEY = 'Zagasm2025!Api_Key_Secret';
const DEFAULT_AVATAR = 'https://zagasm.com/content/themes/default/images/blank_profile.png';

const typingSound = new Audio('./computer-mouse-click-351398.mp3');
const messageSound = new Audio('./computer-mouse-click-351398.mp3');

function Chat() {
  const { recipient_id } = useParams();
  const [message, setMessage] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [loading, setLoading] = useState(true);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const { user } = useAuth();
  const USER_ID = user.user_id;
  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);
  const lastMessageRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (!recipient_id) return;

    setConversation(null);
    setMessages([]);
    setLoading(true);

    const fetchConversationOrProfile = async () => {
      try {
        const formData = new FormData();
        formData.append('api_secret_key', API_KEY);
        formData.append('user_id', USER_ID);
        formData.append('offset', 0);

        const res = await axios.post('https://zagasm.com/includes/ajax/chat/get_conversations.php', formData);
        if (res.data.success) {
          const found = res.data.conversations.find(c =>
            c.recipients.some(r => r.user_id === recipient_id)
          );
          if (found) {
            setConversation(found);
            return;
          }
        }

        const profileData = new FormData();
        profileData.append('api_secret_key', API_KEY);
        profileData.append('profile_id', recipient_id);
        profileData.append('viewer_id', USER_ID);

        const profileRes = await axios.post('https://zagasm.com/includes/ajax/users/get_profile.php', profileData);
        if (profileRes.data.success) {
          const p = profileRes.data.profile;
          setConversation({
            conversation_id: null,
            user_id: p.user_id,
            name: `${p.user_firstname} ${p.user_lastname}`.trim(),
            picture: p.user_picture || DEFAULT_AVATAR
          });
        }
      } catch (err) {
        console.error('Conversation/Profile Load Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversationOrProfile();
  }, [recipient_id]);

  const fetchMessages = async (convId, playSound = false) => {
    const formData = new FormData();
    formData.append('api_secret_key', API_KEY);
    formData.append('user_id', USER_ID);
    formData.append('conversation_id', convId);
    formData.append('offset', 0);

    try {
      const res = await axios.post('https://zagasm.com/includes/ajax/chat/get_messages.php', formData);
      if (res.data.success) {
        if (lastMessageRef.current !== res.data.messages.at(-1)?.message_id && playSound) {
          messageSound.play();
        }
        lastMessageRef.current = res.data.messages.at(-1)?.message_id;
        setMessages(res.data.messages);
      }
    } catch (err) {
      console.error('Message Load Error:', err);
    }
  };

  useEffect(() => {
    if (conversation?.conversation_id) {
      fetchMessages(conversation.conversation_id);
      const interval = setInterval(() => {
        fetchMessages(conversation.conversation_id, true);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [conversation]);

  const handleTyping = () => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    setTyping(true);
    typingSound.play();
    typingTimeoutRef.current = setTimeout(() => setTyping(false), 2000);
  };

  const sendMessageToAPI = async () => {
    if (!message.trim() || !recipient_id) return;

    const formData = new FormData();
    formData.append('api_secret_key', API_KEY);
    formData.append('user_id', USER_ID);
    formData.append('recipient_id', recipient_id);
    formData.append('message', message);

    try {
      const res = await axios.post('https://zagasm.com/includes/ajax/chat/post_message.php', formData);
      if (res.data.success) {
        const newMessage = {
          message_id: res.data.message_id || Date.now(),
          message: message,
          user_id: USER_ID,
          user_picture: user.user_picture || DEFAULT_AVATAR,
          user_firstname: user.user_firstname || 'You',
        };
        setMessage('');
        setShowEmoji(false);
        if (conversation?.conversation_id) {
          fetchMessages(conversation.conversation_id);
        } else {
          setMessages(prev => [...prev, newMessage]);
        }
      } else {
        alert('Message failed to send.');
      }
    } catch (error) {
      console.error('Send Message Error:', error);
    }
  };

  const handleEmojiClick = (emojiData) => {
    setMessage(prev => prev + emojiData.emoji);
  };

  return (
    <div className="container-fluid" >
      <SideBarNav />
      <div className="offset-xl-2  offset-lg-2 offset-md-0  home_section p-0 p-1" style={{ marginTop: "70px" }} >
        <main className={`c ml-xl- col-xl-9 order-xl-3 col-lg-8 order-lg-1 col-md-12 col-sm-12 col-12 main_container p-0 m-0 ${recipient_id ? 'chat-overlay-mobile' : ''}`}>
          <div className="row">
            <div className="col-lg-3  m-0 ">
              <h3 className="mt-3 mb-3 ml-3" style={{ color: '#8000FF', marginTop: '65px' }}>Chats</h3>
              <AllChats style={{ color: '#8000FF', marginTop: '65px' }} />
            </div>
            <div className="col-lg-9  rounded chat-container">
              {recipient_id ? (
                <>
                  <div className="chat-header d-flex align-items-center p-3 border-bottom bg-ligh" style={{ background: 'white' }}>
                    <Link to={'/chat'} className='fa fa-angle-left mr-4'></Link>
                    <img src={conversation?.picture || DEFAULT_AVATAR} className="rounded-circle me-2" width={45} height={45} alt="user" />
                    <div>
                      <div className="fw-bold">{conversation?.name || 'User'}</div>
                      <small className="text-success">Online</small>
                    </div>
                    <div className="ms-auto d-flex gap-2">
                      <button className="btn btn-light btn-sm rounded-circle"><i className="feather-phone"></i></button>
                      <button className="btn btn-light btn-sm rounded-circle"><i className="feather-video"></i></button>
                      <button className="btn btn-light btn-sm rounded-circle"><i className="feather-more-vertical"></i></button>
                    </div>
                  </div>

                  <div className="chat-body p-3 bg-light" style={{ height: '70vh', overflowY: 'auto' }}>
                    {loading && <div className="text-center py-5"><span className="fa fa-spinner fa-spin" style={{ fontSize: '30px' }}></span></div>}
                    {!loading && messages.length === 0 && <div className="text-center text-muted">No messages yet. Start the conversation!</div>}
                    {messages.map((msg, index) => (
                      <div key={msg.message_id || index} className={`d-flex mb-3 ${msg.user_id === USER_ID ? 'justify-content-end' : ''}`}>
                        {msg.user_id !== USER_ID && <img src={msg.user_picture || DEFAULT_AVATAR} alt={msg.user_firstname} className="rounded-circle me-2" width={40} height={40} />}
                        <div className={`p-3 rounded shadow-sm ${msg.user_id === USER_ID ? 'text-white' : 'bg-white'}`} style={{ background: msg.user_id === USER_ID ? '#8000FF' : '#fff' }}>{msg.message}</div>
                        {msg.user_id === USER_ID && <img src={msg.user_picture || DEFAULT_AVATAR} alt="Me" className="rounded-circle ms-2" width={40} height={40} />}
                      </div>
                    ))}
                    {typing && <div className="d-flex align-items-center text-muted mb-2"><small>Typing...</small></div>}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="chat-footer border-top p-3 position-sticky bottom-0 bg-white">
                    <div className="chat-input-group d-flex align-items-center px-3 py-2 shadow-sm">
                      <input className="form-control chat-input" value={message} onChange={(e) => { setMessage(e.target.value); handleTyping(); }} placeholder="Write a message..." onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessageToAPI(); } }} />
                      <button className="btn emoji-btn" onClick={() => setShowEmoji(!showEmoji)}>😊</button>
                      <button className="btn send-btn" onClick={sendMessageToAPI}><i className="feather-send"></i></button>
                    </div>
                    {showEmoji && (<><div className="emoji-backdrop" onClick={() => setShowEmoji(false)}></div><div className="emoji-picker-container"><EmojiPicker onEmojiClick={handleEmojiClick} /></div></>)}
                  </div>
                </>
              ) : (
                <div className="chat-placeholder text-center">
                  <div className="container p-0 m-0">
                    <div className="d-none d-lg-block">
                      <div className="mt-5 d-flex justify-content-center align-items-center " style={{ height: '80vh' }}>
                        <div>
                          <span className="fa fa-comments mb-4 placeholder-img" style={{ fontSize: '50px', color: '#8000FF' }}></span>
                          <h4 className="fw-semibold text-dark">Welcome to your inbox</h4>
                          <p className="text-muted mb-0">Select a conversation or start a new one to begin chatting.</p>
                        </div>
                      </div>
                    </div>
                    <div className="d-block d-lg-none mt-2 ml-2">
                      <h3 style={{ color: '#8000FF', textAlign: 'left' }}>Chats</h3>
                      <AllChats />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </main>
      </div>

    </div>
  );
}

export default Chat;
