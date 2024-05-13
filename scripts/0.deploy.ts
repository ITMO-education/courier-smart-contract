import { toNano} from '@ton/core';
import {CO2} from '../wrappers/CO2';
import {NetworkProvider} from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const smartContract = provider.open(
        await CO2.fromInit(
            {
                $$type: 'DeliveryInfo',
                declaredSum: toNano(1),
                courierFee: toNano(0.5),
                description: "Ozone Code is 5679",
                name: "TON White paper by N.Durov and P.Durov ver1",
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
}
