import React, { useEffect, useState } from 'react';
import logo from '../../assets/zagasm_logo.png';
import { fetchChats } from './chatComponent';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../pages/auth/AuthContext';

function AllChats() {
    const [chats, setChats] = useState([]);
    const [search, setSearch] = useState('');
    const { recipient_id } = useParams();
    const { user } = useAuth();
    useEffect(() => {
        fetchChats(user.user_id).then(data => setChats(data));
    }, []);

    const filteredChats = chats.filter(chat =>
        chat.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="boxshadow-sm rounded mb-3 bg-white p-0 m-0 bg-danger">
            <div className="border-rig col-lg-12 col-xl-12 p-0 m-0">
                <div className="osahan-chat-left text-left">
                    <div className="position-relative icon-form-control p-3 border-botto">
                        <i className="feather-search position-absolute"></i>
                        <input
                            placeholder="Search messages"
                            type="text"
                            className="form-control"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="osahan-chat-list">
                        {filteredChats.length === 0 ? (
                            <p className="text-center text-muted p-3">No chats found</p>
                        ) : (
                            filteredChats.map((chat) => {
                                const isActive = chat.id === recipient_id;
                                return (
                                    <Link
                                        to={`/chat/${chat.id}`}
                                        className="text-decoration-none text-dark"
                                        key={chat.id}
                                    >
                                        <div style={isActive ? { backgroundColor: '#f0ebff', borderLeft: '3px solid #8000FF' } : {}} className={`p-3 d-flex align-items-center border-bottom osahan-post-header overflow-hidden ${isActive ? 'active-chat' : ''}`}>
                                            <div className="dropdown-list-image mr-3">
                                                {chat.avatar ? (
                                                    <img className="rounded-circle" src={chat.avatar} alt={chat.name} />
                                                ) : (
                                                    <div
                                                        className="d-flex align-items-center bg-success justify-content-center rounded-circle text-white"
                                                        style={{ width: '40px', height: '40px' }}
                                                    >
                                                        {chat.name.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="font-weight-bold mr-1 overflow-hidden">
                                                <div className="text-truncate">{chat.name}</div>
                                                <div className="small text-truncate overflow-hidden text-black-50">
                                                    <i className={`feather-check ${chat.status === 'read' ? 'text-primary' : ''}`}></i>{' '}
                                                    {chat.message}
                                                </div>
                                            </div>
                                            <span className="ml-auto mb-auto">
                                                <div className="text-right text-muted pt-1 small">{chat.time}</div>
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AllChats;
