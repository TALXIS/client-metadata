export type FormXmlGuid = string;
export type FormXmlIsvGuid = string;
export type FormXmlPercentage = string;
export type FormCrmBoolean = 0 | 1;
export type FormXmlPrimitiveValue = string | number | boolean;

export type BehaviorInBulkEditForm = "Disabled" | "EnabledButNoRender" | "Enabled";
export type CrmEventType = "DataEvent" | "ControlEvent";
export type FormatType = "SingleLineOfText" | "WholeNumber" | "DecimalNumber" | "Currency" | "Date" | "DateTime" | "DateAndTime" | "Url" | "Ticker" | "Email" | "TextArea";
export type FormParameterAttributeType = "Boolean" | "DateTime" | "Double" | "EntityType" | "Integer" | "Long" | "Object" | "PositiveInteger" | "SafeString" | "UniqueId" | "UnsignedInt";
export type GridResizeType = "Auto" | "Fixed" | "AutoWithFixedMax";
export type ImageHorizontalAlignmentType = "Left" | "Right" | "Center" | "NotSet";
export type ImageVerticalAlignmentType = "Top" | "Middle" | "Bottom" | "NotSet";
export type RelationshipRoleOrdinalType = 1 | 2;
export type SolutionActionType = "Added" | "Removed" | "Modified";
export type WebResourceSizeType = "StretchToFit" | "StretchMaintainAspectRatio" | "Original" | "Specific";
export type CellLabelAlignment = "Center" | "Left" | "Right";
export type CellLabelPosition = "Top" | "Left";

export interface FormXmlExtension {
    additionalAttributes?: Record<string, FormXmlPrimitiveValue>;
    additionalElements?: FormXmlOpaqueNode[];
}

export type FormXmlOpaqueNode = FormXmlOpaqueElement | FormXmlOpaqueText | FormXmlOpaqueCData | FormXmlOpaqueComment;

export interface FormXmlOpaqueElement {
    kind: "element";
    name: string;
    attributes: Record<string, FormXmlPrimitiveValue>;
    children: FormXmlOpaqueNode[];
}

export interface FormXmlOpaqueText {
    kind: "text";
    value: string;
}

export interface FormXmlOpaqueCData {
    kind: "cdata";
    value: string;
}

export interface FormXmlOpaqueComment {
    kind: "comment";
    value: string;
}

export interface FormXml extends FormXmlExtension, FormXmlFormAttributes {
    ancestor?: FormXmlAncestor;
    hiddencontrols?: FormXmlHiddenControls;
    controlDescriptions?: FormXmlControlDescriptions;
    tabs: FormXmlTabs;
    header?: FormXmlHeaderFooter;
    footer?: FormXmlHeaderFooter;
    events?: FormXmlEvents;
    formLibraries?: FormXmlLibraryType;
    externaldependencies?: FormXmlExternalDependencies;
    formparameters?: FormXmlFormParameters;
    clientresources?: FormXmlClientResources;
    Navigation?: FormXmlNavigation;
    DisplayConditions?: FormXmlDisplayConditions;
    RibbonDiffXml?: FormXmlOpaqueElement;
}

export interface FormXmlFormAttributes {
    enablerelatedinformation?: boolean;
    relatedInformationCollapsed?: boolean;
    hasmargin?: boolean;
    addedby?: string;
    shownavigationbar?: boolean;
    showImage?: boolean;
    maxWidth?: number;
}

export interface FormXmlAncestor {
    id: FormXmlGuid;
}

export interface FormXmlHiddenControls {
    data?: FormXmlHiddenControlData[];
}

export interface FormXmlHiddenControlData {
    id?: string;
    datafieldname?: string;
    classid?: FormXmlGuid;
    relationship?: string;
}

export interface FormXmlControlDescriptions {
    controlDescription?: FormXmlControlDescription[];
}

export interface FormXmlControlDescription {
    forControl: string;
    customControl?: FormXmlCustomControl[];
}

export interface FormXmlCustomControl {
    id?: FormXmlGuid;
    formFactor?: number;
    name?: string;
    version?: string;
    parameters?: FormXmlCustomControlParameters;
}

export interface FormXmlCustomControlParameters {
    additionalElements?: FormXmlOpaqueNode[];
}

export interface FormXmlTabs extends FormXmlExtension {
    showlabels?: boolean;
    addedby?: string;
    filterby?: string;
    dashboardCategory?: string;
    timeframe?: string;
    primaryentitylogicalname?: string;
    entityview?: string;
    tilespresent?: boolean;
    tab: FormXmlTab[];
}

