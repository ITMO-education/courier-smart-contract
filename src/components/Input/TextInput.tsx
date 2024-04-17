import cls from "./TextInput.module.css";

interface TextInputProps {
    resize?: boolean
}

export function TextInput({resize}: TextInputProps) {
    return (
        <div className={cls.InputContainer}>
            <textarea className={cls.TextInput} style={{resize: ((resize??true)) ?  undefined: 'none' }}/>
        </div>
    )
}
