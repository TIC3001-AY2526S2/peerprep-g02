import React, { useEffect, useState } from "react";
import './CollaborationPage.css';
import { useUser } from "../../context/UserContext";
import { io } from "socket.io-client";

const socket = io("http://localhost:8000");

function Chat() {

    const { user } = useUser()
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessages((prev) => [...prev, data]);
        });

        return () => {
            socket.off("receive_message");
        };
    }, []);

    const sendMessage = () => {
        if (!message.trim()) return;

        const messageData = {
            author: user?.username,
            text: message,
        };

        socket.emit("send_message", messageData);
        setMessages((prev) => [...prev, messageData]);
        setMessage("");
    };
    return (
        <div className="collab-containers chat">
            <div className="collabBox chat">
                <div className="collab-header-font chat">Chat</div>
                <div className="chat-container">
                    <div className="chat-messages">
                        <div className="chat-message otherUser">
                            <strong>Other User: </strong>
                            <span>This is a placeholder for the other user's text</span>
                        </div>
                        {messages.map((msg, index) => (
                            <div key={index} className="chat-message user">
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