export interface FormXmlTab extends FormXmlExtension {
    group?: string;
    name?: string;
    verticallayout?: boolean;
    showlabel?: boolean;
    labelid?: FormXmlGuid;
    id?: FormXmlGuid;
    IsUserDefined?: string;
    locklevel?: number;
    addedby?: string;
    expanded?: boolean;
    visible?: boolean;
    availableforphone?: boolean;
    collapsible?: boolean;
    labels?: FormXmlLabels;
    tabheader?: FormXmlHeaderFooter;
    tabfooter?: FormXmlHeaderFooter;
    columns: FormXmlColumns;
    events?: FormXmlEvents;
}

export interface FormXmlColumns {
    column: FormXmlColumn[];
}

export interface FormXmlColumn {
    width: FormXmlPercentage;
    sections?: FormXmlSections;
}

export interface FormXmlSections {
    addedby?: string;
    section?: FormXmlSection[];
}

export interface FormXmlSection extends FormXmlSectionCommon, FormXmlExtension {
    group?: string;
    name?: string;
    showlabel?: boolean;
    labelid?: FormXmlGuid;
    showbar?: boolean;
    id?: FormXmlGuid;
    IsUserDefined?: string;
    height?: string;
    locklevel?: number;
    layout?: string;
    addedby?: string;
    visible?: boolean;
    rowheight?: number;
    autoexpand?: boolean;
    labels?: FormXmlLabels;
    rows?: FormXmlRows;
}

export interface FormXmlRows {
    addedby?: string;
    row?: FormXmlRow[];
}

export interface FormXmlRow extends FormXmlRowCommon {
    addedby?: string;
    cell?: FormXmlCell[];
}

export interface FormXmlHeaderFooterRow extends FormXmlRowCommon {
    cell?: FormXmlHeaderFooterCell[];
}

export interface FormXmlCell extends FormXmlCellCommon {
    auto?: boolean;
    addedby?: string;
    labels?: FormXmlLabels;
    control?: FormXmlControl;
    events?: FormXmlEvents;
}

export interface FormXmlHeaderFooterCell extends FormXmlCellCommon {
    labels?: FormXmlLabels;
    control?: FormXmlControl;
}

export interface FormXmlHeaderFooter extends FormXmlSectionCommon {
    id: FormXmlGuid;
    rows: {
        row?: FormXmlHeaderFooterRow[];
    };
}

export interface FormXmlSectionCommon {
    columns?: number;
    labelwidth?: number;
    availableforphone?: boolean;
    celllabelalignment?: CellLabelAlignment;
    celllabelposition?: CellLabelPosition;
}

export interface FormXmlRowCommon {
    height?: string;
}

export interface FormXmlCellCommon {
    id?: FormXmlGuid;
    showlabel?: boolean;
    labelid?: FormXmlGuid;
    locklevel?: number;
    rowspan?: number;
    colspan?: number;
    userspacer?: boolean;
    ispreviewcell?: boolean;
    visible?: boolean;
    availableforphone?: boolean;
    isstreamcell?: boolean;
    ischartcell?: boolean;
    istilecell?: boolean;
}


export interface FormXmlControl extends FormXmlExtension {
    id?: string;
    uniqueid?: FormXmlGuid;
    classid?: FormXmlGuid;
    labelid?: FormXmlGuid;
    datafieldname?: string;
    disabled?: boolean;
    addedby?: string;
    isunbound?: boolean;
    isrequired?: boolean;
    relationship?: string;
    indicationOfSubgrid?: boolean;
    labels?: FormXmlLabels;
    parameters?: FormXmlControlParameters;
}

