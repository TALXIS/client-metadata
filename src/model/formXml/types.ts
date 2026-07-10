import type {
    FormXml,
    FormXmlOpaqueCData,
    FormXmlOpaqueComment,
    FormXmlOpaqueElement,
    FormXmlOpaqueNode,
    FormXmlOpaqueText,
    FormXmlPrimitiveValue
} from "./schemaTypes";

export interface FormXmlAttributes {
    [name: string]: FormXmlPrimitiveValue;
}

export type FormXmlNode = FormXmlElementNode | FormXmlTextNode | FormXmlCDataNode | FormXmlCommentNode;

export interface FormXmlElementNode {
    kind: "element";
    name: string;
    attributes: FormXmlAttributes;
    children: FormXmlNode[];
    opaque?: boolean;
}

export interface FormXmlTextNode {
    kind: "text";
    value: string;
}

export interface FormXmlCDataNode {
    kind: "cdata";
    value: string;
}

export interface FormXmlCommentNode {
    kind: "comment";
    value: string;
}

export type FormXmlDocument = FormXml;

export interface FormXmlDomAdapter {
    DOMParser?: typeof DOMParser;
    XMLSerializer?: typeof XMLSerializer;
    document?: Document;
}

export interface ParseFormXmlOptions {
    strict?: boolean;
    domAdapter?: FormXmlDomAdapter;
    preserveWhitespace?: boolean;
}

export interface SerializeFormXmlOptions {
    strict?: boolean;
    domAdapter?: FormXmlDomAdapter;
    xmlDeclaration?: boolean;
}

export type FormXmlValidationIssueSeverity = "error" | "warning";

export interface FormXmlValidationIssue {
    severity: FormXmlValidationIssueSeverity;
    path: string;
    message: string;
}

export class FormXmlError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "FormXmlError";
    }
}

export class FormXmlEnvironmentError extends FormXmlError {
    constructor(message: string) {
        super(message);
        this.name = "FormXmlEnvironmentError";
    }
}

export class FormXmlValidationError extends FormXmlError {
    public readonly issues: FormXmlValidationIssue[];

    constructor(message: string, issues: FormXmlValidationIssue[]) {
        super(message);
        this.name = "FormXmlValidationError";
        this.issues = issues;
    }
}

export type {
    FormXml,
    FormXmlOpaqueCData,
    FormXmlOpaqueComment,
    FormXmlOpaqueElement,
    FormXmlOpaqueNode,
    FormXmlOpaqueText,
    FormXmlPrimitiveValue
};

