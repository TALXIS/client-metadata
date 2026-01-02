import { IManyToManyRelationship, IRelationship } from "../../../../interfaces/entity/IEntityDefinition";

export interface IEntityDescriptor {
    AttributeNames: string[];
    Id: {
        guid: string;
    };
    OneToManyRelationShips: { [key: string]: IRelationship };
    ManyToOneRelationships: { [key: string]: IRelationship };
    ManyToManyRelationships: { [key: string]: IManyToManyRelationship };
}