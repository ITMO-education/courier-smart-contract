import getTonClient from "../ton/GetTonClient.ts";
import {CO2, DeliveryInfo} from "@itmo-education/courier-smart-contract";
import {Address, beginCell, OpenedContract, SenderArguments, storeStateInit, toNano} from "@ton/core";
import {TonPoint, toTonPoint} from "../api/model/Point.ts";
import {TonConnectUI} from "@tonconnect/ui-react";
import {register} from "../api/backend/api.ts";

export const CreateContract = async (tonConnectUI: TonConnectUI, declaredValue: number, courierFee: number, orderName: string, description: string, from: TonPoint, to: TonPoint) => {
    const client = await getTonClient();

    let c = {
        $$type: 'DeliveryInfo',
        declaredSum: toNano(declaredValue),
        courierFee: toNano(courierFee),
        name: orderName,
        description: description,
        from: toTonPoint(from),
        to: toTonPoint(to),
    } as DeliveryInfo

    const contract = client.open(await CO2.fromInit(c)) as OpenedContract<CO2>;

    if (tonConnectUI.account == null) {
        throw 'no account to send from'
    }

    const userAddress = Address.parse(tonConnectUI.account.address)

    async function send(args: SenderArguments) {
        if (!args.body) {
            throw 'no body lol'
        }

        if (!args.init || !args.init.code || !args.init.data) {
            throw 'no args init'
        }


        const stateInit = beginCell().store(storeStateInit(args.init)).endCell();

        await tonConnectUI.sendTransaction({
            validUntil: Math.floor(Date.now() / 1000) + 360,
            messages: [
                {
                    address: args.to.toRawString(),
                    amount: toNano('0.01').toString(),
                    payload: args.body.toBoc().toString('base64'),
                    stateInit: stateInit.toBoc().toString('base64'),
                }
            ]
        })


        if (tonConnectUI.account == null) {
            throw 'no account to send from'
        }

        await register({
            contract: {
                tonAddress: args.to.toString(),
                ownerAddress: userAddress.toString(),
            }
        })
    }


    await contract.send(
        {
            address: userAddress,
            send: send,
        },
        {
            value: toNano('1.1'),
            bounce: true
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    )
}
