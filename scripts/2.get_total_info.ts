import { Address, toNano } from '@ton/core';
import { CO2 } from '../wrappers/CO2';
import { NetworkProvider, sleep } from '@ton/blueprint';
import {contractID} from "./env";

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const address = Address.parse('EQAx1VHIQbXV_H6cT_4V4goSZp6uViWCYcwmOQArC7o4ycHh')

    if (!(await provider.isContractDeployed(address))) {
        ui.write(`Error: Contract at address ${address} is not deployed!`);
        return;
    }

    const cO2 = provider.open(CO2.fromAddress(address));

    const ti = await cO2.getTotalInfo();
    console.log('woaw123', ti)
    ui.write('Waiting for contract to start');
    ui.clearActionPrompt();
    ui.write('Contract started successfully!');
}
