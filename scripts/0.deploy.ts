import {Address, toNano} from '@ton/core';
import {CO2} from '../wrappers/CO2';
import {NetworkProvider} from '@ton/blueprint';
import {Point} from "../build/CO2/tact_CO2";

export async function run(provider: NetworkProvider) {
    const cO2 = provider.open(
        await CO2.fromInit(
            Address.parseFriendly("0QB5Bk8hiyoLtUw50CtvaqbIdhR7AJOBVSK9kGxxQ0Ko4mbj").address,
            {
                $$type: 'DeliveryInfo',
                declaredSum: toNano(1),
                courierFee: toNano(0.5),
                description: 'description',
                from: {
                    $$type: 'Point',
                    lat: BigInt(1),
                    lon: BigInt(1),
                },
                to: {
                    $$type: 'Point',
                    lat: BigInt(1),
                    lon: BigInt(1),
                },
            },
        ),
    );

    await cO2.send(
        provider.sender(),
        {
            value: toNano('1.1'),
            bounce: false
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(cO2.address);

    console.log(await cO2.getBalance());
    console.log(await cO2.getOwner());
    console.log(await cO2.getDeliveryInfo());
    console.log(await cO2.getState());
}
