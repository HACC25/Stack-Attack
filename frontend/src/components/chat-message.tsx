import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

import {
    Card,
    CardContent
} from "@/components/ui/card"
import { useRef } from "react";

export interface MessageProp{
    message_id: string;
    sent_by_user: boolean;
    content: React.ReactNode;
    timestamp: Date;
}

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

function MessageContent( { sent_by_user, content }: {sent_by_user:boolean, content: React.ReactNode}){
    return(
        sent_by_user ? /*Messages Sent By User*/ (
            <Card className="w-fit self-end">
                <CardContent>
                    <div className="text-right">{content}</div>
                </CardContent>
            </Card>) : /*Messages Sent By Chat Bot*/ (
            <Card className="border-0 shadow-none w-fit">
                <CardContent className="border-0">
                    <div className="text-left">{content}</div>
                </CardContent>
            </Card>)
    )
}


export function Message({message_id, sent_by_user, content, timestamp}: MessageProp){
    const ref_message_id = useRef(message_id);
    return(<>
    <div className="flex flex-col">
        <ChatHeader sent_by_user = {sent_by_user} />
            <MessageContent sent_by_user={sent_by_user} content={content} />
        <Timestamp date = {timestamp} sent_by_user={sent_by_user} />
    </div>
</>)
}