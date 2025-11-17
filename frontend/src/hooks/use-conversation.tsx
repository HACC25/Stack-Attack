import { useEffect, useCallback, useState } from "react";
import { createChat, fetchChats, fetchMessages, sendMessage } from "@/api/conversations";
import type { ApiChat, ChatsMessagesResponse, CreateChatResposne, MessageResponse } from "@/types/conversation";

export interface UseConversationOptions {
	initialMessage?: React.ReactNode;
}

export function useConversation(token: string, options?: UseConversationOptions) {
	// Chats state
	const [chats, setChats] = useState<ApiChat[] | null>(null);
	const [loadingChats, setLoadingChats] = useState(false);
	const [creatingChat, setCreatingChat] = useState(false);
	const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

	// Messages state
	const [messages, setMessages] = useState<MessageResponse[] | null>(null);
	const [loadingMessages, setLoadingMessages] = useState(false);
	const [sendingMessage, setSendingMessage] = useState(false);

	// Assistant typing/loading state
	const [assistantLoading, setAssistantLoading] = useState(false);

	// Error buckets
	const [errors, setErrors] = useState<{ chats?: string; createChat?: string; messages?: string; send?: string }>({});

	const safeTokenCheck = useCallback(() => {
		if (!token) throw new Error("Missing auth token");
	}, [token]);

	// Load chats
	const reloadChats = useCallback(async () => {
		safeTokenCheck();
		setLoadingChats(true);
		setErrors(e => ({ ...e, chats: undefined }));
		try {
			const res = await fetchChats(token);
			const data = await res.json();
			setChats(data.chats || []);
		} catch (e) {
			const msg = e instanceof Error ? e.message : "Failed to load chats";
			setErrors(errs => ({ ...errs, chats: msg }));
		} finally {
			setLoadingChats(false);
		}
	}, [token, safeTokenCheck]);

	// Create chat
	const createConversation = useCallback(async (): Promise<CreateChatResposne> => {
		safeTokenCheck();
		setCreatingChat(true);
		setErrors(e => ({ ...e, createChat: undefined }));
		try {
			const res = await createChat(token);
			const data: CreateChatResposne = await res.json();
			setChats(prev => prev ? [{ title: data.chat_id, chat_id: data.chat_id, created_at: data.created_at }, ...prev] : [{ title: data.chat_id, chat_id: data.chat_id, created_at: data.created_at }]);
			return data;
		} catch (e) {
			const msg = e instanceof Error ? e.message : "Failed to create chat";
			setErrors(errs => ({ ...errs, createChat: msg }));
			throw e;
		} finally {
			setCreatingChat(false);
		}
	}, [token, safeTokenCheck]);

	const selectChat = useCallback((chatId: string | null) => {
		setSelectedChatId(chatId);
	}, []);

	// Load messages for selected chat
	const reloadMessages = useCallback(async () => {
		if (!selectedChatId) return;
		safeTokenCheck();
		setLoadingMessages(true);
		setErrors(e => ({ ...e, messages: undefined }));
		try {
			const res = await fetchMessages(token, selectedChatId);
			const data: ChatsMessagesResponse = await res.json();

			const serverMessages = data.messages || [];

			// If the server returned any assistant messages, clear assistant loading state
			const hasAssistantMessage = serverMessages.some(m => !m.sent_by_user);
			if (hasAssistantMessage) setAssistantLoading(false);

			// Merge server messages with any local optimistic messages.
			setMessages(prev => {
				const existing = prev || [];

				// Build a map of server messages by client_temp_id if present
				const serverByClientId = new Map<string, typeof serverMessages[0]>();
				for (const m of serverMessages) {
					const clientId = (m as any).metadata?.client_temp_id;
					if (clientId) serverByClientId.set(String(clientId), m);
				}

				// Keep local messages that are not typing placeholders and not replaced by server messages
				const localsToKeep = existing.filter(m => {
					const isLocal = String(m.message_id).startsWith("local-");
					const isTyping = (m as any).metadata?.typing === true;
					if (!isLocal) return false; // keep only local candidates here
					if (isTyping) return false; // drop typing placeholders when merging
					const clientTemp = (m as any).metadata?.client_temp_id;
					if (clientTemp && serverByClientId.has(String(clientTemp))) return false; // replaced by server
					return true;
				});

				// Combine: server messages + remaining local messages, then sort by created_at/timestamp
				const combined = [...serverMessages, ...localsToKeep];
				combined.sort((a: any, b: any) => {
					const ta = a.created_at ? new Date(a.created_at).getTime() : (a.timestamp ? new Date(a.timestamp).getTime() : 0);
					const tb = b.created_at ? new Date(b.created_at).getTime() : (b.timestamp ? new Date(b.timestamp).getTime() : 0);
					return ta - tb;
				});

				return combined;
			});
		} catch (e) {
			const msg = e instanceof Error ? e.message : "Failed to load messages";
			setErrors(errs => ({ ...errs, messages: msg }));
			setAssistantLoading(false);
		} finally {
			setLoadingMessages(false);
		}
	}, [token, selectedChatId, safeTokenCheck]);

	const sendMessageAction = useCallback(
		async (content: string, metadata?: Record<string, any>): Promise<void> => {
			safeTokenCheck();
			setSendingMessage(true);
			setErrors(e => ({ ...e, send: undefined }));
			try {
				let activeChatId = selectedChatId;
				if (!activeChatId) {
					const createdRes = await createChat(token);
					const created: CreateChatResposne = await createdRes.json();
					activeChatId = created.chat_id;
					reloadChats();
				}
				const ts = Date.now();
				const clientTempId = `local-user-${ts}`;
				const localUserMsg: MessageResponse = {
					message_id: clientTempId,
					sent_by_user: true,
					content,
					metadata: { ...(metadata || {}), client_temp_id: clientTempId },
					created_at: new Date().toISOString(),
				};

				const typingId = `local-typing-${ts}`;
				const typingMsg: MessageResponse = {
					message_id: typingId,
					sent_by_user: false,
					content: "...",
					metadata: { typing: true },
					created_at: new Date().toISOString(),
				};

				setMessages(prev => {
					const base = prev ? prev.filter(m => m.message_id !== 'local-initial') : [];
					return [...base, localUserMsg, typingMsg];
				});
				setAssistantLoading(true);

				if (!selectedChatId) {
					setSelectedChatId(activeChatId);
					reloadChats().catch(() => {});
				}

				const res = await sendMessage(token, { chat_id: activeChatId, message: content, metadata: { ...(metadata || {}), client_temp_id: clientTempId } });
				await res.text().catch(() => "");

				setTimeout(() => {
					reloadMessages().catch(() => {});
				}, 200);

				return;
			} catch (e) {
				const msg = e instanceof Error ? e.message : "Failed to send message";
				setErrors(errs => ({ ...errs, send: msg }));
				setAssistantLoading(false);
				throw e;
			} finally {
				setSendingMessage(false);
			}
		},
		[token, selectedChatId, safeTokenCheck, reloadMessages, reloadChats]
	);

	useEffect(() => {
		if (token) reloadChats();
	}, [token, reloadChats]);

	useEffect(() => {
		if (!selectedChatId && options?.initialMessage && !messages) {
			const localInitial = {
				message_id: 'local-initial',
				sent_by_user: false,
				content: options.initialMessage,
				timestamp: new Date(),
				metadata: {},
				created_at: new Date().toISOString(),
			} as unknown as MessageResponse;
			setMessages([localInitial]);
		}
	}, [selectedChatId, options?.initialMessage, messages]);

	useEffect(() => {
		if (selectedChatId) reloadMessages();
	}, [selectedChatId, reloadMessages]);

	useEffect(() => {
		const handler = (ev: any) => {
			const chatId = ev?.detail?.chat_id;
			if (chatId) setSelectedChatId(String(chatId));
		};
		try {
			window.addEventListener('app:selected-chat', handler as EventListener);
		} catch (e) {
		}
		return () => {
			try { window.removeEventListener('app:selected-chat', handler as EventListener); } catch (e) {}
		};
	}, []);

	return {
		chats,
		loadingChats,
		reloadChats,
		selectedChatId,
		selectChat,
		messages: messages || [],
		loadingMessages,
		reloadMessages,
		createConversation,
		creatingChat,
		sendMessageAction,
		sendingMessage,
		assistantLoading,
		errors,
		hasConversation: !!selectedChatId,
	} as const;
}
