import { AppChatHistory } from "./chat-history";
import { AppChatInput } from "./chat-inputs";
import { useAuth } from "@/contexts/auth-context";
import { useConversation } from "@/hooks/use-conversation";
import type { Message } from "@/types/conversation";

export function AppChat() {
    const { token } = useAuth();
    const { messages, sendMessageAction, sendingMessage, loadingMessages, assistantLoading } = useConversation(token || "");

    const normalizedMessages: Message[] = messages.map((m: any) => {
        if (m.timestamp instanceof Date) return m as Message;
        return {
            message_id: m.message_id,
            sent_by_user: m.sent_by_user,
            content: m.content,
            timestamp: new Date(m.created_at),
            metadata: m.metadata,
        } as Message;
    });

    const handleSend = async (content: string) => {
        await sendMessageAction(content);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4">
                <AppChatHistory messages={normalizedMessages} loadingPrevMessages={loadingMessages} loadingAIResponse={assistantLoading}/>
            </div>
            <div className="sticky bottom-0 bg-background">
                <AppChatInput onSend={handleSend} sending={sendingMessage} disabled={!token} />
            </div>
        </div>
    );
}