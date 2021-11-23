import { Interfaces } from "@swipechain/crypto";

export interface Collator {
    getBlockCandidateTransactions(): Promise<Interfaces.ITransaction[]>;
}
