import "./styles-messenger.css";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { BiSend } from "react-icons/bi";
import { useUser } from "../../../../context/UserContext";
import { socketServer } from "../../../../services/socket-server";

/**
 * Component for displaying and sending messages in a chat.
 * @param {Object} props - The component props.
 * @param {Function} props.setIsChatFocused - Function to set whether the chat is focused or not.
 * @returns {JSX.Element} The JSX.Element containing the chat interface.
 */
export default function Messenger({ setIsChatFocused }) {
  const [messages, setMessages] = useState([]); // State to store messages
  const [newMessage, setNewMessage] = useState(""); // State to store the new message being typed
  const { user } = useUser(); // Get the current user from context
  const messagesEndRef = useRef(null); // Reference to the end of the messages container for scrolling

  // Effect to handle incoming messages
  useEffect(() => {
    const handleMessage = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };
    socketServer.on("newMessage", handleMessage);

    return () => {
      socketServer.off("newMessage", handleMessage);
    };
  }, []);

  // Function to scroll to the bottom of the messages container
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Function to send a message
  const sendMessage = useCallback(() => {
    if (newMessage.trim()) {
      const payload = {
        nickname: user.nickname,
        text: newMessage,
      };
      socketServer.emit("message", payload);
      setNewMessage("");
    }
  }, [newMessage, user.nickname]);

  // Function to handle the "Enter" key for sending messages
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Enter") {
        sendMessage();
      }
    },
    [sendMessage]
  );

  // Function to update the new message state as the user types
  const onWriteMessage = useCallback((event) => {
    setNewMessage(event.target.value);
  }, []);

  return (
    <div className="container-messenger">
      <div className="messages-messenger">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message-messenger ${
              message.nickname === user.nickname
                ? "message-mine"
                : "message-other"
            }`}
          >
            <div className="message-username-messenger">{message.nickname}</div>
            <div className="message-text-messenger">{message.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-send-container">
        <input
          className="input-messenger"
          value={newMessage}
          onChange={onWriteMessage}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsChatFocused(true)}
          onBlur={() => setIsChatFocused(false)}
          placeholder="Escribe algo..."
        />
        <div className="send-messenger">
          <button onClick={sendMessage} disabled={!newMessage.trim()}>
            <BiSend className="icon-messenger" />
          </button>
        </div>
      </div>
    </div>
  );
}
