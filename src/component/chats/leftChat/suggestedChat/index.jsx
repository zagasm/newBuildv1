import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../chatStyling.css';
// Mock chat data
const mockChats = [
    {
        id: '1',
        name: 'John Doe',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        message: 'Hey, how are you doing?',
        time: '10:30 AM',
        status: 'read'
    },
    {
        id: '2',
        name: 'Sarah Smith',
        avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
        message: 'Meeting at 2pm tomorrow',
        time: 'Yesterday',
        status: 'unread'
    },
    {
        id: '3',
        name: 'Mike Johnson',
        avatar: '',
        message: 'Please review the documents',
        time: 'Monday',
        status: 'read'
    },
    {
        id: '4',
        name: 'Emily Wilson',
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
        message: 'Thanks for your help!',
        time: '12/05/23',
        status: 'read'
    },
    {
        id: '5',
        name: 'David Brown',
        avatar: '',
        message: 'Let me know when you are free',
        time: '11/30/23',
        status: 'unread'
    }
];
// Demo user object
const demoUser = {
    user_id: '123'
};
function Suggestedchat({close}) {
    const [chats] = useState(mockChats);
    const [search, setSearch] = useState('');
    const { recipient_id } = useParams();
    const filteredChats = chats.filter(chat =>
        chat.name.toLowerCase().includes(search.toLowerCase())
    );
    return (
        <div className="boxshadow-sm rounded mb-3 bg-white p-0 m-0">
            <div className="border-rig col-lg-12 col-xl-12 p-0 m-0">
                <div className="osahan-chat-left text-left ml-2">
                    <div className="chat_history_header mt-4 pl-2">
                        <p>
                            <b  className='text-dark' > <span onClick={()=>close(false)} style={{cursor:'pointer'}} className='fa fa-arrow-left mr-2'></span> New chats</b>
                        </p>
                        <div className="d-flex justify-content-between align-items-center osahan-post-header mb-3 people-list" >
                           
                            <div className="search_chat_input_container" style={{ width: '90%' }}>
                                <input placeholder='search Messages' type="text" className='form-control chat_search_input' />
                            </div>
                            <span className="search_settings_btn">
                                <span className='feather-settings'></span>
                            </span>
                        </div>
                    </div>
                    <div className="osahan-chat-list">
                        {filteredChats.length ? (
                            <p className="text-center text-muted start_chat_btn_section">
                                No user found
                            </p>
                        ) : (
                            filteredChats.map((chat) => {
                                const isActive = chat.id === recipient_id;
                                return (
                                    <Link
                                        to={`/chat/${chat.id}`}
                                        className="text-decoration-none text-dark"
                                        key={chat.id} >
                                        <div
                                            style={isActive ? {
                                                backgroundColor: '#f0ebff',
                                                borderLeft: '3px solid #8000FF'
                                            } : {}}
                                            className={`p-3 d-flex align-items-center  osahan-post-header overflow-hidden ${isActive ? 'active-chat' : ''}`}
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
                                                <div className="text-truncate">{chat.name}</div>
                                                <div className="small text-truncate overflow-hidden text-black-50">
                                                    @username
                                                </div>
                                            </div>
                                           
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
export default Suggestedchat;