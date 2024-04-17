import cls from './CreateSmartContract.module.css'
import {ReturnButton} from "../components/ReturnButton/ReturnButton.tsx";
import {SmartContract} from "../assets/svg/SmartContract.tsx";
import {ActionButton} from "../components/AddButton/ActionButton.tsx";
import {Input} from "../components/Input/Input.tsx";
import {TextInput} from "../components/Input/TextInput.tsx";
import {PointOnMap} from "../assets/svg/PointOnMap.tsx";
import {TonIcon} from "../assets/svg/TonIcon.tsx";
import {
    YMaps,
    Map,
    FullscreenControl,
    GeolocationControl,
    SearchControl, Placemark, Button,
} from "@pbe/react-yandex-maps";
import {useState} from "react";

interface CoordGetter {
    get(val: string): number[]
}

export function CreateSmartContract() {

    const validate = () => {

    }

    return (
        <div className={cls.CreateSmartContractContainer}>
            <div className={cls.HeaderContainer}>
                <ReturnButton to={"/"}/>
                <div className={cls.PageHeader}>New Smart contract</div>
                <SmartContract/>
            </div>

            <div className={cls.InfoContainer}>
                <div className={cls.InfoContainerSection} style={{flex: 1}}>
                    <NameInput/>
                </div>

                <div className={cls.InfoContainerSection} style={{flex: 2}}>
                    <DescriptionInput/>
                </div>

                <div className={cls.InfoContainerSection} style={{flex: 2}}>
                        <div className={cls.ValueAndPaymentInputs}>
                            <TonInput headerName={"Declared value"}/>
                            <TonInput headerName={"Courier payment"}/>
                    </div>
                </div>

                <div className={cls.InfoContainerSection} style={{flex: 7}}>
                    <MapInput/>
                </div>
            </div>

            <div className={cls.CommitContainer}>
                <div className={cls.CommitButton}>
                    <ActionButton text={"Sign"} action={validate}/>
                </div>
            </div>
        </div>
    )
}

function NameInput() {
    return (
        <div className={cls.NameInputSection}>
            <div className={cls.InfoContainerHeader} children={"Name:"}/>
            <div className={cls.NameInput}>
                <Input notEmpty={true} maxLength={64}/>
            </div>
        </div>
    )
}

function DescriptionInput() {
    return (<div className={cls.InfoContainerSection} style={{flex: 3}}>
        <div className={cls.DescriptionSection}>
            <div
                className={cls.InfoContainerHeader}
                children={"Description:"}
            />
            <div className={cls.DescriptionInput}
                 children={<TextInput resize={false}/>}
            />
        </div>
    </div>)
}


function TonInput({headerName} : {headerName: string}) {
    return (
        <div className={cls.ValueAndPaymentColumn}>
            <div className={cls.ValueAndPaymentHeader}>
                <div className={cls.InfoContainerHeader}>{headerName}</div>
                <div className={cls.TonIconWrapper}>
                    <div className={cls.TonIcon}><TonIcon/></div>
                </div>
            </div>

            <Input inputType={'number'} min={0.1}/>
        </div>
    )
}


function MapInput() {
    const [mapMarkFrom, setMapMarkFrom] = useState<number[]>([])
    const [mapMarkTo, setMapMarkTo] = useState<number[]>([])
    const [selectingPointFrom, setSelectingPointFrom] = useState<boolean>(true)


    return (<div className={cls.MapContainer}>
        <div className={cls.InfoContainerHeader}>
            <div>Map</div>
            <div className={cls.PointOnMapIcon}><PointOnMap/></div>
        </div>
        <div className={cls.Map}>
            <YMaps query={
                {
                    apikey: "26bf80e8-684a-4cc9-b148-46fb455bbbe8", //TODO вынести в переменные
                    lang: 'ru_RU',

                }}
            >
                <Map
                    style={{width: '100%', height: '100%'}}
                    defaultState={{center: [55.75, 37.57], zoom: 9}}
                    onClick={(e: CoordGetter) => {
                        if (selectingPointFrom) {
                            setMapMarkFrom(e.get('coords'))
                        } else {
                            setMapMarkTo(e.get('coords'))
                        }
                    }}
                >
                    <FullscreenControl/>
                    <SearchControl options={{float: "right"}}/>

                    <GeolocationControl
                        options={{
                            float: "left",
                            adjustMapMargin: true,
                        }}
                    />

                    {mapMarkFrom.length != 0 && <>
					    <Placemark
						    geometry={mapMarkFrom}
					    />
					    <Button
						    options={{
                                float: "right",
                                maxWidth: 240,
                            }}
						    data={{
                                content: selectingPointFrom ? "Select destination point" : "Change departure point",
                            }}
						    state={{
                                selected: !selectingPointFrom,
                            }}
						    onClick={() => {
                                setSelectingPointFrom(!selectingPointFrom)
                            }}
					    /></>}

                    {mapMarkTo && <Placemark
					    geometry={mapMarkTo}
					    options={{
                            iconColor: 'red'
                        }}
				    />}
                </Map>
            </YMaps>
        </div>
    </div>)
}
