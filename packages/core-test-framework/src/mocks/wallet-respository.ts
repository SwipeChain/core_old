import { Wallets } from "@swipechain/core-state";
import { Utils } from "@swipechain/crypto";

let mockNonce: Utils.BigNumber = Utils.BigNumber.make(1);

export const setNonce = (nonce: Utils.BigNumber) => {
    mockNonce = nonce;
};

class WalletRepositoryMock implements Partial<Wallets.WalletRepository> {
    public getNonce(publicKey: string): Utils.BigNumber {
        return mockNonce;
    }
}

export const instance = new WalletRepositoryMock();
