import React, { useEffect, useRef, useState } from "react";
import './CollaborationPage.css';
import { useUser } from "../../context/UserContext";

function Chat({ sessionId }) {
    const { user } = useUser();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const socketRef = useRef(null);

    useEffect(() => {
        if (!sessionId) return;

        const token = sessionStorage.getItem("token");
        const wsUrl = `ws://localhost:8000/chat/?session_id=${sessionId}&token=${token}`;
        socketRef.current = new WebSocket(wsUrl);

        socketRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.author !== user?.username) {
                setMessages((prev) => [...prev, data]);
            }
        };

        socketRef.current.onerror = (e) => console.error("Chat WS error:", e);

        return () => socketRef.current?.close();
    }, [sessionId]);

    const sendMessage = () => {
        if (!message.trim() || !socketRef.current) return;

        const messageData = {
            author: user?.username,
            text: message,
        };

        socketRef.current.send(JSON.stringify(messageData));

        setMessages((prev) => [...prev, messageData]);
        setMessage("");
    };

    return (
        <div className="collab-containers chat">
            <div className="collabBox chat">
                <div className="collab-header-font chat">Chat</div>
                <div className="chat-container">
                    <div className="chat-messages">
                        {messages.length === 0 && (
                            <div className="chat-message otherUser">
                                <span>No messages yet. Say hello!</span>
                            </div>
                        )}
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`chat-message ${msg.author === user?.username ? "user" : "otherUser"}`}
                            >
                                <strong>{msg.author}: </strong>
                                <span>{msg.text}</span>
                            </div>
                        ))}
                    </div>

                    <div className="chat-input-area">
                        <input
                            type="text"
                            value={message}
                            placeholder="Type a message..."
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        />
                        <div className="collab-buttons" onClick={sendMessage}>Send</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;