export interface FormXmlControlParameters extends FormXmlExtension {
    Url?: string;
    PassParameters?: boolean;
    Security?: boolean;
    Scrolling?: string;
    Border?: string;
    Preload?: string;
    IsPassword?: boolean;
    IsColorValue?: boolean;
    Height?: number;
    Width?: number;
    AltText?: string;
    SizeType?: WebResourceSizeType;
    ShowInROF?: boolean;
    ShowOnMobileClient?: boolean;
    HorizontalAlignment?: ImageHorizontalAlignmentType;
    VerticalAlignment?: ImageVerticalAlignmentType;
    Data?: string;
    WebResourceId?: string;
    ReadOnly?: boolean;
    ShowDialogs?: boolean;
    IsViewExpandable?: boolean;
    HideToolbar?: boolean;
    ToolbarJSON?: string;
    ExpandedToolbarJSON?: string;
    HiddenToolbarJSON?: string;
    ClassName?: string;
    ViewName?: string;
    TargetEntities?: FormXmlTargetEntities;
    ViewId?: FormXmlGuid;
    IsUserView?: boolean;
    IsUserChart?: boolean;
    RelationshipName?: string;
    RelationshipRoleOrdinal?: RelationshipRoleOrdinalType;
    TargetEntityType?: string;
    AutoExpand?: GridResizeType;
    RecordsPerPage?: number;
    MaxRowsBeforeScroll?: number;
    EnableQuickFind?: boolean;
    EnableJumpBar?: boolean;
    EnableViewPicker?: boolean;
    ViewIds?: string;
    ChartGridMode?: string;
    VisualizationId?: string;
    EnableChartPicker?: boolean;
    EnableContextualActions?: boolean;
    TeamTemplateId?: FormXmlGuid;
    GridUIMode?: string;
    ReferencePanelSubgridIconUrl?: string;
    HeaderColorCode?: string;
    PowerBIGroupId?: string;
    PowerBIDashboardId?: string;
    TileId?: string;
    TileUrl?: string;
    Type?: string;
    EnableInMobile?: string;
    DefaultViewId?: FormXmlGuid;
    FilterRelationshipName?: string;
    DependentAttributeName?: string;
    DependentAttributeType?: string;
    AutoResolve?: boolean;
    ResolveEmailAddress?: boolean;
    DefaultViewReadOnly?: boolean;
    ViewPickerReadOnly?: boolean;
    AllowFilterOff?: boolean;
    DisableMru?: boolean;
    DisableQuickFind?: boolean;
    DisableViewPicker?: boolean;
    AvailableViewIds?: string;
    EntityLogicalName?: string;
    IsInlineNewEnabled?: boolean;
    InlineViewIds?: string;
    UnboundLookupTypes?: string;
    UnboundLookupBrowse?: boolean;
    UnboundLookupControlType?: string;
    ShowAsBreadcrumbControl?: boolean;
    MaxLength?: number;
    Format?: FormatType;
    IsTitle?: boolean;
    MinValue?: number;
    MaxValue?: number;
    Precision?: number;
    DefaultValue?: string;
    OptionSetName?: string;
    OptionSetId?: FormXmlGuid;
    QuickForms?: string;
    ControlMode?: string;
    ReferencePanelQuickFormCollectionIconUrl?: string;
    DisplayAsCustomer360Tile?: boolean;
    DefaultTabId?: string;
    ShowArticleTab?: boolean;
    LinkControlDefinitionId?: FormXmlGuid;
    ShowLinkControlLabel?: boolean;
    AddressField?: string;
    FailureTimeField?: string;
    SuccessConditionName?: string;
    SuccessConditionValue?: string;
    FailureConditionName?: string;
    FailureConditionValue?: string;
    WarningConditionName?: string;
    WarningConditionValue?: string;
    CancelConditionName?: string;
    CancelConditionValue?: string;
    PauseConditionName?: string;
    PauseConditionValue?: string;
    StreamObjects?: FormXmlStreamObjects;
    AttributeLogicalName?: string;
    TimeFrame?: string;
    FilterResults?: string;
    AllowChangingFiltersOnUI?: boolean;
    ShowLanguageFilter?: boolean;
    ShowDepartmentFilter?: boolean;
    EnableAutoSuggestions?: boolean;
    SearchForAutoSuggestionsUsing?: string;
    EnableRating?: boolean;
    ShowRatingUsing?: string;
    AutoSuggestionSource?: string;
    SelectPrimaryCustomer?: string;
    NumberOfResults?: number;
    ShowContextualActions?: string;
    ActionList?: string;
    ReferencePanelSearchWidgetIconUrl?: string;
    SelectDefaultLanguage?: string;
    UClientUniqueName?: string;
    UClientModules?: string;
    UClientDefaultModuleForCreateExperience?: string;
    UClientShowFilterPane?: boolean;
    UClientExpandFilterPane?: boolean;
    UClientCreateActivityUsing?: string;
    UClientDisplayActivityUsing?: string;
    UClientRecordPerPage?: number;
    UClientActivities?: string;
    UClientOrderBy?: string;
    UClientActivityCardMap?: string;
    UClientDisplayActivityHeaderUsing?: string;
    UClientSortActivitiesByValue?: string;
    OrderByActivityWall?: string;
    SortActivityWall?: string;
    EmailConversationView?: string;
}

export interface FormXmlTargetEntities {
    TargetEntity: FormXmlTargetEntity[];
}

export interface FormXmlTargetEntity {
    EntityLogicalName: string;
    DefaultViewId?: FormXmlGuid;
    IsDeDupLookup?: boolean;
    UnboundLookupStyle?: string;
}

export interface FormXmlStreamObjects {
    ShowAsTiles: boolean;
    StreamObject: FormXmlStreamObject[];
}

