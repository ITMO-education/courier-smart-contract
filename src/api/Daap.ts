import { ListReq} from "./Api.ts";
import {DeliveryContract, Point} from "../state/Contracts.ts";
import {Address, Contract, OpenedContract, Transaction} from "@ton/core";
import {CO2} from "@itmo-education/courier-smart-contract";

interface ApiClient {
    getTransactions(address: Address, opts: {
        limit: number;
        lt?: string;
        hash?: string;
        to_lt?: string;
        inclusive?: boolean;
        archival?: boolean;
    }): Promise<Transaction[]>;

    open<T extends Contract>(src: T): OpenedContract<T>;
}

export function ListContracts(req: ListReq, client: ApiClient): Promise<DeliveryContract[]> {
    return fullUpdate(client, req.address)
}


export async function fullUpdate(client: ApiClient, address: string) {
    let countracts: DeliveryContract[] = []

    const res = await client.getTransactions(
        Address.parse(address),
        {limit: 100})

    for (let i = 0; i < res.length; i++) {
        for (let j = 0; j < res[i].outMessages.size; j++) {
            const msg = res[i].outMessages.get(i)
            if (!msg || !msg.info.dest) continue

            const dc = await parseContract(client, msg.info.dest.toString())

            if (!dc) continue

            countracts.push(dc)
        }
    }

   return countracts
}

export async function parseContract(client: ApiClient, address: string): Promise<DeliveryContract | undefined> {
    const contract =
        CO2.fromAddress(Address.parse(address));


    const courierContract =
        client.open(contract) as OpenedContract<CO2>;
    let contr: DeliveryContract
    try {
        const info = await courierContract.getDeliveryInfo()
        const state = await courierContract.getState()
        contr = new DeliveryContract(
            info.description,

            info.declaredSum,
            info.courierFee,

            new Point(info.from.lat, info.from.lon),
            new Point(info.to.lat, info.to.lon),

            state
        )
    } catch (e) {
        return undefined
    }

    return contr
}

