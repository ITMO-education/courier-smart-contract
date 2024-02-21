import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient, Address } from "@ton/ton";
import Counter from "../wrappers/SmartDelivery"; // this is the interface class we just implemented

export async function run() {
    // initialize ton rpc client on testnet
    const endpoint = await getHttpEndpoint({ network: "testnet" });
    const client = new TonClient({ endpoint });

    // open Counter instance by address
    const counterAddress = Address.parse("EQCZzry3gu8_BKBs2vD-YQPTFMf291399qva9cdLjfg__JYh"); // replace with your address from step 8
    const counter = new Counter(counterAddress);
    const counterContract = client.open(counter);

    // call the getter on chain
    const counterValue = await counterContract.getCounter();
    console.log("value:", counterValue.toString());
}
