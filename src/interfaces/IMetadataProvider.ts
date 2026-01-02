import { IEntityDefinition } from "./entity/IEntityDefinition";
import { ISimpleEntityDefinition } from "./entity/ISimpleEntityDefinition";

export interface IMetadataProvider {
    entity: {
        get(entityName: string): Promise<IEntityDefinition>;
        getAll(): Promise<ISimpleEntityDefinition[]>;
    },
    // savedQuery: {
    //     get(savedQueryId: string): Promise<any>;
    //     getQuickFindView(entityName: string): Promise<any[]>;
    //     getLookupView(entityName: string): Promise<any[]>;
    //     // This is to be discussed due to use of `talxis_userquery` entity and its caching etc.
    //     getViewNamesAndIds(entityName: string, options?: {
    //         viewIds?: string[],
    //         includeUserQueries?: boolean
    //     }): Promise<any[]>;
    // },
    // systemForm: {
    //     get(entityName?: string, formId?: string, formUniqueName?: string): Promise<any[]>;
    //     getDefaultQuickCreate(entityName?: string): Promise<any>;
    //     getEntityDefaultFormId(entityName: string): Promise<string>;
    //     getFormNamesAndIds(entityName: string, formType?: any): Promise<{ formid: string; name: string }[]>
    // },
    // appModule: {
    //     get(name: string): Promise<any>;
    //     getAll(): Promise<any[]>;
    // },
    // control: {
    //     get(name: string): Promise<any>;
    // },
    // webResource: {
    //     get(name: string): Promise<any>;
    // },
    // ribbon: {
    //     get(location: any, entityName?: string): Promise<any>;
    // },
    // optionSet: {
    //     get(name: string): Promise<any>;
    // }
}