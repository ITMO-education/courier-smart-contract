import cls from './HomePage.module.css'
import {TonConnectButton} from "@tonconnect/ui-react";
import {ContractListItem} from "../components/ContractListItem.tsx";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {ActionButton} from "../components/ActionButton/ActionButton.tsx";

export function HomePage() {

    const [addrs, setContractAddresses] = useState<string[]>([])


    useEffect(() => {
        // TODO do fetch
        setContractAddresses([
            'EQDIeN51larPLvJQwf09UqfNhw81QetqcAJgSw50gO1A1Qvk',
            'EQD8xW7sKDszzTh1oL-CwnjKhmRq3Pe4yZE2l-xH3rA7O0KV',
            // "EQCMtWBeQ-MprpdVs0zgs4SMN1A2CR53oLX2N4FxYnVrfLs8",
        ])
    }, []);

    return (
        <div className={cls.HomePage}>
            <div className={cls.ContractsList}>
                {addrs.map((a) => {
                    return (
                        <Link key={a} to={`/contract/${a}`}>
                            <button className={cls.ListItem}>
                                <ContractListItem contractAddressStr={a}/>
                            </button>
                        </Link>
                    )
                })}
            </div>

            <div className={cls.ButtonContainer}>
                <div className={cls.UserButton}>
                    <TonConnectButton/>
                </div>
                <div className={cls.AddButton}>
                    <Link to={`/create`} style={{textDecoration: 'none'}}>
                        <ActionButton text={"New contract"}/>
                    </Link>
                </div>
            </div>
        </div>
    )
}
