export interface IEntityDefinition {
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
}

export enum RelationshipType {
    OneToMany = "OneToManyRelationship",
    ManyToMany = "ManyToManyRelationship"
}
export interface IRelationship {
    SchemaName: string;
    RelationshipType: RelationshipType;
    ReferencedAttribute: string;
    ReferencedEntity: string;
    ReferencingAttribute: string;
    ReferencingEntity: string;
    ReferencedEntityNavigationPropertyName: string;
    ReferencingEntityNavigationPropertyName: string;
    IsValidForAdvancedFind: boolean;
}
export interface IManyToManyRelationship {
    SchemaName: string;
    RelationshipType: RelationshipType;
    Entity1LogicalName: string;
    Entity1IntersectAttribute: string;
    Entity1NavigationPropertyName: string;
    Entity2LogicalName: string;
    Entity2IntersectAttribute: string;
    Entity2NavigationPropertyName: string;
    IntersectEntityName: string;
    IsValidForAdvancedFind: boolean;
}
export type DateTimeBehaviorType = "None" | "UserLocal" | "TimeZoneIndependent" | "DateOnly";

export interface Attribute {
    EntityLogicalName: string;
    LogicalName: string;
    IsPrimaryId: boolean;
    IsPrimaryName: boolean;
    Description: string;
    DisplayName: string;
    RequiredLevel: RequiredLevelEnum;
    AttributeOf: string;
    AttributeType: AttributeTypeEnum;
    AttributeTypeName: AttributeTypeNameEnum;
    IsValidForAdvancedFind: boolean;
    IsValidForGrid: boolean;
    Format?: IntegerFormat | StringFormat | DateTimeFormat;
    Behavior?: DateTimeBehaviorEnum;

    Targets?: string[];
    MaxLength?: number;
    MaxValue?: number;
    MinValue?: number;
    Precision?: number;
    OptionSet?: OptionSetDefinition;
    DefaultFormValue?: number;
    DefaultValue?: number;
    MaxSizeInKB?: number;
}

export enum IntegerFormat {
    None = "None",
    Duration = "Duration",
    TimeZone = "TimeZone",
    Language = "Language",
    Locale = "Locale",
}
export enum StringFormat {
    Email = "Email",
    Text = "Text",
    TextArea = "TextArea",
    Url = "Url",
    TickerSymbol = "TickerSymbol",
    PhoneticGuide = "PhoneticGuide",
    VersionNumber = "VersionNumber",
    Phone = "Phone",
    Json = "Json",
    RichText = "RichText",
}
export enum DateTimeFormat {
    DateOnly = "DateOnly",
    DateAndTime = "DateAndTime",
}

export enum DateTimeBehaviorEnum {
    None = 0,
    UserLocal = 1,
    DateOnly = 2,
    TimeZoneIndependent = 3
}

export enum RequiredLevelEnum {
    None = 0,
    SystemRequired = 1,
    ApplicationRequired = 2,
    Recommended = 3
}
export enum AttributeTypeEnum {
    Boolean = 0,
    Customer = 1,
    DateTime = 2,
    Decimal = 3,
    Double = 4,
    Integer = 5,
    Lookup = 6,
    Memo = 7,
    Money = 8,
    Owner = 9,
    PartyList = 10,
    Picklist = 11,
    State = 12,
    Status = 13,
    String = 14,
    Uniqueidentifier = 15,
    CalendarRules = 16,
    Virtual = 17,
    BigInt = 18,
    ManagedProperty = 19,
    EntityName = 20,
}

export enum AttributeTypeNameEnum {
    DateTimeType = "datetime",
    ImageType = "image",
    IntegerType = "integer",
    FileType = "file",
    BooleanType = "boolean",
    CustomerType = "customer",
    MemoType = "memo",
    MultiSelectPicklistType = "multiselectpicklist",
    MoneyType = "money",
    DecimalType = "decimal",
    DoubleType = "double",
    LookupType = "lookup",
    BigIntType = "bigint",
    UniqueidentifierType = "uniqueidentifier",
    StringType = "string",
    OwnerType = "owner",
    PicklistType = "picklist",
    StateType = "state",
    StatusType = "status",
    EntityNameType = "entityname"
}

export interface LocalizedLabel {
    Label: string;
    LanguageCode: number;
}

export interface OptionSetDefinition {
    DisplayName: string;
    Description: string;
    Options: Option[];
}

export interface Option {
    Value: number;
    Label: string;
    Description?: string;
    Color?: string;
    DefaultStatus?: number;
    State?: number;
}