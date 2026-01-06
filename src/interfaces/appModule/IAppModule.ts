import { IAppModuleBase } from "./IAppModuleBase";

export interface IAppModule extends IAppModuleBase {
    enableGlobalSearch: boolean | undefined;
    searchEnabledEntities: string[] | undefined;
    siteMapXml: string;
    descriptor: string;
}