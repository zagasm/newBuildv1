import React, { useState } from "react";
import chat_icon from "../../../assets/nav_icon/chat_icon.svg"; // adjust path if needed
import { useAuth } from "../../../pages/auth/AuthContext";
// import { useAuth } from "../../auth/AuthContext";
import './startConversationBtnStyling.css';
import { Icon } from "@iconify/react/dist/iconify.js";
function StartChatButton({ recipientId, onChatStarted }) {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleStartChat = async () => {
        if (!recipientId || !token) {
            console.error("Recipient ID or token missing");
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/chats/private`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Bearer ${token}`,
                },
                body: new URLSearchParams({
                    recipient_id: recipientId,
                }),
            });

            const data = await response.json();
            if (response.ok && data?.status) {
                console.log("Chat started:", data);
                if (onChatStarted) {
                    onChatStarted(data.data); // pass back chat info
                }
            } else {
                console.error("Failed to start chat:", data?.message || "Unknown error");
            }
        } catch (error) {
            console.error("Error starting chat:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            type="button"
            className="btn    d-flex align-items-center gap-2 chat-btn pr-4 pl-4 pt-1 pb-1"
            onClick={handleStartChat}
            disabled={loading}
        >
            {loading ? "Starting..." : "Chat"}
            {!loading && 
            // <span className="fa fa-message"></span>
            <Icon icon="bi:chat-dots"  />
            // <img src={chat_icon} alt="" style={{ width: "15px" }} />
            }
        </button>
    );
}

export default StartChatButton;
