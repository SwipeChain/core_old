import { Container, Contracts, Providers, Services } from "@swipechain/core-kernel";
import Joi from "joi";

import { PinoLogger } from "./driver";

export class ServiceProvider extends Providers.ServiceProvider {
    public async register(): Promise<void> {
        const logManager: Services.Log.LogManager = this.app.get<Services.Log.LogManager>(
            Container.Identifiers.LogManager,
        );

        await logManager.extend("pino", async () =>
            this.app.resolve<Contracts.Kernel.Logger>(PinoLogger).make(this.config().all()),
        );

        logManager.setDefaultDriver("pino");
    }

    public async dispose(): Promise<void> {
        // todo: destroy console stream
        // todo: destroy file stream
    }

    public configSchema(): object {
        return Joi.object({
            levels: Joi.object({
                console: Joi.string().required(),
                file: Joi.string().required(),
            }).required(),
            fileRotator: Joi.object({
                interval: Joi.string().required(),
            }).required(),
        }).unknown(true);
    }
}
