import { serializeFormXml } from "./FormXmlSerializer";
import type {
    FormXml,
    FormXmlCell,
    FormXmlColumn,
    FormXmlControl,
    FormXmlLabels,
    FormXmlRow,
    FormXmlSection,
    FormXmlTab,
} from "./schemaTypes";

function generateGuid(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

function makeLabels(text: string, languageCode: number): FormXmlLabels {
    return { label: [{ description: text, languagecode: languageCode }] };
}

export interface FormXmlBuilderTabOptions {
    name: string;
    label?: string;
    id?: string;
    visible?: boolean;
    languageCode?: number;
}

export interface FormXmlBuilderSectionOptions {
    name: string;
    label?: string;
    id?: string;
    visible?: boolean;
    languageCode?: number;
}

export interface FormXmlBuilderFieldOptions {
    datafieldname: string;
    classid: string;
    id?: string;
    label?: string;
    visible?: boolean;
    disabled?: boolean;
    required?: boolean;
    languageCode?: number;
}

export class FormXmlSectionBuilder {
    private _rows: FormXmlRow[] = [];
    private _defaultLanguageCode: number;

    constructor(defaultLanguageCode: number) {
        this._defaultLanguageCode = defaultLanguageCode;
    }

    addField(options: FormXmlBuilderFieldOptions): this {
        const lcid = options.languageCode ?? this._defaultLanguageCode;
        const controlId = options.id ?? options.datafieldname;
        const control: FormXmlControl = {
            id: controlId,
            classid: options.classid,
            datafieldname: options.datafieldname,
            disabled: options.disabled,
            isrequired: options.required,
            ...(options.label ? { labels: makeLabels(options.label, lcid) } : {}),
        };
        const cell: FormXmlCell = {
            id: `{${generateGuid()}}`,
            showlabel: true,
            visible: options.visible,
            ...(options.label ? { labels: makeLabels(options.label, lcid) } : {}),
            control,
        };
        this._rows.push({ cell: [cell] });
        return this;
    }

    addSpacer(): this {
        this._rows.push({ cell: [{ userspacer: true }] });
        return this;
    }

    _buildRows(): FormXmlRow[] {
        return this._rows;
    }
}

export class FormXmlTabBuilder {
    private _sections: Array<{ options: FormXmlBuilderSectionOptions; builder: FormXmlSectionBuilder }> = [];
    private _defaultLanguageCode: number;

    constructor(defaultLanguageCode: number) {
        this._defaultLanguageCode = defaultLanguageCode;
    }

    addSection(
        options: FormXmlBuilderSectionOptions,
        configure?: (section: FormXmlSectionBuilder) => void
    ): this {
        const sectionBuilder = new FormXmlSectionBuilder(this._defaultLanguageCode);
        if (configure) {
            configure(sectionBuilder);
        }
        this._sections.push({ options, builder: sectionBuilder });
        return this;
    }

    _buildColumn(): FormXmlColumn {
        const sections: FormXmlSection[] = this._sections.map(({ options, builder }) => {
            const lcid = options.languageCode ?? this._defaultLanguageCode;
            const section: FormXmlSection = {
                name: options.name,
                id: options.id ?? `{${generateGuid()}}`,
                showlabel: true,
                showbar: false,
                columns: 1,
                visible: options.visible,
                ...(options.label ? { labels: makeLabels(options.label, lcid) } : {}),
                rows: { row: builder._buildRows() },
            };
            return section;
        });
        return {
            width: "100%",
            sections: { section: sections },
        };
    }
}

export class FormXmlBuilder {
    private _tabs: Array<{ options: FormXmlBuilderTabOptions; builder: FormXmlTabBuilder }> = [];
    private _defaultLanguageCode: number;

    constructor(defaultLanguageCode = 1033) {
        this._defaultLanguageCode = defaultLanguageCode;
    }

    addTab(
        options: FormXmlBuilderTabOptions,
        configure?: (tab: FormXmlTabBuilder) => void
    ): this {
        const tabBuilder = new FormXmlTabBuilder(this._defaultLanguageCode);
        if (configure) {
            configure(tabBuilder);
        }
        this._tabs.push({ options, builder: tabBuilder });
        return this;
    }

    build(): FormXml {
        const tabs: FormXmlTab[] = this._tabs.map(({ options, builder }) => {
            const lcid = options.languageCode ?? this._defaultLanguageCode;
            const tab: FormXmlTab = {
                name: options.name,
                id: options.id ?? `{${generateGuid()}}`,
                showlabel: true,
                verticallayout: true,
                visible: options.visible,
                ...(options.label ? { labels: makeLabels(options.label, lcid) } : {}),
                columns: { column: [builder._buildColumn()] },
            };
            return tab;
        });
        return {
            tabs: { tab: tabs },
        };
    }

    toXmlString(): string {
        return serializeFormXml(this.build());
    }
}
