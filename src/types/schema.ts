export type UUID = string;
export type DateString = string; // YYYY-MM-DD
export type DateTimeString = string; // ISO 8601

// Enums (Converted to const objects for erasableSyntaxOnly compliance)
export const ContractStatusEnum = {
    NEW: "new",
    PENDING_PREPARATION: "pending preparation",
    PENDING_SCHEDULING: "pending scheduling",
    PENDING_PRODUCTION: "pending production",
    PENDING_PRODUCTION_COMPLETE: "pending production complete",
    PENDING_SHIPPING: "pending shipping",
    PENDING_SHIPPING_QUANTITY: "pending shipping quantity",
    COMPLETED: "completed",
} as const;

export type ContractStatusEnum = typeof ContractStatusEnum[keyof typeof ContractStatusEnum];

export const FieldStatusEnum = {
    PENDING: "pending",
    IN_TRANSIT: "in transit",
    RECEIVED: "received",
    OVERDUE: "overdue",
} as const;

export type FieldStatusEnum = typeof FieldStatusEnum[keyof typeof FieldStatusEnum];

// Base Models
export interface ContractBaseModel {
    status: ContractStatusEnum;
    signing_date: DateString | null;
    contract_number: string | null;
    brand: string | null;
    invoice_number: string | null;
    deposit_date: DateString | null;
    deposit_payment_status: FieldStatusEnum;
    pre_prod_payment_date: DateString | null;
    pre_prod_payment_status: FieldStatusEnum;
    final_payment_date: DateString | null;
    final_payment_status: FieldStatusEnum;
    estimated_production_completion_date: DateString | null;
}

export interface ContractIdModel {
    contract_id: UUID;
}

export interface ProductBaseModel {
    product_name: string;
    packaging_quantity: number | null;
    packaging_unit: string | null;
    total_quantity: number | null;
    sale_unit: string | null;
    gacc_image: string | null; // Base64 string
    gacc_note: string | null;
    coding_format: string | null;
    expected_shipping_method: string | null;
    labeling_requirement: string | null;
    additional_notes: string | null;
    production_schedule_notes: string | null;
    production_schedule_date: DateString | null;
    actual_quantity_produced: number | null;
    shipping_date: DateString | null;
    actual_quantity_shipped: number | null;
}

export interface ProductIdModel {
    product_id: UUID;
}

export interface PackagingBaseModel {
    packaging_arrival_status: FieldStatusEnum;
    packaging_name: string | null;
    packaging_arrival_date: DateString | null;
}

export interface PackagingIdModel {
    packaging_id: UUID;
}

export interface RawMaterialBaseModel {
    raw_material_batch: string | null;
    raw_material_arrival_status: FieldStatusEnum;
    raw_material_arrival_date: DateString | null;
}

export interface RawMaterialIdModel {
    raw_material_id: UUID;
}

export interface SaleUnitBaseModel {
    sale_unit: string;
}

export interface SaleUnitIdModel {
    sale_unit_id: UUID;
}

export interface PackagingUnitBaseModel {
    packaging_unit: string;
}

export interface PackagingUnitIdModel {
    packaging_unit_id: UUID;
}

export interface ProductionLineCategoryBaseModel {
    production_line_category_name: string;
}

export interface ProductionLineCategoryIdModel {
    production_line_category_id: UUID;
}

export interface ProductionLineBaseModel {
    production_line_name: string;
    production_line_label: string;
}

export interface ProductionLineIdModel {
    production_line_id: UUID;
}

export interface DailyScheduleItem {
    schedule_date: DateString;
    production_quantity: number;
}

export interface ProductionScheduleBaseModel {
    production_schedule_start_date: DateString;
    production_schedule_end_date: DateString;
    production_schedule_notes: string;
    include_weekend_flag: boolean;
    daily_scheduled_production_quantity: number;
    adjust_daily_schedule: DailyScheduleItem[] | null;
}

