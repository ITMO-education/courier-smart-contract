import getTonClient from "../ton/GetTonClient.ts";
import {CO2, DeliveryInfo} from "@itmo-education/courier-smart-contract";
import {Address, beginCell, OpenedContract, SenderArguments, storeStateInit, toNano} from "@ton/core";
import {TonPoint, toTonPoint} from "../api/model/Point.ts";
import { TonConnectUI} from "@tonconnect/ui-react";


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

    const address = Address.parse('0QB5Bk8hiyoLtUw50CtvaqbIdhR7AJOBVSK9kGxxQ0Ko4mbj')

    await contract.send(
        {
            address: address,
            send: async (args: SenderArguments) => {

                if (!args.body) {
                   throw 'no body lol'
                }

                if (!args.init || !args.init.code || !args.init.data) {
                    throw 'no args init'
                }

                // return


                const stateInit = beginCell().
                    store(storeStateInit(args.init)).endCell();

                tonConnectUI.sendTransaction({
                    validUntil: Math.floor(Date.now() / 1000) + 360,
                    messages: [
                        {
                            address: args.to.toRawString(),
                            amount: toNano('1.1').toString(),
                            payload: args.body.toBoc().toString('base64'),
                            stateInit: stateInit.toBoc().toString('base64'),
                        }
                    ]
                }).then((r)=> console.log('transaction response', r)).catch(r=>console.log('error sending tx',r))

            },
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

    // client.isContractDeployed(contract.address).then((r) => console.log('деплоед? ', r))
}
