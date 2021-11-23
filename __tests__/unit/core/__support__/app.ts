import { ApplicationFactory, Commands, Container, Services } from "@swipechain/core-cli";

export const executeCommand = async (command): Promise<void> => {
    const app = ApplicationFactory.make(new Container.Container(), {
        name: "@swipechain/core",
        version: "3.0.0-next.0",
    });

    app.rebind(Container.Identifiers.ApplicationPaths).toConstantValue(
        app.get<Services.Environment>(Container.Identifiers.Environment).getPaths("swipechain", "testnet"),
    );

    const cmd = app.resolve<Commands.Command>(command);

    cmd.register(["--token=swipechain", "--network=testnet"]);

    await cmd.run();
};
