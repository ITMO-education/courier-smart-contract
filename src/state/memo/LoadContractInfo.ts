import {SmartContract} from "../../api/model/SmartContract.ts";
import tonClient from "../../ton/GetTonClient.ts";
import {CO2} from "@itmo-education/courier-smart-contract";
import {Address, OpenedContract} from "@ton/core";
import {fromTonPoint} from "../../api/model/Point.ts";
import memoize from "lodash.memoize";

const loadSmartContract = async (address: string): Promise<SmartContract | undefined> => {
    const client = await tonClient()
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
