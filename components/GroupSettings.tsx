"use client";

import { useState } from "react";
import { groupsAPI, usersAPI } from "@/lib/api";
import { X, Plus, Users } from "lucide-react";

interface GroupSettingsProps {
  groupId: number;
  groupName: string;
  members: any[];
  token: string;
  onClose: () => void;
  onMemberAdded: () => void;
}

export default function GroupSettings({
  groupId,
  groupName,
  members,
  token,
  onClose,
  onMemberAdded,
}: GroupSettingsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setError("");

    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const result = await usersAPI.search(query);

      if (result.success) {
        // Filter out members already in the group
        const memberIds = members.map((m) => m.id);
        const filtered = result.users.filter(
          (u: any) => !memberIds.includes(u.id),
        );
        setSearchResults(filtered);
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Errore nella ricerca utenti");
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddMember = async (userId: number) => {
    try {
      setIsAdding(true);
      setError("");
      const result = await groupsAPI.addMember(token, groupId, userId);

      if (result.success) {
        setSuccess("Membro aggiunto con successo!");
        setSearchQuery("");
        setSearchResults([]);
        setTimeout(() => {
          setSuccess("");
          onMemberAdded();
        }, 1500);
      } else {
        setError(result.error || "Errore nell'aggiunta del membro");
      }
    } catch (err) {
      console.error("Add member error:", err);
      setError("Errore nell'aggiunta del membro");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto shadow-lg border border-gray-200">
        {/* HEADER */}
        <div className="sticky top-0 bg-white px-4 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-gray-800 font-semibold text-lg">
            {groupName} - Gestione Membri
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* SEARCH SECTION */}
          <div>
            <h3 className="text-gray-800 font-medium mb-3 flex items-center gap-2">
              <Plus size={18} />
              Aggiungi Membro
            </h3>
            <input
              type="text"
              placeholder="Cerca utente..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-600 transition"
            />

            {error && (
              <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-2 p-2 bg-green-100 border border-green-300 rounded text-green-700 text-sm">
                {success}
              </div>
            )}

            {/* SEARCH RESULTS */}
            {searchResults.length > 0 && (
              <div className="mt-3 space-y-2">
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition"
                  >
                    <div>
                      <p className="text-gray-800 font-medium">
                        {user.username}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {user.status === "online" ? "Online" : "Offline"}
                      </p>
                    </div>
                    <button
                      onClick={() => handleAddMember(user.id)}
                      disabled={isAdding}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg transition disabled:opacity-50 flex items-center gap-2"
                    >
                      <Plus size={16} />
                      Aggiungi
                    </button>
                  </div>
                ))}
              </div>
            )}

            {searchQuery.length >= 2 &&
              searchResults.length === 0 &&
              !isSearching && (
                <p className="mt-3 text-gray-500 text-sm">
                  Nessun utente trovato o già membro del gruppo
                </p>
              )}
          </div>

          {/* MEMBERS LIST */}
          <div>
            <h3 className="text-gray-800 font-medium mb-3 flex items-center gap-2">
              <Users size={18} />
              Membri ({members.length})
            </h3>
            <div className="space-y-2">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">
                      {member.username}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {member.role === "admin" ? "Amministratore" : "Membro"}
                    </p>
                  </div>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      member.status === "online"
                        ? "bg-green-500"
                        : "bg-gray-400"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
