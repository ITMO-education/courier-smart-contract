import cls from "./TextInput.module.css";

interface TextInputProps {
    resize?: boolean
    onChange?: (value: string) => void
}

export function TextInput({resize, onChange}: TextInputProps) {
    return (
        <div className={cls.InputContainer}>
            <textarea
                className={cls.TextInput}
                style={{resize: ((resize ?? true)) ? undefined : 'none'}}
                onChange={(e) => {
                    if (onChange) {
                        onChange(e.target.value)
                    }
                }}
            />
        </div>
    )
}
