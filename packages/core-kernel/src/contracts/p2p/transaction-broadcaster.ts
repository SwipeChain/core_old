import { Interfaces } from "@swipechain/crypto";

export interface TransactionBroadcaster {
    broadcastTransactions(transactions: Interfaces.ITransaction[]): Promise<void>;
}
