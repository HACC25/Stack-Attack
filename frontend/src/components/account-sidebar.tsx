import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
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
        !isCollapsed ?
        (<Card className={`!flex-row !w-full !h-fit !gap-3 'py-3`}>
                <div className="!h-full aspect-square min-h-10">
                    <Avatar className="!h-full !w-full !aspect-square">
                        <AvatarImage src={profile}></AvatarImage>
                        <AvatarFallback>{name[0]}</AvatarFallback>
                    </Avatar>
                </div>
                {!isCollapsed && (<div className="flex flex-col w-full h-fit min-w-0">
                    <span className="text-left truncate">{email}</span>
                    <span className="text-left truncate">{name}</span>
                    <span className="text-left truncate">{department}</span>
                </div>)}
        </Card>) :
        (
            <Avatar>
                <AvatarImage src={profile}></AvatarImage>
                <AvatarFallback>{name[0]}</AvatarFallback>
            </Avatar>
        )
    )
}