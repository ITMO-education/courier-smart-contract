import { Address, toNano } from '@ton/core';
import { CO2 } from '../wrappers/CO2';
import { NetworkProvider, sleep } from '@ton/blueprint';
import {contractID} from "./env";

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const address = Address.parse('EQDN6Y5OMlJzuFKTcd3SoQ6VTZL9wIqQsHiZyp9uTYHPAdpe')//args.length > 0 ? args[0] : await ui.input(contractID));

    if (!(await provider.isContractDeployed(address))) {
        ui.write(`Error: Contract at address ${address} is not deployed!`);
        return;
    }

    const cO2 = provider.open(CO2.fromAddress(address));

    await cO2.send(
        provider.sender(),
        {
            value: toNano('3'),
            bounce: false,
        },
        "start"
    );

    ui.write('Waiting for contract to start');
    ui.clearActionPrompt();
    ui.write('Contract started successfully!');
}
