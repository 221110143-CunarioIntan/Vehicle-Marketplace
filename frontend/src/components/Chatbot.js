import React, { useState } from "react";

function Chatbot() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const newChat = [...chat, { sender: "user", text: message }];
    setChat(newChat);
    setMessage("");

    try {
      console.log("📤 Mengirim pesan ke server:", message);
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      console.log("📥 Respons dari server:", data);

      if (data.reply) {
        setChat([...newChat, { sender: "ai", text: data.reply }]);
      } else {
        setChat([
          ...newChat,
          { sender: "ai", text: "⚠️ Gagal mendapatkan respons dari AI." },
        ]);
      }
    } catch (error) {
      console.error("Error:", error);
      setChat([
        ...newChat,
        { sender: "ai", text: "❌ Tidak dapat terhubung ke server AI." },
      ]);
    }
  };

  return (
    <div style={{ width: "400px", margin: "auto", padding: "20px" }}>
      <h3>Asisten Marketplace</h3>
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "10px",
          height: "300px",
          overflowY: "auto",
        }}
      >
        {chat.map((msg, i) => (
          <div key={i} style={{ margin: "10px 0" }}>
            <strong>{msg.sender === "user" ? "Anda" : "AI"}:</strong>{" "}
            {msg.text}
          </div>
        ))}
      </div>

      <div style={{ marginTop: "10px" }}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tulis pesan..."
          style={{ width: "70%", padding: "8px" }}
        />
        <button onClick={handleSend} style={{ marginLeft: "5px" }}>
          Kirim
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
