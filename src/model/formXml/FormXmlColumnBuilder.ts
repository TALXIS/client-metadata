import type { FormXmlColumn } from "./schemaTypes";
import {
    type FormXmlBuilderColumnOptions,
    type FormXmlBuilderSectionOptions,
} from "./FormXmlBuilder.shared";
import { FormXmlSectionBuilder } from "./FormXmlSectionBuilder";

export class FormXmlColumnBuilder {
    private _sections: FormXmlSectionBuilder[] = [];
    private _defaultLanguageCode: number;
    private _options: FormXmlBuilderColumnOptions;

    constructor(defaultLanguageCode: number, options: FormXmlBuilderColumnOptions = {}) {
        this._defaultLanguageCode = defaultLanguageCode;
        this._options = options;
    }

    addSection(
        options: FormXmlBuilderSectionOptions,
        configure?: (section: FormXmlSectionBuilder) => void
    ): this {
        const sectionBuilder = new FormXmlSectionBuilder(this._defaultLanguageCode, options);
        if (configure) {
            configure(sectionBuilder);
        }
        this._sections.push(sectionBuilder);
        return this;
    }

    build(): FormXmlColumn {
        return {
            width: this._options.width ?? "100%",
            sections: { section: this._sections.map((section) => section.build()) },
        };
    }

    _buildColumn(): FormXmlColumn {
        return this.build();
    }
}
