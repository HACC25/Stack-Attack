import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Card } from "./ui/card";
import { useSidebar } from "./ui/sidebar";


export interface AccountProp{
    name:string;
    profile?:string;
    email:string;
    department:string;
}

export function AppAccountSidebar({name, email, department, profile}:AccountProp){
    const {state} = useSidebar();

    const isCollapsed = state === 'collapsed';

    return(
        <Card>
            <Avatar>
                <AvatarImage src={profile}></AvatarImage>
                <AvatarFallback></AvatarFallback>
            </Avatar>
            {!isCollapsed && (<div>
                <span>{email}</span>
                <span>{name}</span>
                <span>{department}</span>
            </div>)}
        </Card>
    )
}