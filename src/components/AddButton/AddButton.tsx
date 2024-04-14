import cls from './AddButton.module.css'
export function AddButton() {
    return (
        <div className={cls.AddButtonContainer}>
            <button className={cls.AddButton}>
                New contract
            </button>
        </div>
    )
}
