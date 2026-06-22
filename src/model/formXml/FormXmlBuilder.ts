import { serializeFormXml } from "./FormXmlSerializer";
import type { FormXml } from "./schemaTypes";
import { FormXmlTabBuilder } from "./FormXmlTabBuilder";
import type { FormXmlBuilderTabOptions } from "./FormXmlBuilder.shared";

export { FormXmlColumnBuilder } from "./FormXmlColumnBuilder";
export { FormXmlControlBuilder } from "./FormXmlControlBuilder";
export { FormXmlRowBuilder } from "./FormXmlRowBuilder";
export { FormXmlSectionBuilder } from "./FormXmlSectionBuilder";
export { FormXmlTabBuilder } from "./FormXmlTabBuilder";
export type {
    FormXmlBuilderColumnOptions,
    FormXmlBuilderControlOptions,
    FormXmlBuilderFieldOptions,
    FormXmlBuilderRowOptions,
    FormXmlBuilderSectionOptions,
    FormXmlBuilderTabOptions,
} from "./FormXmlBuilder.shared";

export class FormXmlBuilder {
    private _tabs: FormXmlTabBuilder[] = [];
    private _defaultLanguageCode: number;

    constructor(defaultLanguageCode = 1033) {
        this._defaultLanguageCode = defaultLanguageCode;
    }

    addTab(
        options: FormXmlBuilderTabOptions,
        configure?: (tab: FormXmlTabBuilder) => void
    ): this {
        const tabBuilder = new FormXmlTabBuilder(this._defaultLanguageCode, options);
        if (configure) {
            configure(tabBuilder);
        }
        this._tabs.push(tabBuilder);
        return this;
    }

    build(): FormXml {
        return {
            tabs: { tab: this._tabs.map((tab) => tab.build()) },
        };
    }

    toXmlString(): string {
        return serializeFormXml(this.build());
    }
}
