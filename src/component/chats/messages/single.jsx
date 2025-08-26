import React, { useState } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';
import './messagingSection.css';

// Text message component
export function TextOnly({ text, isOwn }) {
    return (
        <div className={`messageRow ${isOwn ? 'own' : ''}`}>
            <div className={`textMessage ${isOwn ? 'ownMsg' : 'incomingMsg'}`}>
                {text}
            </div>
        </div>
    );
}

// Image message component
export function ImageType({ src, isOwn }) {
    return (
        <div className={`messageRow ${isOwn ? 'own' : ''}`}>
            <div className={`imageMessage ${isOwn ? 'ownMsg' : 'incomingMsg'}`}>
                <img src={src} alt="sent" />
            </div>
        </div>
    );
}

// Audio message component
export function AudioType({ isOwn }) {
    const [playing, setPlaying] = useState(false);

    return (
        <div className={`messageRow ${isOwn ? 'own' : ''}`}>
            <div className={`audioMessage ${isOwn ? 'ownMsg' : 'incomingMsg'}`}>
                <button onClick={() => setPlaying(!playing)}>
                    {playing ? <FaPause /> : <FaPlay />}
                </button>
                <div className="waveform">
                    <span></span><span></span><span></span><span></span><span></span>
                </div>
                <small className="audioTime">0:15</small>
            </div>
        </div>
    );
}
