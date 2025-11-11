import { Button } from "@/components/ui/button"
import { useRef } from "react";
import { File} from "lucide-react";
import { Input } from "./ui/input";

export function FileButton(){
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return(
        <div>
        <Button size="icon-sm" aria-label="Submit File" className="bg-transparent" variant="ghost" onClick={handleButtonClick}>
            <File/>
        </Button>
        <Input type="file" className="sr-only" ref={fileInputRef}/>
        </div>
    )
}