export interface ProductionScheduleIdModel {
    production_schedule_id: UUID;
}

export interface DataBaseAuditModel {
    db_create_by: string | null;
    db_update_tms: DateTimeString;
    db_update_by: string | null;
    db_create_tms: DateTimeString;
}

// Request Models

// Contracts
export interface GetContractsRequest {
    date_from?: DateString;
    date_to?: DateString;
    status?: ContractStatusEnum | null;
    limit?: number;
    offset?: number;
    include?: 'products' | 'product_info' | null;
    contract_number?: string | null;
}

export interface GetContractRequest extends ContractIdModel {
    include?: 'products' | 'product_info' | null;
}

export interface GetContractStatusRequest {
    date_from?: DateString;
    date_to?: DateString;
    global_count?: boolean;
}

export interface CreateContractRequest extends ContractBaseModel { }

export interface UpdateContractRequest extends ContractBaseModel { }

// Products
export interface UpdateProductPackagingModel extends PackagingBaseModel {
    packaging_id: UUID | null;
}

export interface UpdateRawMaterialModel extends RawMaterialBaseModel {
    raw_material_id: UUID | null;
}

export interface CreateProductRequest extends ContractIdModel {
    product: ProductBaseModel;
    packagings?: PackagingBaseModel[] | null;
    raw_materials?: RawMaterialBaseModel[] | null;
}

export interface UpdateProductRequest extends ProductBaseModel {
    packagings?: UpdateProductPackagingModel[] | null;
    raw_materials?: UpdateRawMaterialModel[] | null;
}

export interface CreateProductionScheduleRequest extends ProductIdModel, ProductionLineIdModel {
    production_schedule: ProductionScheduleBaseModel;
}

export interface UpdateProductionScheduleRequest extends ProductionScheduleBaseModel {
    production_line_id?: UUID | null;
    product_id?: UUID | null;
}

export interface GetProductionSchedulesRequest {
    product_id?: UUID | null;
    date_from?: DateString;
    date_to?: DateString;
    limit?: number;
    offset?: number;
}

// Response Models

export interface GetPackagingResponse extends PackagingIdModel, PackagingBaseModel, DataBaseAuditModel { }

export interface GetRawMaterialResponse extends RawMaterialIdModel, RawMaterialBaseModel, DataBaseAuditModel { }

export interface GetProductionScheduleResponse extends ProductionScheduleIdModel, ProductionScheduleBaseModel, DataBaseAuditModel {
    production_line_id?: UUID | null;
    product_name?: string | null;
}

export interface GetProductResponse extends ProductIdModel, ProductBaseModel, DataBaseAuditModel {
    packagings?: GetPackagingResponse[];
    raw_materials?: GetRawMaterialResponse[];
    production_schedules?: GetProductionScheduleResponse[];
}

export interface DeleteProductResponse {
    message: string;
}

export interface GetContractResponse extends ContractIdModel, ContractBaseModel, DataBaseAuditModel {
    products?: GetProductResponse[];
}

export interface DeleteContractResponse {
    message: string;
}

export interface GetStatusCountBaseModel {
    status: string;
    count: number;
}

export interface GetStatusCountResponse {
    statuses: GetStatusCountBaseModel[];
    total_count: number;
}

export interface GetPackagingUnitBaseModel extends PackagingUnitBaseModel, PackagingUnitIdModel, DataBaseAuditModel { }

export interface GetPackagingMappingResponse extends SaleUnitBaseModel, SaleUnitIdModel, DataBaseAuditModel {
    packaging_units: GetPackagingUnitBaseModel[];
}

export interface GetProductionLineBaseModel extends ProductionLineBaseModel, ProductionLineIdModel, DataBaseAuditModel { }

export interface GetProductionLineCategoryResponse extends ProductionLineCategoryBaseModel, ProductionLineCategoryIdModel, DataBaseAuditModel {
    production_lines: GetProductionLineBaseModel[];
}
