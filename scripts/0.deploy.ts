import {CO2} from '../wrappers/CO2';
import {NetworkProvider} from '@ton/blueprint';
import { courierFee, declaredSum, operationFee } from './env/env';

export async function run(provider: NetworkProvider) {
    const smartContract = provider.open(
        await CO2.fromInit(
            {
                $$type: 'DeliveryInfo',
                declaredSum: declaredSum,
                courierFee: courierFee,
                description: "Код в озоне 1",
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
            value: operationFee,
            bounce: false
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(smartContract.address);
}
