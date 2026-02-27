import { ISimpleEntityDefinition } from "../../interfaces/entity/ISimpleEntityDefinition";
import { IMetadataProvider } from "../../interfaces/IMetadataProvider";
import { AppModule } from "../powerApps/appModule/AppModule";
import { AppModuleBase } from "../powerApps/appModule/AppModuleBase";
import { DynamicEntityDefinition } from "./entity/DynamicEntityDefinition";

export class DynamicAttributesMetadataProvider implements IMetadataProvider {
    entity = {
        async get(entityName: string, recordId?: string): Promise<any> {
            if (!recordId) {
                throw new Error("Record ID is required to retrieve dynamic attributes.");
            }
            return DynamicEntityDefinition.fetchForRecord(entityName, recordId);
        },
        async getAll(): Promise<ISimpleEntityDefinition[]> {
            throw new Error("Method not implemented.");
        }
    };
    appModule = {
        async get(uniqueName: string): Promise<AppModule> {
            throw new Error("Method not implemented.");
        },
        async getMultiple(uniqueNames?: string[]): Promise<AppModuleBase[]> {
            throw new Error("Method not implemented.");
        }
    };
}