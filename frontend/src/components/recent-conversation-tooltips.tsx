import { TooltipContent } from "./ui/tooltip";

interface RecentConversationTooltipProp{
    conversationTitle:string;
    conversationTimestamp:Date;
}

export function AppRecentConversationTooltip({conversationTitle, conversationTimestamp}:RecentConversationTooltipProp){
    const timeString = conversationTimestamp.toLocaleTimeString([], {month:'2-digit', day:'2-digit', year:'2-digit', hour: '2-digit', minute: '2-digit' });
    return(
        
        <TooltipContent className="flex-col">
            <h5>{conversationTitle}</h5>
            <time className="text-xs text-muted-foreground ml-4" dateTime={conversationTimestamp.toISOString()}>
                {timeString}
            </time>
        </TooltipContent>
    )
}