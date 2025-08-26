import React from 'react';
import { TextOnly, ImageType, AudioType } from './single';
import './messagingSection.css';

function MessagingSection() {
    const messages = [
        { type: 'text', text: 'Hey!', own: false },
        { type: 'text', text: 'Hello 😄', own: true },
        { type: 'image', src: 'https://images.unsplash.com/photo-1754338785265-487bdaf99827?q=80&w=1175&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', own: false },
        { type: 'audio', own: true },
        { type: 'text', text: 'Hey!', own: false },
        { type: 'text', text: 'Hello 😄', own: true },
        { type: 'image', src: 'https://images.unsplash.com/photo-1754338785265-487bdaf99827?q=80&w=1175&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', own: false },
        { type: 'audio', own: true },
        { type: 'text', text: 'Hey!', own: false },
        { type: 'text', text: 'Hello 😄', own: true },
        { type: 'image', src: 'https://images.unsplash.com/photo-1754338785265-487bdaf99827?q=80&w=1175&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', own: false },
        { type: 'audio', own: true },
        { type: 'text', text: 'Hey!', own: false },
        { type: 'text', text: 'Hello 😄', own: true },
        { type: 'image', src: 'https://images.unsplash.com/photo-1754338785265-487bdaf99827?q=80&w=1175&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', own: false },
        { type: 'audio', own: true }
    ];

    return (
        <div className="messagingContainer">
            {messages.map((msg, idx) => {
                if (msg.type === 'text') return <TextOnly key={idx} text={msg.text} isOwn={msg.own} />;
                if (msg.type === 'image') return <ImageType key={idx} src={msg.src} isOwn={msg.own} />;
                if (msg.type === 'audio') return <AudioType key={idx} isOwn={msg.own} />;
                return null;
            })}
        </div>
    );
}

export default MessagingSection;
