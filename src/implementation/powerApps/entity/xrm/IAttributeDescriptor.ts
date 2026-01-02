import { AttributeTypeNameEnum, DateTimeFormat, IntegerFormat, StringFormat } from "../../../../interfaces/entity/IEntityDefinition";

export interface IAttributeDescriptor {
    Description: string;
    RequiredLevel: number;
    AttributeOf: string;
    AttributeType: number;
    AttributeTypeName: AttributeTypeNameEnum;
    IsValidForAdvancedFind: boolean;
    IsValidForGrid: boolean;
    Format?: IntegerFormat | StringFormat | DateTimeFormat;
    Behavior?: number;
    Targets?: string[];
    MaxLength?: number;
    MaxValue?: number;
    MinValue?: number;
    Precision?: number;
    DefaultValue?: number;
    OptionSet?: Option[];
}

interface Option {
    Value: number;
    Label: string;
    Color?: string;
    DefaultStatus?: number;
    State?: number;
}