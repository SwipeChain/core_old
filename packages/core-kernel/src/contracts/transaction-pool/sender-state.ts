import { Interfaces } from "@swipechain/crypto";

export interface SenderState {
    apply(transaction: Interfaces.ITransaction): Promise<void>;
    revert(transaction: Interfaces.ITransaction): Promise<void>;
}
