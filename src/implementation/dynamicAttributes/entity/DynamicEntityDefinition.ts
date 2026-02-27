import { Attribute, AttributeTypeEnum, AttributeTypeNameEnum, DateTimeBehaviorEnum, DateTimeFormat, IEntityDefinition, IManyToManyRelationship, IRelationship, OptionSetDefinition, RequiredLevelEnum } from "../../../interfaces/entity/IEntityDefinition";
import { DataTypeTypecode } from "./talxis/DataTypeTypecode";
import { talxis_attributedefinition } from "./talxis/EntityTypes";

export class DynamicEntityDefinition implements IEntityDefinition {
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

    public static async fetchForRecord(entityName: string, recordId?: string): Promise<DynamicEntityDefinition> {
        const entityDefinition = new DynamicEntityDefinition();
        entityDefinition.LogicalName = entityName;

        const attributes = await Xrm.WebApi.retrieveMultipleRecords("talxis_attributedefinition",
            "?$filter=" +
                (recordId ? `(talxis_entityname eq '${entityName}' and talxis_recordid eq '${recordId}') or ` : "") +
                `(talxis_entityname eq '${entityName}' and talxis_recordid eq null) or ` +
                `(talxis_entityname eq null and talxis_recordid eq null)` +
            `&$expand=talxis_talxis_attributedefinition_talxis_attributeoption_attributedefinitionid`
        );

        for (const attribute of attributes.entities as talxis_attributedefinition[]) {
            const attr: Attribute = {
                talxis_AttributeId: attribute.talxis_attributedefinitionid,
                talxis_IsDynamic: true,

                EntityLogicalName: entityName,
                LogicalName: attribute.talxis_attributedefinitionid,
                IsPrimaryId: false,
                IsPrimaryName: false,
                Description: attribute.talxis_description,
                DisplayName: attribute.talxis_name,
                RequiredLevel: RequiredLevelEnum.None,
                AttributeOf: "",
                AttributeType: this.mapDataType(attribute.talxis_datatypetypecode),
                AttributeTypeName: this.mapDataTypeName(attribute.talxis_datatypetypecode),
                IsValidForAdvancedFind: true,
                IsValidForGrid: true,
                MaxLength: attribute.talxis_datatypetypecode === DataTypeTypecode.Text ? attribute.talxis_text_maxcharcount : undefined,
                MaxValue: attribute.talxis_datatypetypecode === DataTypeTypecode.NumberWhole ? attribute.talxis_int_max :
                    attribute.talxis_datatypetypecode === DataTypeTypecode.NumberDecimal ? attribute.talxis_decimal_max : undefined,
                MinValue: attribute.talxis_datatypetypecode === DataTypeTypecode.NumberWhole ? attribute.talxis_int_min :
                    attribute.talxis_datatypetypecode === DataTypeTypecode.NumberDecimal ? attribute.talxis_decimal_min : undefined,
                Precision: attribute.talxis_datatypetypecode === DataTypeTypecode.NumberDecimal ? attribute.talxis_decimal_precision : undefined,
                Behavior: attribute.talxis_datatypetypecode === DataTypeTypecode.DateTimeUserLocal ? DateTimeBehaviorEnum.UserLocal :
                    attribute.talxis_datatypetypecode === DataTypeTypecode.DateTimeTZI ? DateTimeBehaviorEnum.TimeZoneIndependent : undefined,
                Format: attribute.talxis_datatypetypecode === DataTypeTypecode.Date ? DateTimeFormat.DateOnly :
                    attribute.talxis_datatypetypecode === DataTypeTypecode.DateTimeUserLocal || attribute.talxis_datatypetypecode === DataTypeTypecode.DateTimeTZI ?
                        DateTimeFormat.DateAndTime : undefined,
            };
            if(attribute.talxis_datatypetypecode === DataTypeTypecode.Choice || attribute.talxis_datatypetypecode === DataTypeTypecode.Boolean) {
                if(attribute.talxis_datatypetypecode === DataTypeTypecode.Boolean) {
                    if(attribute.talxis_talxis_attributedefinition_talxis_attributeoption_attributedefinitionid?.length !== 2) {
                        console.warn(`Boolean attribute ${attribute.talxis_name} does not have exactly 2 options defined. Skipping option set mapping.`, attribute);
                        continue;
                    }
                }
                attr.OptionSet = {
                    DisplayName: attribute.talxis_name,
                    Description: attribute.talxis_description,
                    Options: attribute.talxis_talxis_attributedefinition_talxis_attributeoption_attributedefinitionid?.map(option => ({
                        Value: option.talxis_value,
                        Label: option.talxis_name,
                        Description: option.talxis_description,
                        talxis_OptionId: option.talxis_attributeoptionid
                    })) || []
                };
            }

            entityDefinition.Attributes.push(attr);
        }
        
        return entityDefinition;
    }

    private static mapDataType(dataTypeCode: DataTypeTypecode): AttributeTypeEnum {
        switch (dataTypeCode) {
            case DataTypeTypecode.Text:
                return AttributeTypeEnum.String;
            case DataTypeTypecode.NumberWhole:
                return AttributeTypeEnum.Integer;
            case DataTypeTypecode.NumberDecimal:
                return AttributeTypeEnum.Decimal;
            case DataTypeTypecode.Choice:
                return AttributeTypeEnum.Picklist;
            case DataTypeTypecode.Boolean:
                return AttributeTypeEnum.Boolean;
            case DataTypeTypecode.Date:
            case DataTypeTypecode.DateTimeUserLocal:
            case DataTypeTypecode.DateTimeTZI:
                return AttributeTypeEnum.DateTime;
            default:
                throw new Error(`Unsupported data type code: ${dataTypeCode}`);
        }
    }

    private static mapDataTypeName(dataTypeCode: DataTypeTypecode): AttributeTypeNameEnum {
        switch (dataTypeCode) {
            case DataTypeTypecode.Text:
                return AttributeTypeNameEnum.StringType;
            case DataTypeTypecode.NumberWhole:
                return AttributeTypeNameEnum.IntegerType;
            case DataTypeTypecode.NumberDecimal:
                return AttributeTypeNameEnum.DecimalType;
            case DataTypeTypecode.Choice:
                return AttributeTypeNameEnum.PicklistType;
            case DataTypeTypecode.Boolean:
                return AttributeTypeNameEnum.BooleanType;
            case DataTypeTypecode.Date:
            case DataTypeTypecode.DateTimeUserLocal:
            case DataTypeTypecode.DateTimeTZI:
                return AttributeTypeNameEnum.DateTimeType;
            default:
                throw new Error(`Unsupported data type code: ${dataTypeCode}`);
        }
    }
}