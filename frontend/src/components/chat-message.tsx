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
        !sent_by_user && (<div>
                <Avatar>
                    <AvatarImage></AvatarImage>
                    <AvatarFallback></AvatarFallback>
                </Avatar>
                <span>Kōkua</span>
            </div>)
    )
}

function Timestamp({ date }: { date: Date }) {
    const timeString = date.toLocaleTimeString([], {month:'2-digit', day:'2-digit', year:'2-digit', hour: '2-digit', minute: '2-digit' });
    return (
        <time className="text-xs text-muted-foreground self-end ml-4" dateTime={date.toISOString()}>
            {timeString}
        </time>
    )
}


export function Message({message_id, sent_by_user, content, timestamp}: MessageProp){
    const ref_message_id = useRef(message_id);
    return(<>
    <div>
        <ChatHeader sent_by_user = {sent_by_user}></ChatHeader>
        <Card>
            <CardContent>
                <div>{content}</div>
            </CardContent>
        </Card>
        <Timestamp date = {timestamp}></Timestamp>
    </div>
</>)
}