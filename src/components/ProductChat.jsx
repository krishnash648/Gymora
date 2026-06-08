import "../App.css";

function ProductChat({ messages, message, handleMessageChange, sendMessage }) {
  return (
    <div className="buyer-chat-box">
      {/* CHAT HEADER */}
      <div className="buyer-chat-header">
        <h3>Message Seller</h3>

        <span>Usually replies within few minutes</span>
      </div>

      {/* CHAT MESSAGES */}
      <div className="buyer-chat-messages">
        {/* EMPTY MESSAGE */}
        {messages.length === 0 && (
          <div className="admin-message-preview">Hey, How can we help you?</div>
        )}

        {/* MESSAGES */}
        {messages.map((messageItem) => {
          return (
            <div
              key={messageItem.id}
              className={
                messageItem.sender === "buyer"
                  ? "buyer-message-preview"
                  : "admin-message-preview"
              }
            >
              {messageItem.text}
            </div>
          );
        })}
      </div>

      {/* CHAT INPUT */}
      <div className="buyer-chat-input">
        <textarea
          placeholder="Write your message..."
          value={message}
          onChange={handleMessageChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();

              sendMessage();
            }
          }}
        />

        {/* SEND BUTTON */}
        <button onClick={sendMessage} disabled={!message?.trim()}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ProductChat;
