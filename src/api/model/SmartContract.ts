import {Point} from "./Point.ts";

export interface SmartContract {
    address: string

    name: string
    description: string
    declaredValue: bigint;
    state: bigint

    ownerAddress: string

    courierAddress: string | undefined
    courierFee: bigint;

    to: Point
    from: Point
}
