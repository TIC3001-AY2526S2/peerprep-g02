import React, { useEffect, useRef, useState } from "react";
import './CollaborationPage.css';
import { useUser } from "../../context/UserContext";
import { getUser } from "../../api/UserApi";
import { socket } from "../../hook/socket";

function Chat({ partnerOnline }) {

    const { user } = useUser();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [otherUser, setOtherUser] = useState(null);
    const roomInfo = JSON.parse(sessionStorage.getItem("room"));
    const userId = user.user_id;
    const roomId = roomInfo.roomId;
    const otherUserId = roomInfo.users.find(id => id !== userId);
    useEffect(() => {
        const fetchUsers = async () => {
            const [me, other] = await Promise.all([
                getUser(userId),
                getUser(otherUserId)
            ]);

            setCurrentUser(me);
            setOtherUser(other);
        };

        fetchUsers();
    }, [userId, otherUserId]);

    useEffect(() => {
        socket.on("connect", () => {
            console.log("connected");
            socket.emit("join_room", {
                roomId,
                userId
            });
        });
        if (socket.connected) {
            socket.emit("join_room", {
                roomId,
                userId
            });
        }
        socket.on("receive_message", (data) => {
            console.log(data);
            if (data.userId !== userId) {
                setMessages((prev) => [...prev, data]);
            }
        });

        return () => {
            socket.off("connect");
            socket.off("receive_message");
        };
    }, []);

    const sendMessage = () => {
        if (!message.trim()) return;

        const messageData = {
            roomId,
            userId,
            message
        }
        socket.emit("send_message", messageData);
        setMessages((prev) => [...prev, messageData]);
        setMessage("");
    };

    return (
        <div className="collab-containers chat">
            <div className="collabBox chat">
                <div className="collab-header-font chat">
                    <div>Chat</div>
                    <div>
                        <span className={`partner-status ${partnerOnline ? 'online' : 'offline'}`}>
                            {partnerOnline ? '● Partner connected' : '○ Waiting for partner…'}
                        </span>
                    </div>
                </div>
                <div className="chat-container">
                    <div className="chat-messages">
                        <div className="chat-message initial">Start chatting with <strong>{otherUser?.username} </strong>!</div>
                        {messages.map((msg, index) => (
                            msg.userId === userId ?
                                <div key={index} className="chat-message user">
                                    <strong>{currentUser?.username}: </strong>
                                    <span>{msg.message}</span>
                                </div> :
                                <div key={index} className="chat-message otherUser">
                                    <strong>{otherUser?.username}: </strong>
                                    <span>{msg.message}</span>
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