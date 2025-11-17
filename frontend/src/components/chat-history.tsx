import {Message} from "@/components/chat-message"
import type { Message as MessageProp } from "@/types/conversation";

export function AppChatHistory({ messages, loadingPrevMessages, loadingAIResponse }: { messages: MessageProp[]; loadingPrevMessages?: boolean; loadingAIResponse?: boolean }){

    if (loadingPrevMessages && (!messages || messages.length === 0)) {
        return (
            <div className="chat-history flex flex-col gap-4 p-4">
                <div className="w-3/4 h-6 rounded-md bg-muted/30 animate-pulse" />
                <div className="w-2/3 h-6 rounded-md bg-muted/30 animate-pulse" />
                <div className="w-1/2 h-6 rounded-md bg-muted/30 animate-pulse" />
            </div>
        );
    }

    const sortedMessages = [...messages].sort((a:MessageProp, b:MessageProp) => {
        if(a.timestamp > b.timestamp) return 1;
        else if (b.timestamp > a.timestamp) return -1;
        else return 0;
    });

    const chatHistoryMessage = sortedMessages.map((message) => (
        <Message 
            key={message.message_id}
            message_id={message.message_id}
            content={message.content}
            timestamp={message.timestamp}
            sent_by_user={message.sent_by_user}
            metadata={message.metadata}
        />
    ));

    console.log(chatHistoryMessage)

    return (
        <div className="chat-history flex flex-col gap-20">
            {chatHistoryMessage}
        </div>
    );
}
