import { ISimpleEntityDefinition } from "../../../interfaces/entity/ISimpleEntityDefinition";

export class SimpleEntityDefinition {
    public static async get(): Promise<ISimpleEntityDefinition[]> {
        const response = await Xrm.WebApi.online.execute({
            Query: {
                Properties: {
                    PropertyNames: ["LogicalName", "MetadataId", "DisplayName"]
                }
            },
            getMetadata: function () {
                return {
                    parameterTypes: {
                        "Query": {
                            typeName: "Microsoft.Dynamics.CRM.EntityQueryExpression",
                            structuralProperty: 5
                        }
                    },
                    operationType: 1,
                    operationName: "RetrieveMetadataChanges"
                };
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to retrieve metadata changes: ${response.statusText}`);
        }
        const result = await response.json();
        const entities: ISimpleEntityDefinition[] = [];
        for (const entityMetadata of result.EntityMetadata) {
            entities.push({
                LogicalName: entityMetadata.LogicalName,
                MetadataId: entityMetadata.MetadataId,
                DisplayName: entityMetadata.DisplayName?.UserLocalizedLabel?.Label || ""
            });
        }
        return entities;
    }
}