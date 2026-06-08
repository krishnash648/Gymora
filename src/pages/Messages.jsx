import "../App.css";

import { useEffect, useState } from "react";

import {
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase-config";

function Messages() {
  // states
  const [conversations, setConversations] = useState([]);

  const [selectedChat, setSelectedChat] = useState(null);

  const [chatMessages, setChatMessages] = useState([]);

  const [messageText, setMessageText] = useState("");

  // get conversations
  useEffect(() => {
    const conversationRef = collection(db, "conversations");

    const unsubscribe = onSnapshot(conversationRef, (snapshot) => {
      const finalData = snapshot.docs.map((conversationDoc) => {
        return {
          id: conversationDoc.id,
          ...conversationDoc.data(),
        };
      });

      setConversations(finalData);

      // auto select first chat
      if (!selectedChat && finalData.length > 0) {
        setSelectedChat(finalData[0].id);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // get messages
  useEffect(() => {
    if (!selectedChat) {
      return;
    }

    const messagesRef = query(
      collection(db, "conversations", selectedChat, "messages"),

      orderBy("createdAt", "asc"),
    );

    const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
      const finalMessages = snapshot.docs.map((messageDoc) => {
        return {
          id: messageDoc.id,
          ...messageDoc.data(),
        };
      });

      setChatMessages(finalMessages);
    });

    return () => {
      unsubscribe();
    };
  }, [selectedChat]);

  // send message
  const sendReply = async () => {
    if (!messageText.trim()) {
      return;
    }

    try {
      // add message
      await addDoc(
        collection(db, "conversations", selectedChat, "messages"),

        {
          sender: "admin",
          text: messageText,
          createdAt: serverTimestamp(),
        },
      );

      // update last message
      await updateDoc(
        doc(db, "conversations", selectedChat),

        {
          lastMessage: messageText,
          lastUpdated: serverTimestamp(),
        },
      );

      setMessageText("");
    } catch (error) {
      console.log(error.message);
    }
  };

  // selected chat data
  const currentChat = conversations.find((chat) => {
    return chat.id === selectedChat;
  });

  return (
    <div className="messages-page">
      {/* Top Section */}
      <div className="messages-top">
        <div>
          <h1>Customer Chats</h1>

          <span>Manage customer conversations</span>
        </div>

        <p>{conversations.length} Conversations</p>
      </div>

      {/* Main Layout */}
      <div className="messages-layout">
        {/* Sidebar */}
        <div className="chat-sidebar">
          {conversations.map((chat) => {
            return (
              <div
                key={chat.id}
                className={`chat-user ${
                  selectedChat === chat.id ? "active-chat" : ""
                }`}
                onClick={() => {
                  setSelectedChat(chat.id);
                }}
              >
                <div className="chat-user-info">
                  <h3>{chat.buyerName}</h3>

                  <p>{chat.lastMessage}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Chat Window */}
        <div className="chat-window">
          {currentChat ? (
            <>
              {/* Header */}
              <div className="chat-header">
                <div className="chat-header-left">
                  <div>
                    <h2>{currentChat.buyerName}</h2>

                    <span>Customer</span>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="chat-messages">
                {chatMessages.map((message) => {
                  return (
                    <div
                      key={message.id}
                      className={`chat-row ${
                        message.sender === "admin" ? "admin-row" : "buyer-row"
                      }`}
                    >
                      <div
                        className={`chat-bubble ${
                          message.sender === "admin"
                            ? "admin-bubble"
                            : "buyer-bubble"
                        }`}
                      >
                        <p>{message.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input */}
              <div className="chat-input-box">
                <textarea
                  placeholder="Write your message..."
                  value={messageText}
                  onChange={(e) => {
                    setMessageText(e.target.value);
                  }}
                />

                <button onClick={sendReply}>Send</button>
              </div>
            </>
          ) : (
            <div className="empty-chat">
              <h2>No Conversation Selected</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Messages;
