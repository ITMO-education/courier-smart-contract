import cls from './copyButton.module.css'

import {useState} from "react";
import {Copied} from "../../assets/img/copied";
import {Copy} from "../../assets/img/copy";

import {CopyToClipboard} from 'react-copy-to-clipboard';

interface CopyButtonProps {
    content: string
}

export function CopyButton({content}: CopyButtonProps) {
    const [isCopied, setIsCopied] = useState(false)
    const copy = function () {
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 5000)
    }

    const copyComponent = isCopied ? <Copied/> : <Copy/>;

    return (
        <CopyToClipboard
            text={content}
            onCopy={copy}
        >
            <div className={cls.copyWrapper}> {copyComponent} </div>
        </CopyToClipboard>
    )
}
