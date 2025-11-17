export interface Conversation{
    id: string;
    title?: string;
    timestamp?: Date;
    messages?:Message[]
};

export interface Message{
    message_id: string;
    sent_by_user: boolean;
    content: React.ReactNode;
    timestamp: Date;
    metadata?: Record<string, any>;
}

export type ApiChat = {title:string; chat_id: string; created_at: string; pinned:boolean};
export type UserChatsResponse = { user_email: string; chats: ApiChat[] };
export type CreateChatResposne = {chat_id:string; user_email:string; created_at: string};
export type MessageResponse = {message_id:string, sent_by_user:boolean, content:string, metadata:Record<string, any>, created_at:string}
export type ChatsMessagesResponse = {chat_id:string, user_email:string,messages:MessageResponse[]}


export interface CreateMessagePayload {
    chat_id: string;
    message: string;
    metadata?: Record<string, any>
}