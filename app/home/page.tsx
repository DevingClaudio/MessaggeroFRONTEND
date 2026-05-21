"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { auth } from "@/lib/storage";
import { privateChatAPI, groupsAPI, usersAPI } from "@/lib/api";
import ChatWindow from "@/components/ChatWindow";
import Sidebar from "@/components/Sidebar";

export default function HomePage() {
  const router = useRouter();
  const { user, token, loading } = useAuth();

  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [chats, setChats] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);

  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");

  const [searchUsers, setSearchUsers] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    if (!loading && !token) {
      router.push("/");
    }
  }, [loading, token, router]);

  useEffect(() => {
    if (token) {
      loadChats();
      loadGroups();
    }
  }, [token]);

  const loadChats = async () => {
    try {
      const result = await privateChatAPI.getAll(token!);

      if (result.success) {
        setChats(result.chats);
      }
    } catch (err) {
      console.error("Failed to load chats:", err);
    }
  };

  const loadGroups = async () => {
    try {
      const result = await groupsAPI.getAll(token!);

      if (result.success) {
        setGroups(result.groups);
      }
    } catch (err) {
      console.error("Failed to load groups:", err);
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;

    try {
      const result = await groupsAPI.create(
        token!,
        newGroupName,
        newGroupDescription,
      );

      if (result.success) {
        setNewGroupName("");
        setNewGroupDescription("");
        setShowCreateGroup(false);

        await loadGroups();
      }
    } catch (err) {
      console.error("Failed to create group:", err);
    }
  };

  const handleSearchUsers = async (query: string) => {
    setSearchUsers(query);

    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const result = await usersAPI.search(query);

      if (result.success) {
        setSearchResults(result.users);
      }
    } catch (err) {
      console.error("Failed to search users:", err);
    }
  };

  const handleStartChat = async (otherUserId: number) => {
    try {
      const result = await privateChatAPI.getOrCreate(token!, otherUserId);

      if (result.success) {
        setShowSearch(false);
        setSearchUsers("");

        await loadChats();
      }
    } catch (err) {
      console.error("Failed to start chat:", err);
    }
  };

  const handleLogout = () => {
    auth.removeToken();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#111b21]">
        <div className="text-white text-lg animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#0b141a] overflow-hidden">
      {/* top green bar */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-[#00a884]" />

      {/* main container */}
      <div className="relative z-10 h-screen p-4">
        <div className="h-full w-full bg-[#111b21] rounded-xl overflow-hidden shadow-2xl flex border border-[#222e35]">
          {/* SIDEBAR */}
          <div className="w-[420px] min-w-[420px] border-r border-[#222e35] bg-[#111b21]">
            <Sidebar
              user={user}
              chats={chats}
              groups={groups}
              selectedChat={selectedChat}
              onSelectChat={setSelectedChat}
              onShowCreateGroup={() => setShowCreateGroup(true)}
              onShowSearch={() => setShowSearch(true)}
              onLogout={handleLogout}
              searchUsers={searchUsers}
              onSearchUsers={handleSearchUsers}
              searchResults={searchResults}
              onStartChat={handleStartChat}
              showSearch={showSearch}
            />
          </div>

          {/* CHAT AREA */}
          <div className="flex-1 bg-[#0b141a] relative">
            {selectedChat ? (
              <ChatWindow
                chat={selectedChat}
                token={token!}
                currentUserId={user?.id!}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center px-8 bg-[#222e35]">
                <div className="w-80 h-80 rounded-full bg-[#111b21] flex items-center justify-center mb-8 shadow-inner">
                  <div className="text-[120px] opacity-80">💬</div>
                </div>

                <h1 className="text-4xl font-light text-[#e9edef] mb-4">
                  Messaggero Web
                </h1>

                <p className="text-[#8696a0] max-w-md leading-relaxed text-lg">
                  Invia e ricevi messaggi senza tenere il telefono connesso.
                  Seleziona una conversazione per iniziare.
                </p>

                <div className="mt-10 text-sm text-[#667781]">
                  End-to-end encrypted
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CREATE GROUP MODAL */}
      {showCreateGroup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#202c33] w-[420px] rounded-xl shadow-2xl overflow-hidden border border-[#2f3b43]">
            <div className="px-6 py-5 border-b border-[#2f3b43]">
              <h3 className="text-xl text-white font-medium">Nuovo gruppo</h3>
            </div>

            <div className="p-6">
              <input
                type="text"
                placeholder="Nome gruppo"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="
                  w-full
                  bg-[#2a3942]
                  text-white
                  px-4
                  py-3
                  rounded-lg
                  border border-transparent
                  focus:border-[#00a884]
                  focus:outline-none
                  mb-4
                  placeholder:text-[#8696a0]
                "
              />

              <textarea
                placeholder="Descrizione"
                value={newGroupDescription}
                onChange={(e) => setNewGroupDescription(e.target.value)}
                rows={4}
                className="
                  w-full
                  bg-[#2a3942]
                  text-white
                  px-4
                  py-3
                  rounded-lg
                  border border-transparent
                  focus:border-[#00a884]
                  focus:outline-none
                  mb-6
                  resize-none
                  placeholder:text-[#8696a0]
                "
              />

              <div className="flex gap-3">
                <button
                  onClick={handleCreateGroup}
                  className="
                    flex-1
                    bg-[#00a884]
                    hover:bg-[#06cf9c]
                    text-black
                    font-medium
                    py-3
                    rounded-lg
                    transition
                  "
                >
                  Crea gruppo
                </button>

                <button
                  onClick={() => {
                    setShowCreateGroup(false);
                    setNewGroupName("");
                    setNewGroupDescription("");
                  }}
                  className="
                    flex-1
                    bg-[#2a3942]
                    hover:bg-[#374248]
                    text-white
                    py-3
                    rounded-lg
                    transition
                  "
                >
                  Annulla
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
