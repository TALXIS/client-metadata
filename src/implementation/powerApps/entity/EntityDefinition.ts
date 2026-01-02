import { Attribute, IEntityDefinition, IManyToManyRelationship, IRelationship, Option, OptionSetDefinition, RelationshipType } from "../../../interfaces/entity/IEntityDefinition";
import { IAttributeDescriptor } from "./xrm/IAttributeDescriptor";
import { IEntityDescriptor } from "./xrm/IEntityDescriptor";

export class EntityDefinition implements IEntityDefinition {
    LogicalName: string;
    PrimaryNameAttribute: string;
    PrimaryIdAttribute: string;
    EntitySetName: string;
    Description: string;
    DisplayName: string;
    DisplayCollectionName: string;
    MetadataId: string;
    IsActivity: boolean;
    IsQuickCreateEnabled: boolean;
    PrimaryImageAttribute: string;
    IsValidForAdvancedFind: boolean;

    OneToManyRelationships: IRelationship[];
    ManyToOneRelationships: IRelationship[];
    ManyToManyRelationships: IManyToManyRelationship[];

    Attributes: Attribute[];

    constructor() { }
    
    public static async fromEntityName(entityName: string): Promise<EntityDefinition> {
        const entityMetadata = await Xrm.Utility.getEntityMetadata(entityName);
        // @ts-ignore - entityDescriptor is not part of Xrm typings
        const entityMetadataWithAttributes = await Xrm.Utility.getEntityMetadata(entityName, entityMetadata._entityDescriptor.AttributeNames);
        // @ts-ignore - entityDescriptor is not part of Xrm typings
        const entityDescriptor: IEntityDescriptor = entityMetadataWithAttributes._entityDescriptor as IEntityDescriptor;
        
        const entityDefinition = new EntityDefinition();
        entityDefinition.LogicalName = entityMetadata.LogicalName;
        entityDefinition.PrimaryNameAttribute = entityMetadata.PrimaryNameAttribute;
        entityDefinition.PrimaryIdAttribute = entityMetadata.PrimaryIdAttribute;
        entityDefinition.EntitySetName = entityMetadata.EntitySetName;
        entityDefinition.Description = entityMetadata.Description?.UserLocalizedLabel?.Label || "";
        entityDefinition.DisplayName = entityMetadata.DisplayName?.UserLocalizedLabel?.Label || "";
        entityDefinition.DisplayCollectionName = entityMetadata.DisplayCollectionName?.UserLocalizedLabel?.Label || "";
        entityDefinition.MetadataId = entityDescriptor.Id.guid;
        entityDefinition.IsActivity = entityMetadata.IsActivity;
        entityDefinition.IsQuickCreateEnabled = entityMetadata.IsQuickCreateEnabled;
        entityDefinition.PrimaryImageAttribute = entityMetadata.PrimaryImageAttribute;
        entityDefinition.IsValidForAdvancedFind = entityMetadata.IsValidForAdvancedFind;

        entityDefinition.OneToManyRelationships = [];
        for (const relationship of Object.values(entityDescriptor.OneToManyRelationShips)) {
            entityDefinition.OneToManyRelationships.push({
                SchemaName: relationship.SchemaName,
                RelationshipType: RelationshipType.OneToMany,
                ReferencedAttribute: relationship.ReferencedAttribute,
                ReferencedEntity: relationship.ReferencedEntity,
                ReferencingAttribute: relationship.ReferencingAttribute,
                ReferencingEntity: relationship.ReferencingEntity,
                ReferencedEntityNavigationPropertyName: relationship.ReferencedEntityNavigationPropertyName,
                ReferencingEntityNavigationPropertyName: relationship.ReferencingEntityNavigationPropertyName,
                IsValidForAdvancedFind: relationship.IsValidForAdvancedFind
            });
        }
        entityDefinition.ManyToOneRelationships = [];
        for (const relationship of Object.values(entityDescriptor.ManyToOneRelationships)) {
            entityDefinition.ManyToOneRelationships.push({
                SchemaName: relationship.SchemaName,
                RelationshipType: RelationshipType.OneToMany,
                ReferencedAttribute: relationship.ReferencedAttribute,
                ReferencedEntity: relationship.ReferencedEntity,
                ReferencingAttribute: relationship.ReferencingAttribute,
                ReferencingEntity: relationship.ReferencingEntity,
                ReferencedEntityNavigationPropertyName: relationship.ReferencedEntityNavigationPropertyName,
                ReferencingEntityNavigationPropertyName: relationship.ReferencingEntityNavigationPropertyName,
                IsValidForAdvancedFind: relationship.IsValidForAdvancedFind
            });
        }
        entityDefinition.ManyToManyRelationships = [];
        for (const relationship of Object.values(entityDescriptor.ManyToManyRelationships)) {
            entityDefinition.ManyToManyRelationships.push({
                SchemaName: relationship.SchemaName,
                RelationshipType: RelationshipType.ManyToMany,
                Entity1LogicalName: relationship.Entity1LogicalName,
                Entity1IntersectAttribute: relationship.Entity1IntersectAttribute,
                Entity1NavigationPropertyName: relationship.Entity1NavigationPropertyName,
                Entity2LogicalName: relationship.Entity2LogicalName,
                Entity2IntersectAttribute: relationship.Entity2IntersectAttribute,
                Entity2NavigationPropertyName: relationship.Entity2NavigationPropertyName,
                IntersectEntityName: relationship.IntersectEntityName,
                IsValidForAdvancedFind: relationship.IsValidForAdvancedFind
            });
        }
        entityDefinition.Attributes = [];
        const attributeDetailsResponse = await Xrm.WebApi.online.execute({
            Query: {
                Criteria: {
                    FilterOperator: "And",
                    Conditions: [{
                        ConditionOperator: "Equals",
                        PropertyName: "LogicalName",
                        Value: {
                            Type: "System.String",
                            Value: entityDefinition.LogicalName
                        }
                    }]
                },
                Properties: {
                    PropertyNames: ["Attributes"]
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
        const attributeDetails = await attributeDetailsResponse.json();

        for (const attributeName of entityDescriptor.AttributeNames) {
            const attribute = attributeDetails.EntityMetadata[0].Attributes.find((attr: any) => attr.LogicalName === attributeName);
            const attributeMetadata = entityMetadataWithAttributes.Attributes.get(attributeName);
            // @ts-ignore - attributeDescriptor is not part of Xrm typings
            const attributeDescriptor = attributeMetadata.attributeDescriptor as IAttributeDescriptor;

            let optionSet: OptionSetDefinition = undefined;
            if (attributeMetadata.OptionSet) {
                if(attribute.OptionSet.TrueOption || attribute.OptionSet.FalseOption) {
                    attribute.OptionSet.Options = [attribute.OptionSet.TrueOption, attribute.OptionSet.FalseOption];
                }
                optionSet = {
                    DisplayName: attribute.DisplayName?.UserLocalizedLabel?.Label || "",
                    Description: attribute.Description?.UserLocalizedLabel?.Label || "",
                    Options: attributeDescriptor.OptionSet?.map(o => {
                        const option: Option = {
                            Value: o.Value,
                            Label: o.Label,
                            Color: o.Color,
                            DefaultStatus: o.DefaultStatus,
                            State: o.State,
                            Description: attribute.OptionSet.Options.find((opt: any) => opt.Value === o.Value)?.Description?.UserLocalizedLabel?.Label || ""
                        };
                        return option;
                    })
                };
            }

            entityDefinition.Attributes.push({
                EntityLogicalName: attributeMetadata.EntityLogicalName,
                LogicalName: attributeMetadata.LogicalName,
                IsPrimaryId: attributeName === entityDefinition.PrimaryIdAttribute,
                IsPrimaryName: attributeName === entityDefinition.PrimaryNameAttribute,
                Description: attributeDescriptor.Description,
                DisplayName: attributeMetadata.DisplayName,
                RequiredLevel: attributeDescriptor.RequiredLevel,
                AttributeOf: attributeDescriptor.AttributeOf,
                AttributeType: attributeMetadata.AttributeType.valueOf(),
                AttributeTypeName: attributeDescriptor.AttributeTypeName,
                IsValidForAdvancedFind: attributeDescriptor.IsValidForAdvancedFind,
                IsValidForGrid: attributeDescriptor.IsValidForGrid,
                Format: attributeDescriptor.Format,
                Behavior: attributeDescriptor.Behavior,
                Targets: attributeDescriptor.Targets,
                DefaultFormValue: attributeMetadata.DefaultFormValue,
                MaxLength: attributeDescriptor.MaxLength,
                MaxValue: attributeDescriptor.MaxValue,
                MinValue: attributeDescriptor.MinValue,
                Precision: attributeDescriptor.Precision,
                DefaultValue: attributeDescriptor.DefaultValue,
                OptionSet: optionSet,
                MaxSizeInKB: attribute.MaxSizeInKB
            });
        }

        return entityDefinition;
    };
}