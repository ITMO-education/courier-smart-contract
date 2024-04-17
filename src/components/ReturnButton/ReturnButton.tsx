import cls from './ReturnButton.module.css'
import {Link} from "react-router-dom";
interface ReturnButtonProps {
    to: string
}
export function ReturnButton({to}: ReturnButtonProps) {
    return (
        <Link to={to} style={{textDecoration: 'none'}}>
            <button className={cls.BackButton}>
                ←
            </button>
        </Link>
    )
}
