import { ISimpleEntityDefinition } from "../../interfaces/entity/ISimpleEntityDefinition";
import { IMetadataProvider } from "../../interfaces/IMetadataProvider";
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
}