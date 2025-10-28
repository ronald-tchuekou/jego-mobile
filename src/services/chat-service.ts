import { fetchHelper } from "../lib/fetch-helper";
import { objectToQueryString } from "../lib/utils";
import { UserModel } from "./auth-service";

export enum MessageType {
  TEXT = "text",
  ATTACHMENT = "attachment",
  TEXT_ATTACHMENT = "text_attachment",
}

export type MessageAttachment = {
  id: string;
  messageId: string;
  name: string;
  url: string;
  type: string;
  size: string;
};

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  content: string | null;
  type: MessageType;
  isRead: boolean;
  createdAt: string;
  sender: UserModel;
  attachments: MessageAttachment[];
};

export type Participant = {
  id: string;
  conversationId: string;
  userId: string;
  user: UserModel;
};

export type Conversation = {
  id: string;
  createdAt: string;
  updatedAt: string;
  participants: Participant[];
  messages?: Message[];
};

export type CreateConversationRequest = {
  participantIds: string[];
};

export type SendMessageRequest = {
  conversationId: string;
  content?: string;
  type: MessageType;
  attachments?: Omit<MessageAttachment, "id" | "messageId">[];
};

export type TypingIndicatorRequest = {
  isTyping: boolean;
};

export type MessagesReadRequest = {
  userId: string;
  conversationId: string;
};

const ChatService = {
  // Conversations
  async getConversations(token: string) {
    const { data, error } = await fetchHelper<{
      success: boolean;
      data: Conversation[];
    }>("/chat/conversations", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (error) throw new Error(error);
    return data?.data || [];
  },

  async getConversation(conversationId: string, token: string) {
    const { data, error } = await fetchHelper<{
      success: boolean;
      data: Conversation;
    }>(`/chat/conversations/${conversationId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (error) throw new Error(error);
    return data?.data || null;
  },

  async createConversation(body: CreateConversationRequest, token: string) {
    const { data, error } = await fetchHelper<{
      success: boolean;
      data: Conversation;
    }>("/chat/conversations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    if (error) throw new Error(error);
    return data?.data;
  },

  async getConversationMessages(
    conversationId: string,
    token: string,
    page: number = 1,
    limit: number = 50,
  ) {
    const query = objectToQueryString({ page, limit });
    const { data, error } = await fetchHelper<{
      data: PaginateResponse<Message>;
    }>(`/chat/conversations/${conversationId}/messages?${query}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (error) throw new Error(error);
    return data?.data;
  },

  async markMessagesAsRead(conversationId: string, token: string) {
    const { data, error } = await fetchHelper<{ success: boolean }>(
      `/chat/conversations/${conversationId}/mark-read`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (error) throw new Error(error);
    return data;
  },

  async getUnreadCount(token: string) {
    const { data, error } = await fetchHelper<{
      success: boolean;
      data: { count: number };
    }>("/chat/conversations/unread-count", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (error) throw new Error(error);
    return data?.data?.count || 0;
  },

  async searchMessages(
    query: string,
    token: string,
    page: number = 1,
    limit: number = 20,
  ) {
    const queryParams = objectToQueryString({ query, page, limit });
    const { data, error } = await fetchHelper<{
      data: PaginateResponse<Message>;
    }>(`/chat/conversations/search-messages?${queryParams}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (error) throw new Error(error);
    return data?.data;
  },

  async addParticipant(conversationId: string, userId: string, token: string) {
    const { data, error } = await fetchHelper<{ success: boolean }>(
      `/chat/conversations/${conversationId}/participants`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      },
    );
    if (error) throw new Error(error);
    return data;
  },

  async removeParticipant(
    conversationId: string,
    userId: string,
    token: string,
  ) {
    const { data, error } = await fetchHelper<{ success: boolean }>(
      `/chat/conversations/${conversationId}/participants`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      },
    );
    if (error) throw new Error(error);
    return data;
  },

  // Messages
  async sendMessage(body: SendMessageRequest, token: string) {
    const { data, error } = await fetchHelper<{
      success: boolean;
      data: Message;
    }>("/chat/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    if (error) throw new Error(error);
    return data?.data;
  },

  async deleteMessage(messageId: string, token: string) {
    const { data, error } = await fetchHelper<{ success: boolean }>(
      `/chat/messages/${messageId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (error) throw new Error(error);
    return data;
  },

  // Real-time features
  async sendTypingIndicator(
    conversationId: string,
    body: TypingIndicatorRequest,
    token: string,
  ) {
    const { data, error } = await fetchHelper<{ success: boolean }>(
      `/chat/conversations/${conversationId}/typing`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      },
    );
    if (error) throw new Error(error);
    return data;
  },

  async getActiveUsers(conversationId: string, token: string) {
    const { data, error } = await fetchHelper<{
      success: boolean;
      data: UserModel[];
    }>(`/chat/conversations/${conversationId}/active-users`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (error) throw new Error(error);
    return data?.data || [];
  },

  async getUserStatus(userId: string, token: string) {
    const { data, error } = await fetchHelper<{
      success: boolean;
      data: { isOnline: boolean };
    }>(`/chat/conversations/user-status/${userId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (error) throw new Error(error);
    return data?.data;
  },
};

export default ChatService;
