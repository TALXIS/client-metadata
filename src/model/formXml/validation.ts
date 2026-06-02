import {
    FORM_XML_ENUMS,
    FORM_XML_NUMBER_ATTRIBUTES,
    FORM_XML_TOP_LEVEL_ORDER
} from "./schema";
import { FormXml, FormXmlPrimitiveValue } from "./schemaTypes";
import {
    FormXmlValidationError,
    FormXmlValidationIssue
} from "./types";

const GUID_PATTERN = /^\{?[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\}?$/;
const PERCENTAGE_PATTERN = /^(100|[0-9]{1,2})%$/;
const QUERY_STRING_PARAMETER_NAME_PATTERN = /^(?![cC][rR][mM]_)([A-Za-z0-9])+_+([A-Za-z0-9_])*$/;

export function isFormXmlGuid(value: string): boolean {
    return GUID_PATTERN.test(value);
}

export function isFormXmlPercentage(value: string): boolean {
    return PERCENTAGE_PATTERN.test(value);
}

export function isFormXmlQueryStringParameterName(value: string): boolean {
    return QUERY_STRING_PARAMETER_NAME_PATTERN.test(value);
}

export function validateFormXmlDocument(document: FormXml): FormXmlValidationIssue[] {
    const issues: FormXmlValidationIssue[] = [];

    if (!document.tabs) {
        issues.push({
            severity: "error",
            path: "/form",
            message: "FormXml document must contain a tabs property."
        });
    }

    if (document.tabs?.tab && document.tabs.tab.length === 0) {
        issues.push({
            severity: "error",
            path: "/form/tabs",
            message: "FormXml tabs must contain at least one tab."
        });
    }

    validateTopLevelOrder(document, issues);
    validateObject(document as unknown as Record<string, unknown>, "/form", issues);

    return issues;
}

export function assertValidFormXmlDocument(document: FormXml): void {
    const issues = validateFormXmlDocument(document).filter((issue) => issue.severity === "error");

    if (issues.length > 0) {
        throw new FormXmlValidationError("FormXml validation failed.", issues);
    }
}

function validateObject(value: Record<string, unknown>, path: string, issues: FormXmlValidationIssue[]): void {
    for (const [name, propertyValue] of Object.entries(value)) {
        if (propertyValue === undefined || propertyValue === null || name === "additionalElements") {
            continue;
        }

        if (Array.isArray(propertyValue)) {
            propertyValue.forEach((item, index) => {
                if (isRecord(item)) {
                    validateObject(item, `${path}/${name}[${index}]`, issues);
                } else {
                    validatePrimitive(name, item as FormXmlPrimitiveValue, `${path}/${name}[${index}]`, issues);
                }
            });
            continue;
        }

        if (isRecord(propertyValue)) {
            validateObject(propertyValue, `${path}/${name}`, issues);
            continue;
        }

        validatePrimitive(name, propertyValue as FormXmlPrimitiveValue, `${path}/${name}`, issues);
    }
}

function validatePrimitive(name: string, value: FormXmlPrimitiveValue, path: string, issues: FormXmlValidationIssue[]): void {
    if (name === "solutionaction" && typeof value === "string" && !FORM_XML_ENUMS.solutionactionType.includes(value)) {
        issues.push({
            severity: "error",
            path,
            message: `Invalid solution action '${value}'.`
        });
    }

    if (typeof value === "string" && looksLikeGuidProperty(name) && !isFormXmlGuid(value)) {
        issues.push({
            severity: "error",
            path,
            message: `Property '${name}' must be a GUID.`
        });
    }

    if (name === "width" && typeof value === "string" && !isFormXmlPercentage(value)) {
        issues.push({
            severity: "error",
            path,
            message: "Column width must be a FormXml percentage value such as 50%."
        });
    }

    if (name === "name" && path.includes("querystringparameter") && typeof value === "string" && !isFormXmlQueryStringParameterName(value)) {
        issues.push({
            severity: "error",
            path,
            message: "Query string parameter names must contain an underscore and must not start with crm_."
        });
    }

    if (FORM_XML_NUMBER_ATTRIBUTES.has(name) && typeof value === "number" && !Number.isFinite(value)) {
        issues.push({
            severity: "error",
            path,
            message: `Property '${name}' must be numeric.`
        });
    }
}

function validateTopLevelOrder(document: FormXml, issues: FormXmlValidationIssue[]): void {
    const knownKeys = Object.keys(document).filter((key) => FORM_XML_TOP_LEVEL_ORDER.includes(key as any));
    let lastKnownIndex = -1;

    for (const key of knownKeys) {
        const currentIndex = FORM_XML_TOP_LEVEL_ORDER.indexOf(key as any);

        if (currentIndex < lastKnownIndex) {
            issues.push({
                severity: "warning",
                path: `/form/${key}`,
                message: `Top-level property '${key}' is not in the serializer's stable FormXml order.`
            });
        }

        lastKnownIndex = Math.max(lastKnownIndex, currentIndex);
    }
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !("kind" in value);
}

function looksLikeGuidProperty(name: string): boolean {
    return [
        "uniqueid",
        "classid",
        "labelid",
        "OptionSetId",
        "ViewId",
        "DefaultViewId",
        "TeamTemplateId",
        "LinkControlDefinitionId",
        "QueueId",
        "QueueViewId",
        "EntityViewId",
        "SavedQueryID",
        "QueueViewIdForSavedQuery",
        "Id"
    ].includes(name);
}

