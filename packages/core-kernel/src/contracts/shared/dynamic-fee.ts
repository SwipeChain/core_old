import { Interfaces } from "@swipechain/crypto";

export interface DynamicFeeContext {
    transaction: Interfaces.ITransaction;
    addonBytes: number;
    satoshiPerByte: number;
    height: number;
}
