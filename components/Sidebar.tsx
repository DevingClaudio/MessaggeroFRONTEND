"use client";

import { useState } from "react";
import {
  Search,
  MessageSquarePlus,
  LogOut,
  Users,
  MessagesSquare,
} from "lucide-react";

interface SidebarProps {
  user: any;
  chats: any[];
  groups: any[];
  selectedChat: any;
  onSelectChat: (chat: any) => void;
  onShowCreateGroup: () => void;
  onShowSearch: () => void;
  onLogout: () => void;
  searchUsers: string;
  onSearchUsers: (query: string) => void;
  searchResults: any[];
  onStartChat: (userId: number) => void;
  showSearch: boolean;
}

export default function Sidebar({
  user,
  chats,
  groups,
  selectedChat,
  onSelectChat,
  onShowCreateGroup,
  onShowSearch,
  onLogout,
  searchUsers,
  onSearchUsers,
  searchResults,
  onStartChat,
  showSearch,
}: SidebarProps) {
  const [tab, setTab] = useState<"chats" | "groups">("chats");

  return (
    <aside className="h-full flex flex-col bg-white text-gray-800">
      {/* HEADER */}
      <div className="h-16 px-4 bg-white border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={
              user?.profile_picture ||
              "https://www.pngarts.com/files/10/Default-Profile-Picture-Download-PNG-Image.png"
            }
            alt="profile"
            className="w-10 h-10 rounded-full object-cover"
          />

          <div>
            <h3 className="text-sm font-semibold text-gray-800">
              {user?.username}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onShowSearch}
            className="text-gray-600 hover:text-green-600 transition"
          >
            <MessageSquarePlus size={20} />
          </button>

          <button
            onClick={onLogout}
            className="text-gray-600 hover:text-red-500 transition"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <div className="p-3 bg-white border-b border-gray-200">
        <div className="bg-gray-100 rounded-lg px-4 h-10 flex items-center gap-3">
          <Search size={18} className="text-gray-500" />

          <input
            type="text"
            placeholder={
              showSearch ? "Cerca utenti..." : "Cerca o inizia una nuova chat"
            }
            value={searchUsers}
            onChange={(e) => onSearchUsers(e.target.value)}
            onClick={onShowSearch}
            className="
              bg-transparent
              flex-1
              outline-none
              text-sm
              text-gray-800
              placeholder:text-gray-400
            "
          />
        </div>
      </div>

      {/* SEARCH RESULTS */}
      {showSearch && searchResults.length > 0 && (
        <div className="border-b border-gray-200 bg-white">
          {searchResults.map((user) => (
            <div
              key={user.id}
              onClick={() => onStartChat(user.id)}
              className="
                flex
                items-center
                gap-3
                px-4
                py-3
                hover:bg-gray-50
                cursor-pointer
                transition
                border-b
                border-gray-100
              "
            >
              <img
                src={
                  user.profile_picture ||
                  "https://www.pngarts.com/files/10/Default-Profile-Picture-Download-PNG-Image.png"
                }
                alt={user.username}
                className="w-12 h-12 rounded-full object-cover"
              />

              <div className="flex-1">
                <h4 className="text-sm text-gray-800 font-medium">
                  {user.username}
                </h4>

                <p className="text-xs text-gray-500 mt-1">{user.status}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TABS */}
      <div className="flex border-b border-gray-200 bg-white">
        <button
          onClick={() => setTab("chats")}
          className={`
            flex-1
            h-12
            flex
            items-center
            justify-center
            gap-2
            text-sm
            font-medium
            transition
            ${
              tab === "chats"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-600"
            }
          `}
        >
          <MessagesSquare size={18} />
          Chat
        </button>

        <button
          onClick={() => setTab("groups")}
          className={`
            flex-1
            h-12
            flex
            items-center
            justify-center
            gap-2
            text-sm
            font-medium
            transition
            ${
              tab === "groups"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-600"
            }
          `}
        >
          <Users size={18} />
          Gruppi
        </button>
      </div>

      {/* LIST */}
      <div className="flex-1 overflow-y-auto">
        {tab === "chats" ? (
          chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat({ ...chat, type: "private" })}
              className={`
                flex
                items-center
                gap-3
                px-4
                py-3
                cursor-pointer
                transition
                border-b
                border-gray-100
                hover:bg-gray-50
                ${selectedChat?.id === chat.id ? "bg-gray-100" : ""}
              `}
            >
              <img
                src={
                  chat.otherUserProfilePicture ||
                  "https://www.pngarts.com/files/10/Default-Profile-Picture-Download-PNG-Image.png"
                }
                alt={chat.otherUsername}
                className="w-12 h-12 rounded-full object-cover"
              />

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h4 className="text-gray-800 text-sm truncate font-medium">
                    {chat.otherUsername}
                  </h4>

                  <span className="text-xs text-gray-400">12:45</span>
                </div>

                <p className="text-xs text-gray-500 truncate mt-1">
                  {chat.otherUserStatus}
                </p>
              </div>
            </div>
          ))
        ) : (
          <>
            {groups.map((group) => (
              <div
                key={group.id}
                onClick={() => onSelectChat({ ...group, type: "group" })}
                className={`
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  cursor-pointer
                  transition
                  border-b
                  border-gray-100
                  hover:bg-gray-50
                  ${selectedChat?.id === group.id ? "bg-gray-100" : ""}
                `}
              >
                <div
                  className="
                  w-12
                  h-12
                  rounded-full
                  bg-green-600
                  flex
                  items-center
                  justify-center
                  text-white
                  font-bold
                  text-lg
                "
                >
                  {group.name.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1">
                  <h4 className="text-sm text-gray-800 font-medium">
                    {group.name}
                  </h4>

                  <p className="text-xs text-gray-500 mt-1">
                    {group.memberCount} membri
                  </p>
                </div>
              </div>
            ))}

            <div className="p-4">
              <button
                onClick={onShowCreateGroup}
                className="
                  w-full
                  bg-green-600
                  hover:bg-green-700
                  text-white
                  font-semibold
                  py-3
                  rounded-lg
                  transition
                "
              >
                + Nuovo gruppo
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
