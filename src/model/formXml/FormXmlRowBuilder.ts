import type { FormXmlCell, FormXmlControlDescription, FormXmlRow } from "./schemaTypes";
import {
    type FormXmlBuilderControlOptions,
    type FormXmlBuilderFieldOptions,
    type FormXmlBuilderRowOptions,
} from "./FormXmlBuilder.shared";
import { FormXmlControlBuilder } from "./FormXmlControlBuilder";

export class FormXmlRowBuilder {
    private _cells: Array<FormXmlCell | FormXmlControlBuilder> = [];
    private _defaultLanguageCode: number;
    private _options: FormXmlBuilderRowOptions;

    constructor(defaultLanguageCode: number, options: FormXmlBuilderRowOptions = {}) {
        this._defaultLanguageCode = defaultLanguageCode;
        this._options = options;
    }

    addCell(cell: FormXmlCell | FormXmlControlBuilder): this {
        this._cells.push(cell);
        return this;
    }

    addControl(
        options: FormXmlBuilderControlOptions,
        configure?: (control: FormXmlControlBuilder) => void
    ): FormXmlControlBuilder {
        const controlBuilder = new FormXmlControlBuilder(this._defaultLanguageCode, options);
        if (configure) {
            configure(controlBuilder);
        }
        this.addCell(controlBuilder);
        return controlBuilder;
    }

    addField(options: FormXmlBuilderFieldOptions): this {
        this.addControl(options);
        return this;
    }

    addSpacer(): this {
        this.addCell({ userspacer: true });
        return this;
    }

    build(): FormXmlRow {
        const cells = this._cells.map((cellOrBuilder) =>
            cellOrBuilder instanceof FormXmlControlBuilder ? cellOrBuilder.build() : cellOrBuilder
        );

        return {
            height: this._options.height,
            ...(cells.length > 0 ? { cell: cells } : {}),
        };
    }

    _buildRow(): FormXmlRow {
        return this.build();
    }

    _buildControlDescriptions(): FormXmlControlDescription[] {
        return this._cells.flatMap((cellOrBuilder) => {
            if (!(cellOrBuilder instanceof FormXmlControlBuilder)) {
                return [];
            }

            const controlDescription = cellOrBuilder._buildControlDescription();
            return controlDescription ? [controlDescription] : [];
        });
    }
}
