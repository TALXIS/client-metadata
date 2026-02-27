import { DataTypeTypecode } from "./DataTypeTypecode";

export interface talxis_attributedefinition {
  talxis_attributedefinitionid: string;
  talxis_name: string;
  talxis_description: string;
  talxis_datatypetypecode: DataTypeTypecode;
  talxis_int_max?: number;
  talxis_int_min?: number;
  talxis_int_default?: number;
  talxis_decimal_max?: number;
  talxis_decimal_min?: number;
  talxis_decimal_precision?: number;
  talxis_decimal_default?: number;
  talxis_text_maxcharcount?: number;
  talxis_text_default?: string;
  talxis_bit_default?: boolean;
  _talxis_choice_default_value?: string;
  talxis_date_default?: string;
  talxis_datetime_userlocal_default?: string;
  talxis_datetime_tzi_default?: string;
  talxis_choice_default?: talxis_attributeoption;
  talxis_talxis_attributedefinition_talxis_attributeoption_attributedefinitionid?: talxis_attributeoption[];
}

export interface talxis_attributeoption {
  talxis_attributeoptionid: string;
  talxis_name: string;
  talxis_value: number;
  talxis_description: string;
  talxis_talxis_attributeoption_talxis_attributeoptionlabel_attributeoptionid?: talxis_attributeoptionlabel[];
}

export interface talxis_attributeoptionlabel {
  _talxis_attributeoptionid_value: string;
  talxis_name: string;
  talxis_language: number;
}
export interface ISerializedValue {
  raw: any;
  error: boolean;
  errorMessage?: string;
}