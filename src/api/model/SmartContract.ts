import {TonPoint} from "./Point.ts";

export interface SmartContract {
    address: string

    name: string
    description: string
    declaredValue: bigint;
    state: bigint

    ownerAddress: string

    courierAddress: string | undefined
    courierFee: bigint;

    to: TonPoint
    from: TonPoint
}
