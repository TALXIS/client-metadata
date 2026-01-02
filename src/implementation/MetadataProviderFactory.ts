import { IMetadataProvider } from "../interfaces/IMetadataProvider";

export class MetadataProviderFactory {
    public static async createMetadataProvider(): Promise<IMetadataProvider> {
        return new (await import("./powerApps/PowerAppsMetadataProvider")).PowerAppsMetadataProvider();
    }
}