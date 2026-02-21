import React from "react";

export default function WhatsAppLayout() {
  return (
    <div className="flex h-screen bg-[#e5ddd5]">
      {/* SIDEBAR */}
      <aside className="w-1/3 bg-white flex flex-col border-r border-gray-200">
        {/* Header */}
        <div className="p-4 bg-gray-100 flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/40"
            alt="profile"
            className="w-10 h-10 rounded-full"
          />
          <h3 className="font-semibold">Il Tuo Nome</h3>
        </div>

        {/* Search */}
        <div className="p-3 bg-gray-50">
          <input
            type="text"
            placeholder="Cerca o inizia una nuova chat"
            className="w-full px-4 py-2 text-sm bg-white rounded-full outline-none border border-gray-200 focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {[1, 2, 3, 4, 5].map((chat) => (
            <div
              key={chat}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer transition"
            >
              <img
                src={`https://i.pravatar.cc/40?img=${chat}`}
                alt="avatar"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <h4 className="text-sm font-medium">Contatto {chat}</h4>
                <p className="text-xs text-gray-500 truncate">
                  Ultimo messaggio...
                </p>
              </div>
              <span className="text-xs text-gray-400">12:3{chat}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* CHAT AREA */}
      <main className="w-2/3 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 bg-gray-100 flex items-center gap-3 border-b border-gray-200">
          <img
            src="https://i.pravatar.cc/40?img=8"
            alt="avatar"
            className="w-10 h-10 rounded-full"
          />
          <h3 className="font-semibold">Contatto 1</h3>
        </div>

        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-3">
          <div className="self-start bg-white px-4 py-2 rounded-lg text-sm shadow-sm max-w-xs">
            Ciao! Come stai?
          </div>

          <div className="self-end bg-green-200 px-4 py-2 rounded-lg text-sm shadow-sm max-w-xs">
            Tutto bene 😄 E tu?
          </div>

          <div className="self-start bg-white px-4 py-2 rounded-lg text-sm shadow-sm max-w-xs">
            Benissimo!
          </div>
        </div>

        {/* Input */}
        <div className="p-4 bg-gray-100 flex items-center gap-3">
          <input
            type="text"
            placeholder="Scrivi un messaggio"
            className="flex-1 px-4 py-2 rounded-full border border-gray-300 outline-none focus:ring-2 focus:ring-green-400"
          />
          <button className="bg-green-500 text-white px-5 py-2 rounded-full hover:bg-green-600 transition">
            Invia
          </button>
        </div>
      </main>
    </div>
  );
}
