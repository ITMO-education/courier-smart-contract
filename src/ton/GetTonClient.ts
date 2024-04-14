import {getHttpEndpoint} from '@orbs-network/ton-access';
import {TonClient} from "@ton/ton";
import memoize from "lodash.memoize";

const useTonClient = async () => {
    return new TonClient(
        {
            endpoint: await getHttpEndpoint({network: 'testnet'}
            )
        })
}


export default memoize(useTonClient)
