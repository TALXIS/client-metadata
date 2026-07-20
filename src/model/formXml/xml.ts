import {
    FormXmlDomAdapter,
    FormXmlElementNode,
    FormXmlError,
    FormXmlEnvironmentError,
    FormXmlPrimitiveValue
} from "./types";
import { FORM_XML_BOOLEAN_ATTRIBUTES, FORM_XML_NUMBER_ATTRIBUTES, FORM_XML_OPAQUE_ELEMENTS } from "./schema";

export function getDomParser(adapter?: FormXmlDomAdapter): DOMParser {
    const DOMParserCtor = adapter?.DOMParser ?? globalThis.DOMParser;

    if (!DOMParserCtor) {
        throw new FormXmlEnvironmentError("DOMParser is not available. FormXml parsing currently requires a browser DOM or a supplied DOM adapter.");
    }

    return new DOMParserCtor();
}

export function getXmlSerializer(adapter?: FormXmlDomAdapter): XMLSerializer {
    const XMLSerializerCtor = adapter?.XMLSerializer ?? globalThis.XMLSerializer;

    if (!XMLSerializerCtor) {
        throw new FormXmlEnvironmentError("XMLSerializer is not available. FormXml serialization currently requires a browser DOM or a supplied DOM adapter.");
    }

    return new XMLSerializerCtor();
}

export function createXmlDocument(rootName: string, adapter?: FormXmlDomAdapter): XMLDocument {
    const document = adapter?.document ?? globalThis.document;

    if (!document?.implementation?.createDocument) {
        throw new FormXmlEnvironmentError("Document.implementation.createDocument is not available. FormXml serialization currently requires a browser Document or a supplied DOM adapter.");
    }

    return document.implementation.createDocument(null, rootName);
}

export function parseXml(xml: string, adapter?: FormXmlDomAdapter): XMLDocument {
    const parsed = getDomParser(adapter).parseFromString(xml, "application/xml");
    const parserError = findParserError(parsed);

    if (parserError) {
        throw new FormXmlError(`Failed to parse FormXml: ${parserError}`);
    }

    return parsed;
}

export function serializeDomNode(node: Node, adapter?: FormXmlDomAdapter): string {
    return getXmlSerializer(adapter).serializeToString(node);
}

export function getElementChildren(element: Element): Element[] {
    return Array.from(element.childNodes).filter((node): node is Element => node.nodeType === 1);
}

export function getDirectChildElements(element: FormXmlElementNode, name: string): FormXmlElementNode[] {
    return element.children.filter((child): child is FormXmlElementNode => child.kind === "element" && child.name === name);
}

export function readAttributeValue(name: string, value: string): FormXmlPrimitiveValue {
    if (FORM_XML_BOOLEAN_ATTRIBUTES.has(name)) {
        if (value === "true" || value === "1") {
            return true;
        }

        if (value === "false" || value === "0") {
            return false;
        }
    }

    if (FORM_XML_NUMBER_ATTRIBUTES.has(name) && value !== "") {
        return parseNumericValue(value);
    }

    return value;
}

export function parseNumericValue(value: string): FormXmlPrimitiveValue {
    const numericValue = Number(value);

    return Number.isFinite(numericValue) ? numericValue : value;
}

export function formatAttributeValue(value: FormXmlPrimitiveValue): string {
    if (typeof value === "boolean") {
        return value ? "true" : "false";
    }

    return String(value);
}

export function shouldPreserveAsOpaque(parentName: string, elementName: string): boolean {
    if (FORM_XML_OPAQUE_ELEMENTS.has(elementName)) {
        return true;
    }

    return parentName === "customControl" && elementName === "parameters";
}

export function shouldKeepTextNode(value: string, preserveWhitespace?: boolean): boolean {
    return preserveWhitespace === true || value.trim().length > 0;
}

export function cloneNodeIntoDocument(node: Node, document: XMLDocument): Node {
    return document.importNode(node, true);
}

function findParserError(document: XMLDocument): string | undefined {
    const parserError = document.getElementsByTagName("parsererror")[0];

    if (!parserError) {
        return undefined;
    }

    return parserError.textContent?.trim() || "unknown XML parser error";
}
