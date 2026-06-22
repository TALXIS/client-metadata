import type { FormXmlSection } from "./schemaTypes";
import {
    generateGuid,
    makeLabels,
    type FormXmlBuilderControlOptions,
    type FormXmlBuilderFieldOptions,
    type FormXmlBuilderRowOptions,
    type FormXmlBuilderSectionOptions,
} from "./FormXmlBuilder.shared";
import { FormXmlRowBuilder } from "./FormXmlRowBuilder";

export class FormXmlSectionBuilder {
    private _rows: FormXmlRowBuilder[] = [];
    private _defaultLanguageCode: number;
    private _options?: FormXmlBuilderSectionOptions;

    constructor(defaultLanguageCode: number, options?: FormXmlBuilderSectionOptions) {
        this._defaultLanguageCode = defaultLanguageCode;
        this._options = options;
    }

    addRow(
        options: FormXmlBuilderRowOptions = {},
        configure?: (row: FormXmlRowBuilder) => void
    ): FormXmlRowBuilder {
        const rowBuilder = new FormXmlRowBuilder(this._defaultLanguageCode, options);
        if (configure) {
            configure(rowBuilder);
        }
        this._rows.push(rowBuilder);
        return rowBuilder;
    }

    addControl(options: FormXmlBuilderControlOptions): this {
        this.addRow({}, (row) => {
            row.addControl(options);
        });
        return this;
    }

    addField(options: FormXmlBuilderFieldOptions): this {
        return this.addControl(options);
    }

    addSpacer(): this {
        this.addRow({}, (row) => {
            row.addSpacer();
        });
        return this;
    }

    build(): FormXmlSection {
        const options = this._options;
        if (!options) {
            throw new Error("FormXmlSectionBuilder requires section options before build().");
        }

        const lcid = options.languageCode ?? this._defaultLanguageCode;
        return {
            name: options.name,
            id: options.id ?? `{${generateGuid()}}`,
            showlabel: options.showlabel ?? true,
            showbar: options.showbar ?? false,
            columns: options.columns ?? 1,
            visible: options.visible,
            ...(options.label ? { labels: makeLabels(options.label, lcid) } : {}),
            rows: { row: this._rows.map((row) => row.build()) },
        };
    }

    _buildRows() {
        return this._rows.map((row) => row.build());
    }
}
