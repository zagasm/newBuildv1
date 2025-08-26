import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import default_profilePicture from '../../../assets/avater_pix.webp';
import './chatStyling.css';
import Suggestedchat from './suggestedChat';
import axios from 'axios';
import { useAuth } from '../../../pages/auth/AuthContext';

function AllChats({ setShowSettings }) {
    const { token } = useAuth();
    const [chats, setChats] = useState([]);
    const [search, setSearch] = useState('');
    const [startChat, setstartChat] = useState(false);
    const [loading, setLoading] = useState(true);
    const { recipient_id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) return;

        const fetchChats = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/chats`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = res.data;
                // console.log("Response from fetchChats:", data);
                if (res.status === 200 && data?.status) {
                    const formatted = data.data.map(chat => {
                        const otherUser = chat.users.find(u => u.id !== chat.pivot.user_id);
                        // console.log("Other User:", otherUser);
                        return {
                            chat_id: chat.id,
                            id: otherUser && otherUser.meta_data.user_id,
                            name: otherUser
                                ? `${otherUser.first_name} ${otherUser.last_name}`
                                : 'Unknown User',
                            avatar: otherUser?.meta_data?.profile_picture || '',
                            message: '', // no last message in API response
                            time: new Date(chat.updated_at).toLocaleString(),
                            status: 'read',
                        };
                    });
                    setChats(formatted);
                } else {
                    console.error('Failed to load chats:', data?.message);
                }
            } catch (err) {
                console.error('Error fetching chats:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchChats();
    }, [token]);

    const filteredChats = chats.filter(chat =>
        chat.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleChatClick = (chatId) => {
        // setLoading(true);
        navigate(`/chat/${chatId}`);
        //     setLoading(false);
        //     setTimeout(() => {
        // }, 500);
    };

    return (
        <>
            {loading && (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                    <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )}
            {!loading && (
                startChat ? (
                    <Suggestedchat close={setstartChat} />
                ) : (
                    <div className=" rounde mb-3  p-0 m-0" style={{ width: '100%', background:'white' }}>
                        <div className="border-rig col-lg-12 col-xl-12 p-0 m-0">
                            <div className="osahan-chat-left text-left">
                                <div className="chat_history_header p-0">
                                    <h6 className='text-dark'>Chats</h6>
                                    <div className="d-flex justify-content-between align-items-center osahan-post-header mb-3 people-list">
                                        <div className="dropdown-list-image search_chat_user_img">
                                            <img src={default_profilePicture} className='rounded' alt="profile" />
                                        </div>
                                        <div className="search_chat_input_container">
                                            <input
                                                placeholder='Search Messages'
                                                type="text"
                                                className='form-control chat_search_input'
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                            />
                                        </div>
                                        <span
                                            style={{ cursor: 'pointer' }}
                                            className="search_settings_btn"
                                            onClick={() => setShowSettings(true)}
                                        >
                                            <span className='feather-settings chat-settings'></span>
                                        </span>
                                    </div>
                                </div>
                                <div className="osahan-chat-list m-0 pl-3">
                                    {filteredChats.length ? (
                                        filteredChats.map((chat) => {
                                            const isActive = chat.id === recipient_id;
                                            // { console.log("Chat ID:", chat); }
                                            return (
                                                <Link
                                                    to={`/chat/${chat.id}?chat=${chat.chat_id}`}
                                                    className={`pb-3 d-flex align-items-center osahan-post-header overflow-hidden ${isActive ? 'active-chat' : ''}`}
                                                    style={isActive
                                                        ? { backgroundColor: '#f0ebff', borderLeft: '3px solid #8000FF', cursor: 'pointer' }
                                                        : { cursor: 'pointer' }}
                                                >
                                                    <div className="dropdown-list-image mr-3">
                                                        {chat.avatar ? (
                                                            <img
                                                                className="rounded-circle"
                                                                src={chat.avatar}
                                                                alt={chat.name}
                                                                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                                            />
                                                        ) : (
                                                            <div
                                                                className="d-flex align-items-center bg-success justify-content-center rounded-circle text-white"
                                                                style={{ width: '40px', height: '40px' }}
                                                            >
                                                                {chat.name.charAt(0)}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="font-weight-bol mr-1 overflow-hidden">
                                                        <div className="text-dark">
                                                            {chat.name} <span style={{ fontSize: '10px' }}>{chat.time}</span>
                                                        </div>
                                                        <div className="small text-truncate overflow-hidden text-black-50">
                                                            {chat.message}
                                                        </div>
                                                    </div>
                                                    <span className="ml-auto mb-auto">
                                                        <div className="text-right pt-1 small unread-indicator"></div>
                                                    </span>
                                                </Link>
                                            );
                                        })
                                    ) : (
                                        <p className="text-center text-muted start_chat_btn_section">
                                            <button onClick={() => setstartChat(true)}>
                                                <span className='fa fa-edit'></span> Start Chat
                                            </button>
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            )}
        </>
    );
}

export default AllChats;
