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
    <aside className="h-full flex flex-col bg-[#111b21] text-white">
      {/* HEADER */}
      <div className="h-[60px] px-4 bg-[#202c33] flex items-center justify-between border-b border-[#2a3942]">
        <div className="flex items-center gap-3">
          <img
            src={user?.profile_picture || "https://i.pravatar.cc/150"}
            alt="profile"
            className="w-10 h-10 rounded-full object-cover"
          />

          <div>
            <h3 className="text-sm font-medium text-[#e9edef]">
              {user?.username}
            </h3>

            <p className="text-xs text-[#8696a0]">
              {user?.status === "online" ? "online" : "offline"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onShowSearch}
            className="text-[#aebac1] hover:text-white transition"
          >
            <MessageSquarePlus size={20} />
          </button>

          <button
            onClick={onLogout}
            className="text-[#aebac1] hover:text-red-400 transition"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <div className="p-3 bg-[#111b21] border-b border-[#222e35]">
        <div className="bg-[#202c33] rounded-lg px-4 h-10 flex items-center gap-3">
          <Search size={18} className="text-[#8696a0]" />

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
              text-[#e9edef]
              placeholder:text-[#8696a0]
            "
          />
        </div>
      </div>

      {/* SEARCH RESULTS */}
      {showSearch && searchResults.length > 0 && (
        <div className="border-b border-[#222e35] bg-[#111b21]">
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
                hover:bg-[#202c33]
                cursor-pointer
                transition
              "
            >
              <img
                src={user.profile_picture || "https://i.pravatar.cc/150"}
                alt={user.username}
                className="w-12 h-12 rounded-full object-cover"
              />

              <div className="flex-1 border-b border-[#222e35] pb-3">
                <h4 className="text-sm text-[#e9edef] font-medium">
                  {user.username}
                </h4>

                <p className="text-xs text-[#8696a0]">{user.status}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TABS */}
      <div className="flex border-b border-[#222e35] bg-[#111b21]">
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
            transition
            ${
              tab === "chats"
                ? "text-[#00a884] border-b-2 border-[#00a884]"
                : "text-[#8696a0]"
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
            transition
            ${
              tab === "groups"
                ? "text-[#00a884] border-b-2 border-[#00a884]"
                : "text-[#8696a0]"
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
                border-[#222e35]
                hover:bg-[#202c33]
                ${selectedChat?.id === chat.id ? "bg-[#2a3942]" : ""}
              `}
            >
              <img
                src={
                  chat.otherUserProfilePicture || "https://i.pravatar.cc/150"
                }
                alt={chat.otherUsername}
                className="w-12 h-12 rounded-full object-cover"
              />

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h4 className="text-[#e9edef] text-sm truncate">
                    {chat.otherUsername}
                  </h4>

                  <span className="text-[11px] text-[#8696a0]">12:45</span>
                </div>

                <p className="text-xs text-[#8696a0] truncate mt-1">
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
                  border-[#222e35]
                  hover:bg-[#202c33]
                  ${selectedChat?.id === group.id ? "bg-[#2a3942]" : ""}
                `}
              >
                <div
                  className="
                  w-12
                  h-12
                  rounded-full
                  bg-[#00a884]
                  flex
                  items-center
                  justify-center
                  text-black
                  font-bold
                "
                >
                  {group.name.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1">
                  <h4 className="text-sm text-[#e9edef]">{group.name}</h4>

                  <p className="text-xs text-[#8696a0] mt-1">
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
                  bg-[#00a884]
                  hover:bg-[#06cf9c]
                  text-black
                  font-medium
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
