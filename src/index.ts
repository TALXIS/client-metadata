// Interfaces
export { IMetadataProvider } from "./interfaces/IMetadataProvider";
export { IAppModule } from "./interfaces/appModule/IAppModule";
export { IAppModuleBase } from "./interfaces/appModule/IAppModuleBase";
export { IEntityDefinition } from "./interfaces/entity/IEntityDefinition";
export {
    Attribute,
    AttributeTypeEnum,
    AttributeTypeNameEnum,
    DateTimeBehaviorEnum,
    DateTimeFormat,
    IntegerFormat,
    LocalizedLabel,
    Option,
    OptionSetDefinition,
    RequiredLevelEnum,
    StringFormat
} from "./interfaces/entity/IEntityDefinition";
export { ISimpleEntityDefinition } from "./interfaces/entity/ISimpleEntityDefinition";

// Implementation
export { MetadataProviderFactory } from "./implementation/MetadataProviderFactory";
export { PowerAppsMetadataProvider } from "./implementation/powerApps/PowerAppsMetadataProvider";
export { DynamicAttributesMetadataProvider } from "./implementation/dynamicAttributes/DynamicAttributesMetadataProvider";

// Entity definitions
export { AppModule } from "./implementation/powerApps/appModule/AppModule";
export { AppModuleBase } from "./implementation/powerApps/appModule/AppModuleBase";
export { EntityDefinition } from "./implementation/powerApps/entity/EntityDefinition";
export { SimpleEntityDefinition } from "./implementation/powerApps/entity/SimpleEntityDefinition";
export { DynamicEntityDefinition } from "./implementation/dynamicAttributes/entity/DynamicEntityDefinition";

// FormXml
export {
    assertValidFormXmlDocument,
    FormXmlEnvironmentError,
    FormXmlError,
    FormXmlValidationError,
    isFormXmlGuid,
    isFormXmlPercentage,
    isFormXmlQueryStringParameterName,
    parseFormXml,
    serializeFormXml,
    validateFormXmlDocument
} from "./model/formXml/index";
export type {
    FormXmlDomAdapter,
    FormXmlValidationIssue,
    FormXmlValidationIssueSeverity,
    ParseFormXmlOptions,
    SerializeFormXmlOptions
} from "./model/formXml/index";
export type * from "./model/formXml/schemaTypes";
export {
    FormXmlBuilder,
    FormXmlColumnBuilder,
    FormXmlControlBuilder,
    FormXmlRowBuilder,
    FormXmlTabBuilder,
    FormXmlSectionBuilder,
} from "./model/formXml/FormXmlBuilder";
export type {
    FormXmlBuilderColumnOptions,
    FormXmlBuilderControlOptions,
    FormXmlBuilderRowOptions,
    FormXmlBuilderTabOptions,
    FormXmlBuilderSectionOptions,
    FormXmlBuilderFieldOptions,
} from "./model/formXml/FormXmlBuilder";

// XRM interfaces
export { IAttributeDescriptor } from "./implementation/powerApps/entity/xrm/IAttributeDescriptor";
export { IEntityDescriptor } from "./implementation/powerApps/entity/xrm/IEntityDescriptor";
