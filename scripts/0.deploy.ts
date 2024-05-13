import { toNano} from '@ton/core';
import {CO2} from '../wrappers/CO2';
import {NetworkProvider} from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const smartContract = provider.open(
        await CO2.fromInit(
            {
                $$type: 'DeliveryInfo',
                declaredSum: toNano(10.1),
                courierFee: toNano(1.5),
                description: "Код в озоне 1234",
                name: "Дом книги",
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
