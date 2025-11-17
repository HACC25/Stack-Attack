import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

import {
    Card,
    CardContent
} from "@/components/ui/card"
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Message as MessageType } from "@/types/conversation";

function ChatHeader({ sent_by_user }: { sent_by_user: boolean }){
    return(
        !sent_by_user && (<div className="flex">
                <Avatar>
                    <AvatarImage></AvatarImage>
                    <AvatarFallback></AvatarFallback>
                </Avatar>
                <span>Kōkua</span>
            </div>)
    )
}

function Timestamp({ date, sent_by_user }: { date: Date, sent_by_user:boolean }) {
    const timeString = date.toLocaleTimeString([], {month:'2-digit', day:'2-digit', year:'2-digit', hour: '2-digit', minute: '2-digit' });
    return (
        sent_by_user ?
        (<time className="text-xs text-muted-foreground ml-4 text-right" dateTime={date.toISOString()}>
            {timeString}
        </time>):
        (<time className="text-xs text-muted-foreground ml-4 text-left" dateTime={date.toISOString()}>
            {timeString}
        </time>)
    )
}

function MessageContent({ sent_by_user, content, metadata }: { sent_by_user: boolean; content: React.ReactNode; metadata?: any }) {
    const renderMarkdown = (text: string) => (
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
            code({ node, inline, className, children, ...props }) {
                return inline ? (
                    <code className={String(className)} {...props}>
                        {children}
                    </code>
                ) : (
                    <pre className="rounded-md bg-surface p-2 overflow-auto"><code {...props}>{children}</code></pre>
                );
            }
        }}>{text}</ReactMarkdown>
    );

    const contentIsString = typeof content === "string";

    const isTypingPlaceholder = (content as string).length === 0;

    if (!sent_by_user && isTypingPlaceholder) {
        return (
            <Card className="border-0 shadow-none w-fit">
                <CardContent className="border-0" aria-live="polite">
                    <div className="text-left">
                        <span className="inline-block bg-muted rounded-full px-3 py-1 animate-pulse">...</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return sent_by_user ? (
        <Card className="w-fit self-end">
            <CardContent>
                <div className="text-right">{contentIsString ? renderMarkdown(content as string) : content}</div>
            </CardContent>
        </Card>
    ) : (
        <Card className="border-0 shadow-none w-fit">
            <CardContent className="border-0">
                <div className="text-left" key={content as string}>
                    {contentIsString ? renderMarkdown(content as string) : content}
                </div>
            </CardContent>
        </Card>
    );
}

export function Message({ sent_by_user, content, timestamp, metadata, }: MessageType){
    return(<>
    <div className="flex flex-col">
        <ChatHeader sent_by_user = {sent_by_user} />
            <MessageContent sent_by_user={sent_by_user} content={content} metadata={metadata} />
        <Timestamp date = {timestamp} sent_by_user={sent_by_user} />
    </div>
</>)
}