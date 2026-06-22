import type { FormXmlCell, FormXmlControl } from "./schemaTypes";
import { generateGuid, makeLabels, type FormXmlBuilderControlOptions } from "./FormXmlBuilder.shared";

export class FormXmlControlBuilder {
    private _defaultLanguageCode: number;
    private _options: FormXmlBuilderControlOptions;

    constructor(defaultLanguageCode: number, options: FormXmlBuilderControlOptions) {
        this._defaultLanguageCode = defaultLanguageCode;
        this._options = options;
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
}
