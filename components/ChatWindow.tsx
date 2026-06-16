"use client";

import { useEffect, useState, useRef } from "react";
import { privateChatAPI, groupsAPI } from "@/lib/api";
import { Send, Paperclip, Smile, MoreVertical } from "lucide-react";
import GroupSettings from "./GroupSettings";

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
  const [showGroupSettings, setShowGroupSettings] = useState(false);
  const [groupDetails, setGroupDetails] = useState<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    //scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadMessages();

    const interval = setInterval(loadMessages, 2000);

    return () => clearInterval(interval);
  }, [chat]);

  useEffect(() => {
    // Load group details if it's a group chat
    if (chat.type === "group") {
      loadGroupDetails();
    }
  }, [chat]);

  const loadGroupDetails = async () => {
    try {
      const result = await groupsAPI.getDetails(token, chat.id);
      if (result.success) {
        setGroupDetails(result);
      }
    } catch (err) {
      console.error("Failed to load group details:", err);
    }
  };

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
    <main className="flex-1 h-full min-h-0 flex flex-col bg-white">
      {/* HEADER */}
      <div className="h-16 px-4 bg-white border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {chat.type === "private" ? (
            <img
              src={
                chat.otherUserProfilePicture ||
                "https://www.pngarts.com/files/10/Default-Profile-Picture-Download-PNG-Image.png"
              }
              alt={chat.otherUsername}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div
              className="
              w-10
              h-10
              rounded-full
              bg-green-600
              flex
              items-center
              justify-center
              text-white
              font-bold
            "
            >
              {chat.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <h3 className="text-gray-800 text-sm font-semibold">
              {chat.type === "private" ? chat.otherUsername : chat.name}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-5 text-gray-600">
          {chat.type === "group" && (
            <button
              onClick={() => setShowGroupSettings(true)}
              className="hover:text-green-600 transition"
              title="Gestisci membri"
            >
              <MoreVertical size={20} />
            </button>
          )}
          {chat.type === "private" && (
            <MoreVertical size={20} className="cursor-pointer" />
          )}
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
        gap-3
        bg-gradient-to-b from-gray-50 to-gray-100
        "
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
                  px-4
                  py-2
                  rounded-2xl
                  shadow-md
                  text-sm
                  relative
                  ${
                    isMine
                      ? "bg-green-600 text-white rounded-bl-none"
                      : "bg-gray-300 text-gray-800 rounded-br-none"
                  }
                `}
              >
                {!isMine && chat.type === "group" && (
                  <p className="text-xs text-blue-700 mb-1 font-semibold">
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
                  mt-2
                "
                >
                  <span
                    className={`text-xs ${
                      isMine ? "text-green-100" : "text-gray-600"
                    }`}
                  >
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
      <div className="px-4 py-3 bg-white border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Scrivi un messaggio"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            className="
              flex-1
              bg-gray-100
              h-11
              rounded-lg
              px-4
              text-sm
              text-gray-800
              outline-none
              placeholder:text-gray-400
            "
          />

          <button
            type="submit"
            disabled={!messageInput.trim()}
            className="
              w-11
              h-11
              rounded-full
              bg-green-600
              hover:bg-green-700
              disabled:opacity-50
              flex
              items-center
              justify-center
              transition
            "
          >
            <Send size={18} className="text-white" />
          </button>
        </form>
      </div>

      {/* GROUP SETTINGS MODAL */}
      {showGroupSettings && groupDetails && (
        <GroupSettings
          groupId={chat.id}
          groupName={chat.name}
          members={groupDetails.members}
          token={token}
          onClose={() => setShowGroupSettings(false)}
          onMemberAdded={() => loadGroupDetails()}
        />
      )}
    </main>
  );
}
