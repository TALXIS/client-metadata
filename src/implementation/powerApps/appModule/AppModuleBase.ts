import { IAppModuleBase } from "../../../interfaces/appModule/IAppModuleBase";

export class AppModuleBase implements IAppModuleBase {
    appModuleId: string;
    name: string;
    uniqueName: string;
    description: string;
    icon: string;

    public static async fromUniqueNames(uniqueNames?: string[]): Promise<IAppModuleBase[]> {
        const response = await Xrm.WebApi.retrieveMultipleRecords("appmodule", `?$select=appmoduleid,descriptor,uniquename,name,description` +
            (uniqueNames ? `&$filter=Microsoft.Dynamics.CRM.In(PropertyName='uniquename',PropertyValues=[${uniqueNames.map(name => `'${name}'`).join(",")}])` : "")
        );

        return response.entities.map(entity => {
            const descriptor = JSON.parse(entity["descriptor"]);
            const appModuleBase = new AppModuleBase();
            appModuleBase.appModuleId = entity["appmoduleid"];
            appModuleBase.name = entity["name"];
            appModuleBase.uniqueName = entity["uniquename"];
            appModuleBase.description = entity["description"];
            appModuleBase.icon = descriptor["webResourceInfo"]?.["Name"] || null;
            return appModuleBase;
        });
    }
}