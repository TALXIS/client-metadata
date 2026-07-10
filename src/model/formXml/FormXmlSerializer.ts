import { FORM_XML_ARRAY_CHILDREN, FORM_XML_ELEMENT_ORDER, FORM_XML_ROOT, FORM_XML_TEXT_ELEMENTS } from "./schema";
import { FormXml, FormXmlOpaqueElement, FormXmlOpaqueNode, FormXmlPrimitiveValue } from "./schemaTypes";
import {
    FormXmlValidationError,
    SerializeFormXmlOptions
} from "./types";
import {
    createXmlDocument,
    formatAttributeValue,
    serializeDomNode
} from "./xml";
import { validateFormXmlDocument } from "./validation";

export function serializeFormXml(form: FormXml, options: SerializeFormXmlOptions = {}): string {
    if (options.strict) {
        const errors = validateFormXmlDocument(form).filter((issue) => issue.severity === "error");

        if (errors.length > 0) {
            throw new FormXmlValidationError("FormXml validation failed.", errors);
        }
    }

    const document = createXmlDocument(FORM_XML_ROOT, options.domAdapter);

    applyTypedElement(document.documentElement, FORM_XML_ROOT, form as unknown as Record<string, unknown>, document);

    const serialized = serializeDomNode(document, options.domAdapter);

    if (options.xmlDeclaration) {
        return serialized.startsWith("<?xml") ? serialized : `<?xml version="1.0"?>${serialized}`;
    }

    return serialized.replace(/^<\?xml[^>]*\?>/, "");
}

export function serializeFormXmlElement(element: FormXmlOpaqueElement, options: SerializeFormXmlOptions = {}): string {
    const document = createXmlDocument(element.name, options.domAdapter);

    applyOpaqueElement(document.documentElement, element, document);

    return serializeDomNode(document.documentElement, options.domAdapter);
}

function applyTypedElement(target: Element, elementName: string, model: Record<string, unknown>, document: XMLDocument): void {
    for (const [name, value] of Object.entries(model)) {
        if (value === undefined || value === null || isChildProperty(elementName, name) || name === "additionalElements" || name === "additionalAttributes") {
            continue;
        }

        target.setAttribute(name, formatAttributeValue(value as FormXmlPrimitiveValue));
    }

    const additionalAttributes = model.additionalAttributes as Record<string, FormXmlPrimitiveValue> | undefined;

    if (additionalAttributes) {
        for (const [name, value] of Object.entries(additionalAttributes)) {
            target.setAttribute(name, formatAttributeValue(value));
        }
    }

    for (const childName of getOrderedChildNames(elementName, model)) {
        const value = model[childName];

        if (value === undefined || value === null) {
            continue;
        }

        appendChildValue(target, childName, value, document);
    }

    const additionalElements = model.additionalElements as FormXmlOpaqueNode[] | undefined;

    if (additionalElements) {
        for (const additionalElement of additionalElements) {
            target.appendChild(createOpaqueNode(additionalElement, document));
        }
    }
}

function appendChildValue(parent: Element, childName: string, value: unknown, document: XMLDocument): void {
    if (Array.isArray(value)) {
        for (const item of value) {
            appendChildValue(parent, childName, item, document);
        }
        return;
    }

    const childElement = document.createElement(childName);

    if (isOpaqueElement(value)) {
        parent.appendChild(createOpaqueNode(value, document));
        return;
    }

    if (isPrimitive(value) || FORM_XML_TEXT_ELEMENTS.has(childName)) {
        childElement.textContent = value === undefined || value === null ? "" : String(value);
        parent.appendChild(childElement);
        return;
    }

    applyTypedElement(childElement, childName, value as Record<string, unknown>, document);
    parent.appendChild(childElement);
}

function getOrderedChildNames(elementName: string, model: Record<string, unknown>): string[] {
    const order = FORM_XML_ELEMENT_ORDER[elementName] ?? [];
    const orderedNames = order.filter((name) => model[name] !== undefined);
    const extraNames = Object.keys(model).filter((name) => !orderedNames.includes(name) && isChildProperty(elementName, name));

    return [...orderedNames, ...extraNames];
}

function isChildProperty(elementName: string, propertyName: string): boolean {
    const order = FORM_XML_ELEMENT_ORDER[elementName];

    if (order?.includes(propertyName)) {
        return true;
    }

    return FORM_XML_ARRAY_CHILDREN.has(propertyName);
}

function createOpaqueNode(node: FormXmlOpaqueNode, document: XMLDocument): Node {
    switch (node.kind) {
        case "element": {
            const element = document.createElement(node.name);
            applyOpaqueElement(element, node, document);
            return element;
        }
        case "text":
            return document.createTextNode(node.value);
        case "cdata":
            return document.createCDATASection(node.value);
        case "comment":
            return document.createComment(node.value);
    }
}

function applyOpaqueElement(target: Element, source: FormXmlOpaqueElement, document: XMLDocument): void {
    for (const [name, value] of Object.entries(source.attributes)) {
        target.setAttribute(name, formatAttributeValue(value));
    }

    for (const child of source.children) {
        target.appendChild(createOpaqueNode(child, document));
    }
}

function isOpaqueElement(value: unknown): value is FormXmlOpaqueElement {
    return typeof value === "object" && value !== null && (value as FormXmlOpaqueElement).kind === "element";
}

function isPrimitive(value: unknown): value is FormXmlPrimitiveValue {
    return ["string", "number", "boolean"].includes(typeof value);
}
