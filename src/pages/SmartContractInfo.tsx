import cls from './SmartContractInfo.module.css'

import {currentContract} from "../state/CurrentContract.ts";
import {GetStateName} from "../service/dictionary/ContractState.ts";
import {fromNano} from "@ton/core";
import {useHookstate} from "@hookstate/core";
import {TonAddress} from "../components/TonAddress/TonAddress.tsx";
import {ReturnButton} from "../components/ReturnButton/ReturnButton.tsx";

export function SmartContractInfo() {

    const info = useHookstate(currentContract).get()

    if (!info) {
        return (<div className={cls.Loading}>Smart contract not selected</div>)
    }

    if (!info.address) {
        return (<div className={cls.Loading}>Loading...</div>)
    }

    return (
        <div className={cls.SmartContractInfoContainer}>
            <div className={cls.HeaderContainer}>
                <ReturnButton to={"/"}/>
                <div className={cls.NameContainer}>{info.name}</div>
                <div>{GetStateName(info.state)}</div>
            </div>

            <div className={cls.InfoContainer}>
                <div >
                    <div className={cls.InfoSectionName}>
                        Description:
                    </div>
                    <div className={cls.DescriptionContainer}>
                        {info.description}
                    </div>
                </div>

                <div className={cls.PersonContainer}>
                    <div className={cls.Person}>
                        <div className={cls.InfoSectionName}>
                            Owner:
                        </div>
                        <TonAddress address={info.ownerAddress}/>
                    </div>
                    <div className={cls.Person}>
                        <div className={cls.InfoSectionName}>
                            Courier:
                        </div>
                        <TonAddress address={info.courierAddress || "Not selected"}/>
                    </div>
                </div>

                <div className={cls.ValueContainer}>

                    <div>
                        <div className={cls.InfoSectionName}>
                            Declared Value:
                        </div>
                        {fromNano(info.declaredValue ? info.declaredValue : 0n)} Ton
                    </div>
                    <div>
                        <div className={cls.InfoSectionName}>
                            Courier fee:
                        </div>
                        {fromNano(info.courierFee ? info.courierFee : 0n)} Ton
                    </div>
                </div>
                {/*<div>{info.to}</div>*/}
                {/*<div>{info.from}</div>*/}
                <div>
                    <div className={cls.InfoSectionName}>
                        Contract:
                    </div>
                    <TonAddress address={info.address}/>
                </div>
            </div>
        </div>
    )
}
