import cls from './ActionButton.module.css'

interface ActionButtonProps {
    text: string
    action?: () => void
    disabled?: boolean
}

export function ActionButton({text, action, disabled}: ActionButtonProps) {
    return (
        <div className={cls.ActionButtonContainer}>
            <button
                disabled={disabled}
                className={cls.ActionButton}
                style={{
                    color: disabled ? 'var(--header-color':'',
                    backgroundColor: disabled ? 'gray': 'var(--thirdly-bg-color)',
                    cursor: disabled ? 'not-allowed' : 'pointer'
                }}
                onClick={action}>
                {text}
            </button>
        </div>
    )
}
