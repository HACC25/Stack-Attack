import { Mic } from "lucide-react";
import { Button } from "./ui/button";

export function DictationButton(){
    return(
        <div>
            <Button size="icon-sm" aria-label="Submit File" variant="ghost" className="bg-transparent">
                <Mic />
            </Button>
        </div>
    )
}