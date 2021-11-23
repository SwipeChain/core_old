import { Services, Types } from "@swipechain/core-kernel";
import { Handlers } from "@swipechain/core-transactions";
import { Interfaces } from "@swipechain/crypto";

export class RevertTransactionAction extends Services.Triggers.Action {
    public async execute(args: Types.ActionArguments): Promise<void> {
        const handler: Handlers.TransactionHandler = args.handler;
        const transaction: Interfaces.ITransaction = args.transaction;

        return handler.revert(transaction);
    }
}
