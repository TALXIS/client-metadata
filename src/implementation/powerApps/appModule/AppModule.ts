import { IAppModule } from "../../../interfaces/appModule/IAppModule";

export class AppModule implements IAppModule {
    appModuleId: string
    name: string;
    uniqueName: string;
    description: string;
    icon: string
    enableGlobalSearch: boolean | undefined;
    searchEnabledEntities: string[] | undefined;
    siteMapXml: string;
    descriptor: string;

    public static async fromUniqueName(uniqueName: string): Promise<IAppModule> {
        const response = await Xrm.WebApi.retrieveMultipleRecords("appmodule", `?$select=appmoduleid,descriptor,uniquename,name,description&$filter=uniquename eq '${uniqueName}'`);

        if (response.entities.length === 0) {
            throw new Error(`AppModule with uniqueName '${uniqueName}' not found.`);
        }

        const entity = response.entities[0];
        const descriptor = JSON.parse(entity["descriptor"]);
        const components = descriptor["appInfo"]["Components"];

        const appModule = new AppModule();
        appModule.appModuleId = entity["appmoduleid"];
        appModule.name = entity["name"];
        appModule.uniqueName = entity["uniquename"];
        appModule.description = entity["description"];
        appModule.icon = descriptor["webResourceInfo"]?.["Name"] || null;
        // TODO: Resolve in future from talxis_website
        appModule.enableGlobalSearch = undefined;
        appModule.searchEnabledEntities = undefined;
        
        const siteMap = await Xrm.WebApi.retrieveRecord("sitemap", components.find((x: any) => x["Type"] === 62)["Id"], `?$select=sitemapxml`);
        appModule.siteMapXml = siteMap["sitemapxml"];

        // TODO: Resolve descriptor types for forms and views
        const formsToResolve = components.filter((x: any) => x["Type"] === 60);
        const viewsToResolve = components.filter((x: any) => x["Type"] === 26);
        const resolvedFormsRequest = Xrm.WebApi.retrieveMultipleRecords("systemform", `?$select=formid,objecttypecode&$filter=Microsoft.Dynamics.CRM.In(PropertyName='formid',PropertyValues=[${formsToResolve.map((x: any) => `'${x["Id"]}'`).join(",")}])`);
        const resolvedViewsRequest = Xrm.WebApi.retrieveMultipleRecords("savedquery", `?$select=savedqueryid,returnedtypecode&$filter=Microsoft.Dynamics.CRM.In(PropertyName='savedqueryid',PropertyValues=[${viewsToResolve.map((x: any) => `'${x["Id"]}'`).join(",")}])`);
        await Promise.all([resolvedFormsRequest, resolvedViewsRequest]);
        const resolvedForms = (await resolvedFormsRequest).entities;
        const resolvedViews = (await resolvedViewsRequest).entities;
        for (const form of resolvedForms) {
            formsToResolve.find((x: any) => x["Id"] === form["formid"])["EntityName"] = form["objecttypecode"];
        }
        for (const view of resolvedViews) {
            viewsToResolve.find((x: any) => x["Id"] === view["savedqueryid"])["EntityName"] = view["returnedtypecode"];
        }

        appModule.descriptor = JSON.stringify(descriptor);

        return appModule;
    }
}