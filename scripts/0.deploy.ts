import { toNano} from '@ton/core';
import {CO2} from '../wrappers/CO2';
import {NetworkProvider} from '@ton/blueprint';
import TonConnect   from '@tonconnect/sdk';

export async function run(provider: NetworkProvider) {
    const smartContract = provider.open(
        await CO2.fromInit(
            {
                $$type: 'DeliveryInfo',
                declaredSum: toNano(1),
                courierFee: toNano(0.5),
                description: "Ozon. Code is 5678",
                name: "TON White paper by N.Durov and P.Durov",
                from: {
                    $$type: 'Point',
                    lat: BigInt(1),
                    lon: BigInt(12),
                },
                to: {
                    $$type: 'Point',
                    lat: BigInt(1),
                    lon: BigInt(1),
                },
            },
        ),
    );

    await smartContract.send(
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

    await provider.waitForDeploy(smartContract.address);

    console.log(await smartContract.getBalance());
    console.log(await smartContract.getOwner());
    console.log(await smartContract.getDeliveryInfo());
    console.log(await smartContract.getState());
}
