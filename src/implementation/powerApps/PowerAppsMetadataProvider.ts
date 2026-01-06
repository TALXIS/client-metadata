import { ISimpleEntityDefinition } from "../../interfaces/entity/ISimpleEntityDefinition";
import { IMetadataProvider } from "../../interfaces/IMetadataProvider";
import { AppModule } from "./appModule/AppModule";
import { AppModuleBase } from "./appModule/AppModuleBase";
import { EntityDefinition } from "./entity/EntityDefinition";
import { SimpleEntityDefinition } from "./entity/SimpleEntityDefinition";

export class PowerAppsMetadataProvider implements IMetadataProvider {
    entity = {
        async get(entityName: string): Promise<any> {
            return EntityDefinition.fromEntityName(entityName);
        },
        async getAll(): Promise<ISimpleEntityDefinition[]> {
            return SimpleEntityDefinition.get();
        }
    };
    appModule = {
        async get(uniqueName: string): Promise<AppModule> {
            return AppModule.fromUniqueName(uniqueName);
        },
        async getMultiple(uniqueNames?: string[]): Promise<AppModuleBase[]> {
            return AppModuleBase.fromUniqueNames(uniqueNames);
        }
    };
}