import { Application, Container, Contracts, Utils as AppUtils } from "@swipechain/core-kernel";
import { Managers, Utils } from "@swipechain/crypto";
import { ServiceProvider } from "@packages/core-api/src";
import { Sandbox } from "@packages/core-test-framework/src";
import { EventEmitter } from "events";
import { resolve } from "path";

EventEmitter.prototype.constructor = Object.prototype.constructor;

const sandbox: Sandbox = new Sandbox();

export const setUp = async (): Promise<Application> => {
    jest.setTimeout(60000);

    process.env.DISABLE_P2P_SERVER = "true"; // no need for p2p socket server to run
    process.env.CORE_RESET_DATABASE = "1";

    sandbox.withCoreOptions({
        flags: {
            token: "ark",
            network: "unitnet",
            env: "test",
        },
        peers: {
            list: [{ ip: "127.0.0.1", port: 4000 }], // need some peers defined for the app to run
        },
    });

    await sandbox
        .withCoreOptions({
            app: {
                core: {
                    plugins: [
                        { package: "@swipechain/core-state" },
                        { package: "@swipechain/core-database" },
                        { package: "@swipechain/core-transactions" },
                        { package: "@swipechain/core-magistrate-transactions" },
                        { package: "@swipechain/core-transaction-pool" },
                        { package: "@swipechain/core-p2p" },
                        { package: "@swipechain/core-blockchain" },
                        { package: "@swipechain/core-forger" },
                    ],
                },
                relay: {
                    plugins: [
                        { package: "@swipechain/core-state" },
                        { package: "@swipechain/core-database" },
                        { package: "@swipechain/core-transactions" },
                        { package: "@swipechain/core-transaction-pool" },
                        { package: "@swipechain/core-p2p" },
                        { package: "@swipechain/core-blockchain" },
                    ],
                },
                forger: {
                    plugins: [{ package: "@swipechain/core-forger" }],
                },
            },
        })
        .boot(async ({ app }) => {
            await app.bootstrap({
                flags: {
                    token: "ark",
                    network: "unitnet",
                    env: "test",
                    processType: "core",
                },
            });

            // We need to manually register the service provider from source so that jest can collect coverage.
            sandbox.registerServiceProvider({
                name: "@swipechain/core-api",
                path: resolve(__dirname, "../../../../packages/core-api"),
                klass: ServiceProvider,
            });

            Managers.configManager.getMilestone().aip11 = false;
            Managers.configManager.getMilestone().htlcEnabled = false;

            await app.boot();

            Managers.configManager.getMilestone().aip11 = true;
            Managers.configManager.getMilestone().htlcEnabled = true;

            await AppUtils.sleep(1000); // give some more time for api server to be up
        });

    return sandbox.app;
};

export const tearDown = async (): Promise<void> => {
    await sandbox.dispose();
};

export const calculateRanks = async () => {
    const walletRepository = sandbox.app.getTagged<Contracts.State.WalletRepository>(
        Container.Identifiers.WalletRepository,
        "state",
        "blockchain",
    );

    const delegateWallets = Object.values(
        walletRepository.allByUsername(),
    ).sort((a: Contracts.State.Wallet, b: Contracts.State.Wallet) =>
        b
            .getAttribute<Utils.BigNumber>("delegate.voteBalance")
            .comparedTo(a.getAttribute<Utils.BigNumber>("delegate.voteBalance")),
    );

    AppUtils.sortBy(delegateWallets, (wallet) => wallet.getPublicKey()).forEach((delegate, i) => {
        const wallet = walletRepository.findByPublicKey(delegate.getPublicKey()!);
        wallet.setAttribute("delegate.rank", i + 1);

        walletRepository.index(wallet);
    });
};
