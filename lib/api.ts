const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// Auth API calls
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  register: async (email: string, username: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, username, password }),
    });
    return response.json();
  },

  getMe: async (token: string) => {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },
};

// Users API calls
export const usersAPI = {
  search: async (query: string) => {
    const response = await fetch(
      `${API_URL}/users/search?query=${encodeURIComponent(query)}`,
    );
    return response.json();
  },

  getProfile: async (userId: number) => {
    const response = await fetch(`${API_URL}/users/${userId}`);
    return response.json();
  },

  updateProfile: async (token: string, userId: number, data: any) => {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};

// Private Chats API calls
export const privateChatAPI = {
  getOrCreate: async (token: string, otherUserId: number) => {
    const response = await fetch(`${API_URL}/private-chats`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ otherUserId }),
    });
    return response.json();
  },

  getAll: async (token: string) => {
    const response = await fetch(`${API_URL}/private-chats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },

  getMessages: async (token: string, chatId: number) => {
    const response = await fetch(
      `${API_URL}/private-chats/${chatId}/messages`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.json();
  },

  sendMessage: async (
    token: string,
    chatId: number,
    content: string,
    messageType: string = "text",
    fileUrl?: string,
  ) => {
    const response = await fetch(
      `${API_URL}/private-chats/${chatId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content, messageType, fileUrl }),
      },
    );
    return response.json();
  },
};

// Groups API calls
export const groupsAPI = {
  create: async (token: string, name: string, description: string) => {
    const response = await fetch(`${API_URL}/groups`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, description }),
    });
    return response.json();
  },

  getAll: async (token: string) => {
    const response = await fetch(`${API_URL}/groups`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },

  getDetails: async (token: string, groupId: number) => {
    const response = await fetch(`${API_URL}/groups/${groupId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },

  addMember: async (token: string, groupId: number, userId: number) => {
    const response = await fetch(`${API_URL}/groups/${groupId}/members`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId }),
    });
    return response.json();
  },

  getMessages: async (token: string, groupId: number) => {
    const response = await fetch(`${API_URL}/groups/${groupId}/messages`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },

  sendMessage: async (
    token: string,
    groupId: number,
    content: string,
    messageType: string = "text",
    fileUrl?: string,
  ) => {
    const response = await fetch(`${API_URL}/groups/${groupId}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content, messageType, fileUrl }),
    });
    return response.json();
  },
};
