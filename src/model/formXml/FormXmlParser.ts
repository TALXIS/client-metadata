import {
    FORM_XML_ARRAY_CHILDREN,
    FORM_XML_BOOLEAN_ATTRIBUTES,
    FORM_XML_NUMBER_ATTRIBUTES,
    FORM_XML_OPAQUE_ELEMENTS,
    FORM_XML_ROOT,
    FORM_XML_TEXT_ELEMENTS
} from "./schema";
import { FormXml, FormXmlOpaqueElement, FormXmlOpaqueNode, FormXmlPrimitiveValue } from "./schemaTypes";
import {
    FormXmlValidationError,
    ParseFormXmlOptions
} from "./types";
import {
    parseXml,
    readAttributeValue,
    shouldKeepTextNode,
    shouldPreserveAsOpaque
} from "./xml";
import { validateFormXmlDocument } from "./validation";

export function parseFormXml(xml: string, options: ParseFormXmlOptions = {}): FormXml {
    const document = parseXml(xml, options.domAdapter);
    const root = document.documentElement;

    if (!root || root.nodeName !== FORM_XML_ROOT) {
        throw new FormXmlValidationError("FormXml root element must be <form>.", [{
            severity: "error",
            path: root ? `/${root.nodeName}` : "/",
            message: "FormXml root element must be <form>."
        }]);
    }

    const formXml = parseTypedElement(root, "", options) as FormXml;
    const issues = validateFormXmlDocument(formXml);
    const errors = options.strict ? issues.filter((issue) => issue.severity === "error") : [];

    if (errors.length > 0) {
        throw new FormXmlValidationError("FormXml validation failed.", errors);
    }

    return formXml;
}

export function parseFormXmlFragment(xml: string, options: ParseFormXmlOptions = {}): FormXmlOpaqueElement {
    const document = parseXml(xml, options.domAdapter);

    return parseOpaqueElement(document.documentElement, options);
}

function parseTypedElement(element: Element, parentName: string, options: ParseFormXmlOptions): unknown {
    if (FORM_XML_TEXT_ELEMENTS.has(element.nodeName)) {
        return readElementTextValue(element.nodeName, element.textContent ?? "");
    }

    if (shouldPreserveAsOpaque(parentName, element.nodeName)) {
        if (parentName === "customControl" && element.nodeName === "parameters") {
            return {
                additionalElements: parseOpaqueChildren(element, options)
            };
        }

        return parseOpaqueElement(element, options);
    }

    const model: Record<string, unknown> = readAttributes(element);

    for (const child of Array.from(element.childNodes)) {
        if (child.nodeType !== 1) {
            continue;
        }

        const childElement = child as Element;
        const childValue = parseTypedElement(childElement, element.nodeName, options);
        assignChild(model, childElement.nodeName, childValue);
    }

    return model;
}

function assignChild(model: Record<string, unknown>, name: string, value: unknown): void {
    if (FORM_XML_ARRAY_CHILDREN.has(name)) {
        const values = model[name] as unknown[] | undefined;
        model[name] = values ? [...values, value] : [value];
        return;
    }

    if (model[name] !== undefined) {
        const existing = model[name];
        model[name] = Array.isArray(existing) ? [...existing, value] : [existing, value];
        return;
    }

    model[name] = value;
}

function readAttributes(element: Element): Record<string, FormXmlPrimitiveValue> {
    const attributes: Record<string, FormXmlPrimitiveValue> = {};

    for (const attribute of Array.from(element.attributes)) {
        attributes[attribute.name] = readAttributeValue(attribute.name, attribute.value);
    }

    return attributes;
}

function readElementTextValue(name: string, value: string): FormXmlPrimitiveValue {
    const normalizedValue = value.trim();

    if (FORM_XML_BOOLEAN_ATTRIBUTES.has(name)) {
        return normalizedValue === "true" || normalizedValue === "1";
    }

    if (FORM_XML_NUMBER_ATTRIBUTES.has(name)) {
        const numericValue = Number(normalizedValue);
        return Number.isFinite(numericValue) ? numericValue : normalizedValue;
    }

    if (["RelationshipRoleOrdinal"].includes(name)) {
        const numericValue = Number(normalizedValue);
        return Number.isFinite(numericValue) ? numericValue : normalizedValue;
    }

    return normalizedValue;
}

function parseOpaqueChildren(element: Element, options: ParseFormXmlOptions): FormXmlOpaqueNode[] {
    const children: FormXmlOpaqueNode[] = [];

    for (const child of Array.from(element.childNodes)) {
        const opaqueChild = parseOpaqueNode(child, options);

        if (opaqueChild) {
            children.push(opaqueChild);
        }
    }

    return children;
}

function parseOpaqueNode(node: Node, options: ParseFormXmlOptions): FormXmlOpaqueNode | undefined {
    switch (node.nodeType) {
        case 1:
            return parseOpaqueElement(node as Element, options);
        case 3:
            if (node.textContent && shouldKeepTextNode(node.textContent, options.preserveWhitespace)) {
                return {
                    kind: "text",
                    value: node.textContent
                };
            }
            return undefined;
        case 4:
            return {
                kind: "cdata",
                value: node.textContent ?? ""
            };
        case 8:
            return {
                kind: "comment",
                value: node.textContent ?? ""
            };
        default:
            return undefined;
    }
}

function parseOpaqueElement(element: Element, options: ParseFormXmlOptions): FormXmlOpaqueElement {
    return {
        kind: "element",
        name: element.nodeName,
        attributes: readAttributes(element),
        children: parseOpaqueChildren(element, options)
    };
}

