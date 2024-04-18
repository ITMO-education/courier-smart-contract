import {CO2} from "@itmo-education/courier-smart-contract";
import {Address, OpenedContract} from "@ton/core";
import memoize from "lodash.memoize";
import {SmartContract} from "../api/model/SmartContract.ts";
import getTonClient from "../ton/GetTonClient.ts";
import {fromTonPoint} from "../api/model/Point.ts";

const loadSmartContract = async (address: string): Promise<SmartContract | undefined> => {
    const client = await getTonClient()
    const contract =
        client.open(
            CO2.fromAddress(
                Address.parse(address))) as OpenedContract<CO2>


    const sc = {} as SmartContract
    sc.address = address
    try {
        sc.state = await contract.getState()
    } catch (e) {
        return undefined
    }

    return Promise.all([
        contract.getOwner().then((owner) => sc.ownerAddress = owner.toString()),

        contract.getCourier().then((courier) => {
            if (courier) {
                sc.courierAddress = courier.toString()
            }
        }),

        contract.getDeliveryInfo().then((info)=> {
            sc.name = info.name
            sc.description = info.description

            sc.courierFee = info.courierFee

            sc.declaredValue = info.declaredSum

            sc.to = fromTonPoint(info.to)
            sc.from = fromTonPoint(info.from)
        })
    ]).then(() => {
        return sc
    })
}


export default memoize(loadSmartContract)
