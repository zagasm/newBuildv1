import React, { useState } from 'react';
import './defaultAreaStyling.css';
import default_profilePicture from '../../../../assets/avater_pix.webp';
import chat_zagasm_logo from '../../../../assets/nav_icon/chat_zagasm_logo.png';

function DefaultChatsArea() {
    return (
        <>
            <div className="boxshadow-sm defaultAreaSection rounded  p-0 m-0">
                <div className="defaultDescription">
                    <div className="defaultImageContainer">
                        <img
                            src={chat_zagasm_logo}
                            alt="Default Chat"
                            className="defaultChatImage"
                        />
                    </div>
                    <h6 className="text-center text-dark">No Chat Selected</h6>
                    <p className="text-center">Pick a conversation fom the list to start laughing together. Your memes are waiting to be shared!.</p>
                    <div className="defaultAreaFooter text-center p-0 m-0">
                        <div>
                            <p><span className='fa fa-lock'></span> All messages are end-to-end encrypted</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default DefaultChatsArea;