export interface FormXmlStreamObject {
    type: number;
    id: FormXmlGuid;
    LogicalEntityName: string;
    QueueId?: FormXmlGuid;
    QueueViewId?: FormXmlGuid;
    EntityViewId?: FormXmlGuid;
    SavedQueryID?: FormXmlGuid;
    QueueViewIdForSavedQuery?: FormXmlGuid;
}

export interface FormXmlLibraryType {
    Library: FormXmlLibrary[];
}

export interface FormXmlLibrary {
    name: string;
    libraryUniqueId: string;
}

export interface FormXmlEvents {
    event: FormXmlEvent[];
}

export interface FormXmlEvent {
    name?: string;
    BehaviorInBulkEditForm?: BehaviorInBulkEditForm;
    application?: boolean;
    active?: boolean;
    eventType?: CrmEventType;
    attribute?: string;
    control?: string;
    relationship?: string;
    Handlers?: FormXmlHandlers;
    InternalHandlers?: FormXmlHandlers;
    dependencies?: FormXmlDependencies;
}

export interface FormXmlHandlers {
    Handler?: FormXmlHandler[];
}

export interface FormXmlHandler {
    functionName: string;
    libraryName: string;
    handlerUniqueId: string;
    enabled?: boolean;
    passExecutionContext?: boolean;
    parameters?: string;
    dependencies?: FormXmlDependencies;
}

export interface FormXmlDependencies {
    dependency?: FormXmlDependency[];
}

export interface FormXmlExternalDependencies {
    dependency: FormXmlDependency[];
}

export interface FormXmlDependency {
    id?: string;
}

export interface FormXmlLabels {
    label?: FormXmlLabel[];
}

export interface FormXmlLabel {
    description: string;
    languagecode: number;
    addedby?: string;
}

export interface FormXmlNavigation {
    NavBarAreas?: FormXmlNavBarAreas;
    NavBar?: FormXmlNavBar;
}

export interface FormXmlNavBarAreas {
    NavBarArea?: FormXmlNavBarArea[];
}

export interface FormXmlNavBarArea {
    Id: string;
    Titles: FormXmlLocalizedTitles;
}

export interface FormXmlNavBar {
    ValidForCreate?: FormCrmBoolean;
    ValidForUpdate?: FormCrmBoolean;
    NavBarItem?: FormXmlNavBarItem[];
    NavBarByRelationshipItem?: FormXmlNavBarByRelationshipItem[];
}

export interface FormXmlNavBarItem {
    Icon: string;
    Url: string;
    Id: string;
    PassParams?: FormCrmBoolean;
    Sequence?: number;
    Area?: string;
    Client?: string;
    AvailableOffline?: boolean;
    Titles: FormXmlLocalizedTitles;
}

export interface FormXmlNavBarByRelationshipItem {
    RelationshipName: string;
    Id: string;
    Area?: string;
    TitleResourceId?: string;
    Client?: string;
    AvailableOffline?: boolean;
    Icon?: string;
    Sequence?: number;
    Show?: boolean;
    ViewId?: FormXmlIsvGuid;
    Titles?: FormXmlLocalizedTitles;
    ToolTip?: {
        Titles: FormXmlLocalizedTitles;
    };
    Privileges?: {
        Privilege: FormXmlPrivilege[];
    };
}

export interface FormXmlPrivilege {
    Entity: string;
    Privilege: string;
}

export interface FormXmlLocalizedTitles {
    Title: FormXmlLocalizedLabel[];
}

export interface FormXmlLocalizedLabel {
    LCID?: number;
    Text?: string;
}

export interface FormXmlFormParameters {
    querystringparameter: FormXmlQueryStringParameter[];
}

export interface FormXmlQueryStringParameter {
    name: string;
    type: FormParameterAttributeType;
}

export interface FormXmlDisplayConditions {
    FallbackForm?: boolean;
    Order?: number;
    Everyone?: Record<string, never>;
    Role?: FormXmlDisplayConditionRole[];
}

export interface FormXmlDisplayConditionRole {
    Id: FormXmlGuid;
}

export interface FormXmlClientResources {
    internalresources?: FormXmlInternalResources;
    isvresources?: FormXmlIsvResources;
}

export interface FormXmlInternalResources {
    clientincludes?: {
        internaljscriptfile?: FormXmlClientFileInclude[];
        internalcssfile?: FormXmlClientFileInclude[];
    };
    clientvariables?: {
        internaljscriptvariable?: FormXmlInternalJScriptVariable[];
    };
}

export interface FormXmlClientFileInclude {
    src: string;
}

export interface FormXmlInternalJScriptVariable {
    name: string;
    resourceid: string;
}

export interface FormXmlIsvResources {
    clientincludes?: {
        webresource?: FormXmlWebResource[];
    };
}

export interface FormXmlWebResource {
    path: string;
    type: "jscript" | "css";
}
