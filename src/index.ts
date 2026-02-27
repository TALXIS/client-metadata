// Interfaces
export { IMetadataProvider } from "./interfaces/IMetadataProvider";
export { IAppModule } from "./interfaces/appModule/IAppModule";
export { IAppModuleBase } from "./interfaces/appModule/IAppModuleBase";
export { IEntityDefinition } from "./interfaces/entity/IEntityDefinition";
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

// XRM interfaces
export { IAttributeDescriptor } from "./implementation/powerApps/entity/xrm/IAttributeDescriptor";
export { IEntityDescriptor } from "./implementation/powerApps/entity/xrm/IEntityDescriptor";
