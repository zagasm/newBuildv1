import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import EmojiPicker from 'emoji-picker-react';
import SideBarNav from '../pageAssets/sideBarNav';
import './Chatstyle.css';
import { useAuth } from '../auth/AuthContext';
import RightBarComponent from '../pageAssets/rightNav';
import AllChats from '../../component/chats/leftChat';
import ChatsArea from '../../component/chats/ChattingArea';
import ChatSettingModal from './ChatSetting';

function Chat() {
  const { recipient_id } = useParams();
  const [showSettings, setShowSettings] = useState(false);
  return (
    <div className="container-fluid" >
      <SideBarNav />
      <div className="chat_gen_container">
        <div className="row">
          <div className={`leftChatScreen ${recipient_id ? 'SectionOff' : 'SectionOn'} `}>
            <div className='innerLeftChat p-0 m-0'>
              <AllChats setShowSettings={setShowSettings} />
            </div>
          </div>
          <div className={`RightChatScreen ${recipient_id ? 'SectionOn' : 'SectionOff'} `}>
            <ChatsArea />
          </div>
        </div>
      </div>
      {showSettings && (
        <ChatSettingModal setShowSettings={setShowSettings} />
      )}
    </div>
  );
}

export default Chat;
