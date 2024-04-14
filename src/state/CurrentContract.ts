import {hookstate} from "@hookstate/core";

import {SmartContract} from "../api/model/SmartContract.ts";

export const currentContract = hookstate({} as SmartContract)

