import cls from './Input.module.css'
import React, {useEffect, useState} from "react";

interface InputProps {
    inputType?: 'text' | 'number'
    maxLength?: number

    min?: number
    notEmpty?: boolean

    onChange?: (change: { value: string, isValid: boolean }) => void
}

export function Input({inputType, maxLength, min, notEmpty, onChange}: InputProps) {
    const [isUserInteracted, setIsUserInteracted] = useState(false)

    const [isValid, setIsValid] = React.useState(true)
    const [isFocused, setIsFocused] = useState(false)
    const [value, setValue] = useState('')


    const validate = () => {
        let valid = true;

        if (!isFocused) {
            if (notEmpty !== undefined && notEmpty) {
                valid = valid && value !== ""
            }
        }

        if (inputType === 'number') {
            if (min) {
                valid = valid && (value === "" || Number(value) >= min)
            }
        }

        setIsValid(valid)
    }

    useEffect(() => {
        if (!isUserInteracted) {
            // omitting first function call
            setIsUserInteracted(true)
            return
        }

        validate()
    }, [value, isFocused]);

    if (onChange) {
        useEffect(() => {
            onChange({value: value, isValid: isValid})
        }, [value, isValid]);
    }


    return (
        <div className={cls.InputContainer}>
            <input
                className={cls.TextInput}
                type={inputType}
                maxLength={maxLength}
                style={{
                    color: isValid ? 'black' : 'red',
                    borderColor: isValid ? 'gray' : 'red',
                    border: isValid ? 'none' : 'solid'
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                    setIsFocused(false)
                }}
                min={min}
                onChange={({target}) => {
                    setValue(target.value)
                }}
            />
        </div>
    )
}
