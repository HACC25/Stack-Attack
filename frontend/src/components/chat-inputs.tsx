import { Field } from '@/components/ui/field'

import {
    Card,
} from "@/components/ui/card"
import { FileButton } from "./file-button";
import { DictationButton } from "./dictation-button";
import TextInput from './text-input';
import { QuickChatButton, type QuickChatButtonProp } from './quick-chat-input';

const QuickchatButton_Example: QuickChatButtonProp[] = [{
    cardTitle:"Blue Collar Worker"
},
{
    cardTitle: "White Collar Worker"
}]

export function AppChatInput(){
    return(
    <div className='m-5 flex flex-col gap-2'>
        <div className='flex justify-center gap-3'>
        {QuickchatButton_Example.map((quickActionButton) => (<QuickChatButton cardTitle={quickActionButton.cardTitle} cardDescription={quickActionButton.cardDescription} />))}
        </div>
        <Card className='p-2'>
            <form>
                <Field>
                    <div className='flex'>
                        <FileButton></FileButton>
                        <TextInput></TextInput>
                        <DictationButton></DictationButton>
                    </div>
                </Field>
            </form>
        </Card>
    </div>
    );
}