import type { FormXmlLabels, FormXmlPercentage } from "./schemaTypes";

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
}

export interface FormXmlBuilderFieldOptions extends FormXmlBuilderControlOptions {}
