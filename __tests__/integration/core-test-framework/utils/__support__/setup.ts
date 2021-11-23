import { Identifiers as ApiIdentifiers, Server } from "@swipechain/core-api";
import { Application, Utils as AppUtils } from "@swipechain/core-kernel";
import { Managers } from "@swipechain/crypto";
import Hapi from "@hapi/hapi";
import { Sandbox } from "@packages/core-test-framework/src";
import { EventEmitter } from "events";

import { EchoController } from "./echo-controller";

EventEmitter.prototype.constructor = Object.prototype.constructor;

const sandbox: Sandbox = new Sandbox();

const registerEchoApi = (app: Application) => {
    const controller = app.resolve(EchoController);
    const apiServer = app.get<Server>(ApiIdentifiers.HTTP);

    apiServer.register({
        plugin: {
            name: "Echo API",
            version: "1.0.0",
            register(hapiServer: Hapi.Server): void {
                hapiServer.bind(controller);

                hapiServer.route({
                    method: "GET",
                    path: "/echo",
                    handler: controller.index,
                });

                hapiServer.route({
                    method: "POST",
                    path: "/echo",
                    handler: controller.index,
                });
            },
        },
        routes: { prefix: "/api" },
    });
};

export const setUp = async (): Promise<Application> => {
    jest.setTimeout(60000);

    process.env.DISABLE_P2P_SERVER = "true"; // no need for p2p socket server to run
    process.env.CORE_RESET_DATABASE = "1";

    sandbox.withCoreOptions({
        flags: {
            token: "sxp",
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
                        { package: "@swipechain/core-api" },
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
                        { package: "@swipechain/core-api" },
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
                    token: "sxp",
                    network: "unitnet",
                    env: "test",
                    processType: "core",
                },
            });

            Managers.configManager.getMilestone().aip11 = false;
            Managers.configManager.getMilestone().htlcEnabled = false;

            await app.boot();
            registerEchoApi(app);

            Managers.configManager.getMilestone().aip11 = true;
            Managers.configManager.getMilestone().htlcEnabled = true;

            await AppUtils.sleep(1000); // give some more time for api server to be up
        });

    return sandbox.app;
};

export const tearDown = async (): Promise<void> => {
    await sandbox.dispose();
};
