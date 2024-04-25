import cls from './HomePage.module.css'
import {TonConnectButton} from "@tonconnect/ui-react";
import {ContractListItem} from "../components/ContractListItem.tsx";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {ActionButton} from "../components/ActionButton/ActionButton.tsx";
import {listContracts} from "../api/backend/api.ts";

export function HomePage() {

    const [addrs, setContractAddresses] = useState<string[]>([])


    useEffect(() => {
        listContracts({limit: 10, offset: 0}).
        then(r => {
            return r.map(c => c.tonAddress)
        }).
        then(r => {
            setContractAddresses(r)
        })

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
