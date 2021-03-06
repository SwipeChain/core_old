import { Commands, Container } from "@swipechain/core-cli";
import { Networks } from "@swipechain/crypto";
import Joi from "joi";
import { existsSync, removeSync } from "fs-extra";

/**
 * @export
 * @class Command
 * @extends {Commands.Command}
 */
@Container.injectable()
export class Command extends Commands.Command {
    /**
     * The console command signature.
     *
     * @type {string}
     * @memberof Command
     */
    public signature: string = "plugin:remove";

    /**
     * The console command description.
     *
     * @type {string}
     * @memberof Command
     */
    public description: string = "Removes a package and any packages that it depends on.";

    /**
     * Configure the console command.
     *
     * @returns {void}
     * @memberof Command
     */
    public configure(): void {
        this.definition
            .setFlag("token", "The name of the token.", Joi.string().default("swipechain"))
            .setFlag("network", "The name of the network.", Joi.string().valid(...Object.keys(Networks)))
            .setArgument("package", "The name of the package.", Joi.string().required());
    }

    /**
     * Execute the console command.
     *
     * @returns {Promise<void>}
     * @memberof Command
     */
    public async execute(): Promise<void> {
        const pkg: string = this.getArgument("package");

        let directory: string = this.app.getCorePath("data", `plugins/${pkg}`);

        if (!existsSync(directory)) {
            throw new Error(`The package [${pkg}] does not exist.`);
        }

        removeSync(directory);
    }
}
