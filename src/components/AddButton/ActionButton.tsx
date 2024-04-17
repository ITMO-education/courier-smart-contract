import cls from './ActionButton.module.css'
interface ActionButtonProps {
    text: string
    action?: ()=> void
}
export function ActionButton({text, action}:ActionButtonProps) {
    return (
        <div className={cls.ActionButtonContainer}>
            <button className={cls.ActionButton} onClick={action}>
                {text}
            </button>
        </div>
    )
}
