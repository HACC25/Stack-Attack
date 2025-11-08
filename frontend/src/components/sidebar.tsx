import { Menu } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppRecentConversationSidebar } from "./recent-conversation-sidebar"
import { AppAccountSidebar } from "./account-sidebar"
import type { AccountProp } from "@/components/account-sidebar"
import { Button } from "./ui/button"

const example_account:AccountProp = {
        name: "Kaleo Smith",
        email: "kaleo.smith@hawaii.edu",
        department: "Department",
}

function CustomSideBarTrigger(){
    return(
    <Button size="icon">
        <Menu />
    </Button>
    )
}

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon">
        <SidebarHeader>
            <SidebarTrigger>
                <Menu></Menu>
            </SidebarTrigger>
        </SidebarHeader>
        <SidebarContent>
            <AppRecentConversationSidebar></AppRecentConversationSidebar>
        </SidebarContent>
        <SidebarFooter>
            <AppAccountSidebar name={example_account.name} email={example_account.email} department={example_account.department} ></AppAccountSidebar>
        </SidebarFooter>
        </Sidebar>
    )
}