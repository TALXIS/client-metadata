import type { FormXmlColumn, FormXmlControlDescription, FormXmlTab } from "./schemaTypes";
import {
    generateGuid,
    makeLabels,
    type FormXmlBuilderColumnOptions,
    type FormXmlBuilderSectionOptions,
    type FormXmlBuilderTabOptions,
} from "./FormXmlBuilder.shared";
import { FormXmlColumnBuilder } from "./FormXmlColumnBuilder";
import { FormXmlSectionBuilder } from "./FormXmlSectionBuilder";

export class FormXmlTabBuilder {
    private _columns: FormXmlColumnBuilder[] = [];
    private _defaultLanguageCode: number;
    private _defaultColumn?: FormXmlColumnBuilder;
    private _options?: FormXmlBuilderTabOptions;

    constructor(defaultLanguageCode: number, options?: FormXmlBuilderTabOptions) {
        this._defaultLanguageCode = defaultLanguageCode;
        this._options = options;
    }

    addColumn(
        options: FormXmlBuilderColumnOptions = {},
        configure?: (column: FormXmlColumnBuilder) => void
    ): FormXmlColumnBuilder {
        const columnBuilder = new FormXmlColumnBuilder(this._defaultLanguageCode, options);
        if (configure) {
            configure(columnBuilder);
        }
        this._columns.push(columnBuilder);
        return columnBuilder;
    }

    addSection(
        options: FormXmlBuilderSectionOptions,
        configure?: (section: FormXmlSectionBuilder) => void
    ): this {
        this.getOrCreateDefaultColumnBuilder().addSection(options, configure);
        return this;
    }

    build(): FormXmlTab {
        const options = this._options;
        if (!options) {
            throw new Error("FormXmlTabBuilder requires tab options before build().");
        }

        const lcid = options.languageCode ?? this._defaultLanguageCode;
        return {
            name: options.name,
            id: options.id ?? `{${generateGuid()}}`,
            showlabel: options.showlabel ?? true,
            verticallayout: options.verticallayout ?? true,
            visible: options.visible,
            ...(options.label ? { labels: makeLabels(options.label, lcid) } : {}),
            columns: { column: this._buildColumns() },
        };
    }

    _buildColumns(): FormXmlColumn[] {
        if (this._columns.length === 0) {
            return [new FormXmlColumnBuilder(this._defaultLanguageCode).build()];
        }

        return this._columns.map((column) => column.build());
    }

    private getOrCreateDefaultColumnBuilder(): FormXmlColumnBuilder {
        if (!this._defaultColumn) {
            this._defaultColumn = this.addColumn();
        }

        return this._defaultColumn;
    }

    _buildControlDescriptions(): FormXmlControlDescription[] {
        if (this._columns.length === 0) {
            return [];
        }

        return this._columns.flatMap((column) => column._buildControlDescriptions());
    }
}
