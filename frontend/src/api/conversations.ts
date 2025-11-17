import { apiRequestCallback } from "./api";
import { checkResponse } from "./response";
import type { CreateMessagePayload } from "@/types/conversation";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const createChat = async (token: string) => {
    const res = await apiRequestCallback("/chats/", {
        method: "POST",
        baseUrl: BACKEND_URL,
        token,
    });
    checkResponse(res)
    return res;
};

export const fetchChats = async (token: string): Promise<Response> => {
    const res = await apiRequestCallback("/chats/", {
        method: "GET",
        baseUrl: BACKEND_URL,
        token,
    });
    checkResponse(res)
    return res;
};

export const fetchMessages = async (token:string, chat_id:string): Promise<Response> => {
    const res = await apiRequestCallback(`/messages/${chat_id}`, {
        method: "GET",
        baseUrl: BACKEND_URL,
        token,
    })
    checkResponse(res)
    return res;
}

export const sendMessage = async (token: string, payload: CreateMessagePayload): Promise<Response> => {
    const res = await apiRequestCallback("/messages/message", {
        method: "POST",
        baseUrl: BACKEND_URL,
        token,
        body: payload,
    });
    checkResponse(res);
    return res;
};