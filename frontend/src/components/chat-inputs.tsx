import { Field } from '@/components/ui/field'

import {
    Card,
} from "@/components/ui/card"
import { FileButton } from "./file-button";
import { DictationButton } from "./dictation-button";
import TextInput from './text-input';

//Custom File Button Componenet

export function AppChatInput(){
    return(
    <div className='m-5'>
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