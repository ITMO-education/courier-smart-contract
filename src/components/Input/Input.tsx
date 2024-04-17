import cls from './Input.module.css'
import React from "react";

interface InputProps {
    inputType?: 'text' | 'number'
    maxLength?: number

    min?: number
    notEmpty?: boolean
}

export function Input({inputType, maxLength, min, notEmpty}: InputProps) {
    const [isValid, setIsValid] = React.useState(true)

    return (
        <div className={cls.InputContainer}>
            <input
                className={cls.TextInput}
                type={inputType}
                maxLength={maxLength}
                style={{
                    color: isValid ? 'black':'red',
                    borderColor: isValid ? 'gray': 'red',
                    border: isValid ? 'none':'solid'
                }}

                min={min}
                onChange={({target}) => {

                    setIsValid(notEmpty && target.value!="" || inputType=='number' && Number(target.value) > 0)
                }}
            />
        </div>
    )
}
