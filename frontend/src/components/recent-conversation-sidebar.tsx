import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

interface ConversationProp{
    id:string;
    title:string;
    timestamp:Date;
}

const example_recent_conversations:ConversationProp[] = [
    {
        id: "9d8fce90-ac43-47b0-a5ba-eea38251af4e",
        title: "Funeral Leave Eligibility – Conversation with Kōkua (Blue-Collar Supervisors Agreement)",
        timestamp: new Date("2025-10-27T18:45:00.000Z")
    },

    {
        id: "46293afc-c11f-4db3-9411-48423630205d",
        title: "Requesting Family Leave for Care of a Parent – Conversation with Kōkua",
        timestamp: new Date("2025-09-15T22:10:30.000Z")
    },

    {
        id: "4667d3d8-b0e9-47bb-8598-532296edcbf8",
        title: "Overtime Compensation Inquiry – Conversation with Kōkua",
        timestamp: new Date("2025-08-05T03:25:45.000Z")
    },

    {
        id: "6511df02-3e9b-4748-94ee-b23786c26e8f",
        title: "Vacation Leave Accrual and Carryover – Conversation with Kōkua",
        timestamp: new Date("2025-11-12T17:00:00.000Z")
    }
]

const sortedConversation:ConversationProp[] = example_recent_conversations.sort((a, b) => {
        if(a.timestamp > b.timestamp) return 1;
        else if(a.timestamp < b.timestamp) return -1;
        else return 0;
    });

export function AppRecentConversationSidebar(){
    return(
        <SidebarGroup>
            <SidebarGroupLabel>Recent</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                {sortedConversation.map((Conversation) => (
                    <SidebarMenuItem key={Conversation.id}>
                    <SidebarMenuButton asChild>
                        <a><span>{Conversation.title}</span></a>
                    </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
                </SidebarMenu>
            </SidebarGroupContent>
            </SidebarGroup>
    )
}