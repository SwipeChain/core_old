import { Container, Contracts, Utils } from "@swipechain/core-kernel";
import { Interfaces } from "@swipechain/crypto";

// todo: review its implementation and finally integrate it as planned in v2
@Container.injectable()
export class TransactionStore extends Utils.CappedMap<string, Interfaces.ITransactionData>
    implements Contracts.State.TransactionStore {
    public push(value: Interfaces.ITransactionData): void {
        Utils.assert.defined<string>(value.id);

        super.set(value.id, value);
    }
}
