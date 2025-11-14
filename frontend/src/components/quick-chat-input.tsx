import { Card, CardDescription, CardFooter, CardTitle } from "./ui/card";

export interface QuickChatButtonProp{
    cardTitle:string;
    cardDescription?:string;
}

export function QuickChatButton({cardTitle, cardDescription}:QuickChatButtonProp){
    return(
        <Card className="!w-fit !gap-1 !px-0 py-1 !flex !flex-col">
            <div data-slot="card-header" className="**flex flex-col** **p-0** !px-1 !gap-1 !w-fit !h-fit">
                <CardTitle className="text-left">
                    {cardTitle}
                </CardTitle>
            </div>
            <CardFooter className="!px-1 !gap-1">
                <CardDescription className="text-left">
                    {cardDescription}
                </CardDescription>
            </CardFooter>
        </Card>
    )
}