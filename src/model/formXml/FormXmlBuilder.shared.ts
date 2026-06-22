import type {
    FormXmlCustomControl,
    FormXmlCustomControlParameters,
    FormXmlLabels,
    FormXmlOpaqueNode,
    FormXmlPercentage,
    FormXmlPrimitiveValue,
} from "./schemaTypes";

export function generateGuid(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export function makeLabels(text: string, languageCode: number): FormXmlLabels {
    return { label: [{ description: text, languagecode: languageCode }] };
}

export interface FormXmlBuilderTabOptions {
    name: string;
    label?: string;
    id?: string;
    showlabel?: boolean;
    verticallayout?: boolean;
    visible?: boolean;
    languageCode?: number;
}

export interface FormXmlBuilderColumnOptions {
    width?: FormXmlPercentage;
}

export interface FormXmlBuilderSectionOptions {
    name: string;
    label?: string;
    id?: string;
    showlabel?: boolean;
    showbar?: boolean;
    columns?: number;
    visible?: boolean;
    languageCode?: number;
}

export interface FormXmlBuilderRowOptions {
    height?: string;
}

export interface FormXmlBuilderControlOptions {
    datafieldname: string;
    classid: string;
    id?: string;
    cellId?: string;
    label?: string;
    visible?: boolean;
    disabled?: boolean;
    required?: boolean;
    showlabel?: boolean;
    rowspan?: number;
    colspan?: number;
    availableforphone?: boolean;
    languageCode?: number;
    /**
     * Helper for root-level `<controlDescriptions>` authoring. These entries are
     * declared next to the control in builder code, but serialized under the
     * form's `<controlDescriptions>` collection with `forControl` derived from
     * the built control id.
     */
    customControls?: FormXmlBuilderCustomControl[];
}

export interface FormXmlBuilderFieldOptions extends FormXmlBuilderControlOptions {}

export interface FormXmlBuilderCustomControlParameterDescriptor {
    value: FormXmlPrimitiveValue;
    [attributeName: string]: FormXmlPrimitiveValue;
}

export type FormXmlBuilderCustomControlParameterValue =
    | FormXmlPrimitiveValue
    | FormXmlBuilderCustomControlParameterDescriptor;

export interface FormXmlBuilderCustomControlParameters {
    /**
     * Escape hatch for advanced scenarios where callers want to provide raw
     * opaque nodes under `<parameters>` directly.
     */
    additionalElements?: FormXmlOpaqueNode[];
    [parameterName: string]:
        | FormXmlOpaqueNode[]
        | FormXmlBuilderCustomControlParameterValue
        | undefined;
}

export interface FormXmlBuilderCustomControl extends Omit<FormXmlCustomControl, "parameters"> {
    parameters?: FormXmlBuilderCustomControlParameters | FormXmlCustomControlParameters;
}
