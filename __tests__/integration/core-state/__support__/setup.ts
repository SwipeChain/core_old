import { Application, Container, Utils as AppUtils } from "@swipechain/core-kernel";
import { Sandbox } from "@swipechain/core-test-framework";
import { Managers } from "@swipechain/crypto";
import { EventEmitter } from "events";

EventEmitter.prototype.constructor = Object.prototype.constructor;

const sandbox: Sandbox = new Sandbox();

const transactionPoolQuery = null;
const transactionPoolService = null;
const peerNetworkMonitor = {
    boot: jest.fn(),
    cleansePeers: jest.fn(),
};
const peerRepository = null;

export const setUp = async (): Promise<Application> => {
    jest.setTimeout(60000);

    process.env.CORE_RESET_DATABASE = "1";

    sandbox.withCoreOptions({
        flags: {
            token: "sxp",
            network: "unitnet",
            env: "test",
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
                        { package: "@swipechain/core-blockchain" },
                    ],
                },
                relay: { plugins: [] },
                forger: { plugins: [] },
            },
        })
        .boot(async ({ app }) => {
            app.bind(Container.Identifiers.TransactionPoolQuery).toConstantValue(transactionPoolQuery);
            app.bind(Container.Identifiers.TransactionPoolService).toConstantValue(transactionPoolService);
            app.bind(Container.Identifiers.PeerNetworkMonitor).toConstantValue(peerNetworkMonitor);
            app.bind(Container.Identifiers.PeerRepository).toConstantValue(peerRepository);

            await app.bootstrap({
                flags: {
                    token: "sxp",
                    network: "unitnet",
                    env: "test",
                    processType: "core",
                },
            });

            Managers.configManager.getMilestone().aip11 = false;
            Managers.configManager.getMilestone().htlcEnabled = false;

            await app.boot();

            Managers.configManager.getMilestone().aip11 = true;
            Managers.configManager.getMilestone().aip37 = true;
            Managers.configManager.getMilestone().htlcEnabled = true;

            await AppUtils.sleep(1000);
        });

    return sandbox.app;
};

export const tearDown = async (): Promise<void> => {
    await sandbox.dispose();
};
