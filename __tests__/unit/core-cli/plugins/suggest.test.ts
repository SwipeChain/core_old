import { Container } from "@swipechain/core-cli";
import { Console } from "@swipechain/core-test-framework";
import { SuggestCommand } from "@packages/core-cli/src/plugins/suggest";
import { blue, red } from "kleur";
import prompts from "prompts";

let cli;
let cmd;
beforeEach(() => {
    cli = new Console();
    cmd = cli.app.resolve(SuggestCommand);
});

describe("SuggestCommand", () => {
    it("should immediately return if there is no signature", async () => {
        expect(await cmd.execute({ signature: "", signatures: [], bin: "swipechain" })).toBeUndefined();
    });

    it("should immediately return if there are no signatures", async () => {
        expect(await cmd.execute({ signature: "topic:command", signatures: [], bin: "swipechain" })).toBeUndefined();
    });

    it("should update the bin help if a topic is found", async () => {
        const spyWarning = jest.spyOn(cli.app.get(Container.Identifiers.Warning), "render");

        prompts.inject([true]);

        await cmd.execute({ signature: "topic:command", signatures: ["topic:command1"], bin: "swipechain" });

        expect(spyWarning).toHaveBeenCalledWith(`${red("topic:command")} is not a swipechain command.`);
    });

    it("should throw if suggestion is not confirmed", async () => {
        const spyInfo = jest.spyOn(cli.app.get(Container.Identifiers.Info), "render");

        prompts.inject([false]);

        await cmd.execute({
            signature: "topic:command",
            signatures: ["topic:command1"],
            bin: "swipechain",
        });

        expect(spyInfo).toHaveBeenCalledWith(`Run ${blue("swipechain help")} for a list of available commands.`);
    });
});
