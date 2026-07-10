import type {
    FormXmlCell,
    FormXmlControl,
    FormXmlControlDescription,
    FormXmlCustomControl,
    FormXmlCustomControlParameters,
    FormXmlOpaqueElement,
    FormXmlOpaqueNode,
    FormXmlPrimitiveValue,
} from "./schemaTypes";
import {
    generateGuid,
    makeLabels,
    type FormXmlBuilderControlOptions,
    type FormXmlBuilderCustomControl,
    type FormXmlBuilderCustomControlParameterValue,
} from "./FormXmlBuilder.shared";

export class FormXmlControlBuilder {
    private _defaultLanguageCode: number;
    private _options: FormXmlBuilderControlOptions;
    private _customControls: FormXmlCustomControl[];

    constructor(defaultLanguageCode: number, options: FormXmlBuilderControlOptions) {
        this._defaultLanguageCode = defaultLanguageCode;
        this._options = options;
        this._customControls = (options.customControls ?? []).map((customControl) => normalizeCustomControl(customControl));
    }

    /**
     * Adds a custom control declaration that will be serialized through the
     * form's root-level `<controlDescriptions>` collection for this control.
     */
    addCustomControl(customControl: FormXmlBuilderCustomControl): this {
        this._customControls.push(normalizeCustomControl(customControl));
        return this;
    }

    setCustomControls(customControls: FormXmlBuilderCustomControl[]): this {
        this._customControls = customControls.map((customControl) => normalizeCustomControl(customControl));
        return this;
    }

    build(): FormXmlCell {
        const lcid = this._options.languageCode ?? this._defaultLanguageCode;
        const controlId = this._options.id ?? this._options.datafieldname;
        const labels = this._options.label ? makeLabels(this._options.label, lcid) : undefined;
        const control: FormXmlControl = {
            id: controlId,
            classid: this._options.classid,
            datafieldname: this._options.datafieldname,
            disabled: this._options.disabled,
            isrequired: this._options.required,
            ...(labels ? { labels } : {}),
        };

        return {
            id: this._options.cellId ?? `{${generateGuid()}}`,
            showlabel: this._options.showlabel ?? true,
            visible: this._options.visible,
            rowspan: this._options.rowspan,
            colspan: this._options.colspan,
            availableforphone: this._options.availableforphone,
            ...(labels ? { labels } : {}),
            control,
        };
    }

    _buildCell(): FormXmlCell {
        return this.build();
    }

    _buildControlDescription(): FormXmlControlDescription | undefined {
        if (this._customControls.length === 0) {
            return undefined;
        }

        return {
            forControl: this._options.id ?? this._options.datafieldname,
            customControl: [...this._customControls],
        };
    }
}

function normalizeCustomControl(customControl: FormXmlBuilderCustomControl): FormXmlCustomControl {
    return {
        ...customControl,
        ...(customControl.parameters ? { parameters: normalizeCustomControlParameters(customControl.parameters) } : {}),
    };
}

function normalizeCustomControlParameters(parameters: NonNullable<FormXmlBuilderCustomControl["parameters"]>): FormXmlCustomControlParameters {
    const additionalElements = [...(parameters.additionalElements ?? [])];

    for (const [parameterName, parameterValue] of Object.entries(parameters)) {
        if (parameterName === "additionalElements" || parameterValue === undefined) {
            continue;
        }

        additionalElements.push(createParameterElement(parameterName, parameterValue));
    }

    return additionalElements.length > 0 ? { additionalElements } : {};
}

function createParameterElement(
    parameterName: string,
    parameterValue: FormXmlBuilderCustomControlParameterValue
): FormXmlOpaqueElement {
    if (isPrimitiveValue(parameterValue)) {
        return {
            kind: "element",
            name: parameterName,
            attributes: {},
            children: [{ kind: "text", value: String(parameterValue) }],
        };
    }

    const { value, ...attributeEntries } = parameterValue;
    const attributes: Record<string, FormXmlPrimitiveValue> = {};
    for (const [attributeName, attributeValue] of Object.entries(attributeEntries)) {
        if (attributeValue !== undefined) {
            attributes[attributeName] = attributeValue;
        }
    }

    return {
        kind: "element",
        name: parameterName,
        attributes,
        children: [{ kind: "text", value: String(value) }],
    };
}

function isPrimitiveValue(value: FormXmlBuilderCustomControlParameterValue): value is FormXmlPrimitiveValue {
    return ["string", "number", "boolean"].includes(typeof value);
}
