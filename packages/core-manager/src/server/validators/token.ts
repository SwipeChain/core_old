import { Container, Providers } from "@swipechain/core-kernel";

import { Authentication } from "../../contracts";

@Container.injectable()
export class SimpleTokenValidator implements Authentication.TokenValidator {
    @Container.inject(Container.Identifiers.PluginConfiguration)
    @Container.tagged("plugin", "@swipechain/core-manager")
    private readonly configuration!: Providers.PluginConfiguration;

    public async validate(token: string): Promise<boolean> {
        const tokenToCompare = this.configuration.get("plugins.tokenAuthentication.token", undefined);

        if (!tokenToCompare) {
            return false;
        }

        return token === tokenToCompare;
    }
}
