import cls from './CreateSmartContract.module.css'
import {ReturnButton} from "../components/ReturnButton/ReturnButton.tsx";
import {SmartContract} from "../assets/svg/SmartContract.tsx";
import {ActionButton} from "../components/ActionButton/ActionButton.tsx";
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
import {useEffect, useState} from "react";
import {CreateContract} from "../service/CreateContract.ts";
import {useTonConnectUI} from "@tonconnect/ui-react";

export function CreateSmartContract() {
    const [tonConnectUI ] = useTonConnectUI();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [declaredValue, setDeclaredValue] = useState(0);
    const [courierFeeValue, setCourierFeeValue] = useState(0);

    const [mapFrom, setMapFrom] = useState<number[]>([])
    const [mapTo, setMapTo] = useState<number[]>([])

    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        if (name === "" ||
            description === "" ||
            declaredValue === 0 ||
            courierFeeValue === 0 ||
            mapFrom.length === 0 ||
            mapTo.length === 0
        ) {
            setIsValid(false)
            return
        }

        setIsValid(true)

    }, [name, description, declaredValue, courierFeeValue, mapFrom, mapTo]);

    const commit = () => {
        if (!isValid) return


        CreateContract(
            tonConnectUI,
            declaredValue, courierFeeValue, name, description,
            {
                lat: mapFrom[0],
                lon: mapFrom[1],
            }, {
                lat: mapTo[0],
                lon: mapTo[1],
            })

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
                    <NameInput setName={setName}/>
                </div>

                <div className={cls.InfoContainerSection} style={{flex: 2}}>
                    <DescriptionInput setDescription={setDescription}/>
                </div>

                <div className={cls.InfoContainerSection} style={{flex: 2}}>
                    <div className={cls.ValueAndPaymentInputs}>
                        <TonInput
                            headerName={"Declared value"}
                            onChange={setDeclaredValue}

                            errorMessage={"Value must be specified"}
                        />
                        <TonInput
                            headerName={"Courier payment"}
                            errorMessage={"Courier won't work for free"}
                            onChange={setCourierFeeValue}
                        />
                    </div>
                </div>

                <div className={cls.InfoContainerSection} style={{flex: 7}}>
                    <MapInput setFrom={setMapFrom} setTo={setMapTo}/>
                </div>
            </div>

            <div className={cls.CommitContainer}>
                <div className={cls.CommitButton}>
                    <ActionButton text={"Sign"} action={commit} disabled={!isValid}/>
                </div>
            </div>
        </div>
    )
}

function NameInput({setName}: {
    setName: (value: string) => void
}) {

    const [isValid, setIsValid] = useState(false)

    return (
        <div className={cls.NameInputSection}>
            <div className={cls.InfoContainerHeader} children={"Name:"}/>
            <div className={cls.Input}>
                <Input
                    onChange={(change) => {
                        setName(change.value)
                        setIsValid(change.isValid)
                    }}
                    notEmpty={true}
                    maxLength={64}
                />
            </div>
            {isValid ? null : <div
                className={cls.InputError}
            >Name must be filled</div>}
        </div>
    )
}

function DescriptionInput({setDescription}: {
    setDescription: (s: string) => void,
}) {
    return (
        <div className={cls.DescriptionSection}>
            <div
                className={cls.InfoContainerHeader}
                children={"Description:"}
            />
            <div className={cls.DescriptionInput}
                 children={<TextInput
                     resize={false}
                     onChange={setDescription}
                 />}
            />
        </div>
    )
}

function TonInput({headerName, errorMessage, onChange}: {
    headerName: string,
    errorMessage: string,
    onChange: (value: number) => void,
}) {

    const [isValid, setIsValid] = useState(true)

    return (
        <div className={cls.ValueAndPaymentColumn}>
            <div className={cls.InfoContainerHeader}>{headerName}</div>
            <div className={cls.ValueAndPaymentContainer}>
                <div className={cls.ValueAndPaymentContainer}>
                    <div className={cls.InputAndIcon}>
                        <Input
                            inputType={'number'}
                            notEmpty={true}
                            min={0.5}
                            onChange={(changes) => {
                                onChange(Number(changes.value))
                                setIsValid(changes.isValid)
                            }}
                        />
                        <div className={cls.TonIconWrapper}>
                            <div className={cls.TonIcon}><TonIcon/></div>
                        </div>
                    </div>

                    {isValid ? null : <div className={cls.InputError}>{errorMessage}</div>}
                </div>
            </div>

        </div>
    )
}

function MapInput({setFrom, setTo}:{
    setFrom: (point: number[])=>void,
    setTo: (point: number[])=>void,
}) {
    const [mapMarkFrom, setMapMarkFrom] = useState<number[]>([])
    const [mapMarkTo, setMapMarkTo] = useState<number[]>([])
    const [selectingPointFrom, setSelectingPointFrom] = useState<boolean>(true)

    interface CoordinatesGetter {
        get(val: string): number[]
    }

    useEffect(() => {
        setFrom(mapMarkFrom)
    }, [mapMarkFrom]);

    useEffect(() => {
        setTo(mapMarkTo)
    }, [mapMarkTo]);

    return (<div className={cls.MapContainer}>
        <div className={cls.InfoContainerHeader}>
            Map
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
                    onClick={(e: CoordinatesGetter) => {
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
