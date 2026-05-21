"use client";

import { useEffect, useState, useRef } from "react";
import { privateChatAPI, groupsAPI } from "@/lib/api";
import { Send, Paperclip, Smile, Phone, MoreVertical } from "lucide-react";

interface ChatWindowProps {
  chat: any;
  token: string;
  currentUserId: number;
}

export default function ChatWindow({
  chat,
  token,
  currentUserId,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadMessages();

    const interval = setInterval(loadMessages, 2000);

    return () => clearInterval(interval);
  }, [chat]);

  const loadMessages = async () => {
    try {
      setIsLoading(true);

      let result;

      if (chat.type === "private") {
        result = await privateChatAPI.getMessages(token, chat.id);
      } else {
        result = await groupsAPI.getMessages(token, chat.id);
      }

      if (result.success) {
        setMessages(result.messages);
      }
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageInput.trim()) return;

    const content = messageInput;

    setMessageInput("");

    try {
      let result;

      if (chat.type === "private") {
        result = await privateChatAPI.sendMessage(
          token,
          chat.id,
          content,
          "text",
        );
      } else {
        result = await groupsAPI.sendMessage(token, chat.id, content, "text");
      }

      if (result.success) {
        await loadMessages();
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      setMessageInput(content);
    }
  };

  return (
    <main className="flex-1 h-full min-h-0 flex flex-col bg-[#0b141a]">
      {/* HEADER */}
      <div className="h-[60px] px-4 bg-[#202c33] border-b border-[#2a3942] flex items-center justify-between">
        <div className="flex items-center gap-3">
          {chat.type === "private" ? (
            <img
              src={chat.otherUserProfilePicture || "https://i.pravatar.cc/150"}
              alt={chat.otherUsername}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div
              className="
              w-10
              h-10
              rounded-full
              bg-[#00a884]
              flex
              items-center
              justify-center
              text-black
              font-bold
            "
            >
              {chat.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <h3 className="text-[#e9edef] text-sm font-medium">
              {chat.type === "private" ? chat.otherUsername : chat.name}
            </h3>

            <p className="text-xs text-[#8696a0]">
              {chat.type === "private" ? chat.otherUserStatus : "Gruppo"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-5 text-[#aebac1]">
          <Phone size={20} className="cursor-pointer" />
          <MoreVertical size={20} className="cursor-pointer" />
        </div>
      </div>

      {/* MESSAGES */}
      <div
        className="
        flex-1
        min-h-0
        overflow-y-auto
        px-16
        py-6
        flex
        flex-col
        gap-2
        "
        style={{
          backgroundImage: "url('https://i.imgur.com/6uNtNAC.jpeg')",
        }}
      >
        {messages.map((msg) => {
          const isMine = msg.sender_id === currentUserId;

          return (
            <div
              key={msg.id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`
                  max-w-[65%]
                  px-3
                  py-2
                  rounded-lg
                  shadow-sm
                  text-sm
                  relative
                  ${
                    isMine
                      ? "bg-[#005c4b] text-[#e9edef]"
                      : "bg-[#202c33] text-[#e9edef]"
                  }
                `}
              >
                {!isMine && chat.type === "group" && (
                  <p className="text-xs text-[#53bdeb] mb-1 font-medium">
                    {msg.username}
                  </p>
                )}

                <p className="break-words">{msg.content}</p>

                <div
                  className="
                  flex
                  justify-end
                  items-center
                  gap-1
                  mt-1
                "
                >
                  <span className="text-[11px] text-[#8696a0]">
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="px-4 py-3 bg-[#202c33]">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Scrivi un messaggio"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            className="
              flex-1
              bg-[#2a3942]
              h-11
              rounded-lg
              px-4
              text-sm
              text-white
              outline-none
              placeholder:text-[#8696a0]
            "
          />

          <button
            type="submit"
            disabled={!messageInput.trim()}
            className="
              w-11
              h-11
              rounded-full
              bg-[#00a884]
              hover:bg-[#06cf9c]
              disabled:opacity-50
              flex
              items-center
              justify-center
              transition
            "
          >
            <Send size={18} className="text-black" />
          </button>
        </form>
      </div>
    </main>
  );
}
