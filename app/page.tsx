import React from "react";
import "./whatsapp.css";

export default function WhatsAppLayout() {
  return (
    <div className="app">
      
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="profile">
            <img src="https://i.pravatar.cc/40" alt="profile" />
            <h3>Il Tuo Nome</h3>
          </div>
        </div>

        <div className="search-box">
          <input type="text" placeholder="Cerca o inizia una nuova chat" />
        </div>

        <div className="chat-list">
          {[1,2,3,4,5].map((chat) => (
            <div key={chat} className="chat-item">
              <img src={`https://i.pravatar.cc/40?img=${chat}`} alt="avatar" />
              <div className="chat-info">
                <h4>Contatto {chat}</h4>
                <p>Ultimo messaggio...</p>
              </div>
              <span className="time">12:3{chat}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* CHAT AREA */}
      <main className="chat">
        <div className="chat-header">
          <img src="https://i.pravatar.cc/40?img=8" alt="avatar" />
          <h3>Contatto 1</h3>
        </div>

        <div className="chat-messages">
          <div className="message received">
            Ciao! Come stai?
          </div>
          <div className="message sent">
            Tutto bene 😄 E tu?
          </div>
          <div className="message received">
            Benissimo!
          </div>
        </div>

        <div className="chat-input">
          <input type="text" placeholder="Scrivi un messaggio" />
          <button>Invia</button>
        </div>
      </main>

    </div>
  );
}