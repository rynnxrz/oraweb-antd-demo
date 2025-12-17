import type {
    GetContractsRequest,
    GetContractResponse,
    GetContractRequest,
    GetContractStatusRequest,
    GetStatusCountResponse,
    CreateContractRequest,
    UpdateContractRequest,
    DeleteContractResponse
} from '../../../types/schema';
import {
    ContractStatusEnum,
    FieldStatusEnum
} from '../../../types/schema';

const STORAGE_KEY = 'mock_contracts_db';

// Helper to create a UUID
const uuid = () => Math.random().toString(36).substr(2, 9);

// Initial Mock Data (strictly typed)
const INITIAL_CONTRACTS: GetContractResponse[] = [
    {
        contract_id: '1',
        contract_number: 'C2411-003',
        status: ContractStatusEnum.PENDING_PREPARATION,
        signing_date: '2024-11-01',
        brand: 'Little Umbrella',
        invoice_number: 'INV-2411-003',
        deposit_date: null,
        deposit_payment_status: FieldStatusEnum.RECEIVED,
        pre_prod_payment_date: null,
        pre_prod_payment_status: FieldStatusEnum.PENDING,
        final_payment_date: null,
        final_payment_status: FieldStatusEnum.PENDING,
        estimated_production_completion_date: null,
        db_create_tms: new Date().toISOString(),
        db_update_tms: new Date().toISOString(),
        db_create_by: 'system',
        db_update_by: 'system',
        products: [
            {
                product_id: 'p1',
                product_name: 'Kids Vitamin C',
                packaging_quantity: 60,
                packaging_unit: 'ct Bottle',
                total_quantity: 50000,
                sale_unit: 'Bottle',
                gacc_image: null,
                gacc_note: 'Registered: GACC-2024-998',
                coding_format: 'LOT: YYYYMMDD / EXP: 2YR',
                expected_shipping_method: 'Sea',
                labeling_requirement: 'Standard FDA v2.1',
                additional_notes: null,
                production_schedule_notes: 'Urgent for Nov Promo',
                production_schedule_date: null,
                actual_quantity_produced: 0,
                shipping_date: null,
                actual_quantity_shipped: 0,
                db_create_tms: new Date().toISOString(),
                db_update_tms: new Date().toISOString(),
                db_create_by: 'system',
                db_update_by: 'system'
            }
        ]
    },
    {
        contract_id: '2',
        contract_number: 'C2411-008',
        status: ContractStatusEnum.PENDING_PREPARATION,
        signing_date: '2024-11-05',
        brand: 'PowerGums',
        invoice_number: null,
        deposit_date: null,
        deposit_payment_status: FieldStatusEnum.PENDING,
        pre_prod_payment_date: null,
        pre_prod_payment_status: FieldStatusEnum.PENDING,
        final_payment_date: null,
        final_payment_status: FieldStatusEnum.PENDING,
        estimated_production_completion_date: null,
        db_create_tms: new Date().toISOString(),
        db_update_tms: new Date().toISOString(),
        db_create_by: 'system',
        db_update_by: 'system',
        products: [
            {
                product_id: 'p2',
                product_name: 'Energy Chews',
                packaging_quantity: 10,
                packaging_unit: 'pk Box',
                total_quantity: 120000,
                sale_unit: 'Box',
                gacc_image: null,
                gacc_note: 'Missing Registration',
                coding_format: 'Custom: MM/DD/YY',
                expected_shipping_method: 'Air',
                labeling_requirement: 'Pending Artwork',
                additional_notes: null,
                production_schedule_notes: 'Wait for artwork',
                production_schedule_date: null,
                actual_quantity_produced: 0,
                shipping_date: null,
                actual_quantity_shipped: 0,
                db_create_tms: new Date().toISOString(),
                db_update_tms: new Date().toISOString(),
                db_create_by: 'system',
                db_update_by: 'system'
            }
        ]
    },
    {
        contract_id: '3',
        contract_number: 'C2410-001',
        status: ContractStatusEnum.PENDING_PRODUCTION,
        signing_date: '2024-10-15',
        brand: 'Vitality',
        invoice_number: null,
        deposit_date: '2024-10-10',
        deposit_payment_status: FieldStatusEnum.RECEIVED,
        pre_prod_payment_date: null,
        pre_prod_payment_status: FieldStatusEnum.PENDING,
        final_payment_date: null,
        final_payment_status: FieldStatusEnum.PENDING,
        estimated_production_completion_date: '2024-12-20',
        db_create_tms: new Date().toISOString(),
        db_update_tms: new Date().toISOString(),
        db_create_by: 'system',
        db_update_by: 'system',
        products: [
            {
                product_id: 'p3',
                product_name: 'Hair & Nail',
                packaging_quantity: 90,
                packaging_unit: 'ct Jar',
                total_quantity: 30000,
                sale_unit: 'Jar',
                gacc_image: null,
                gacc_note: 'Verified (Ref: 8871)',
                coding_format: 'Std',
                expected_shipping_method: 'Sea',
                labeling_requirement: 'Compliant',
                additional_notes: null,
                production_schedule_notes: 'Running on Line 2',
                production_schedule_date: null,
                actual_quantity_produced: 30000,
                shipping_date: null,
                actual_quantity_shipped: 0,
                db_create_tms: new Date().toISOString(),
                db_update_tms: new Date().toISOString(),
                db_create_by: 'system',
                db_update_by: 'system'
            }
        ]
    },
    {
        contract_id: '4',
        contract_number: 'C2409-015',
        status: ContractStatusEnum.PENDING_PREPARATION,
        signing_date: '2024-09-20',
        brand: 'MuscleStats',
        invoice_number: null,
        deposit_date: null,
        deposit_payment_status: FieldStatusEnum.RECEIVED,
        pre_prod_payment_date: null,
        pre_prod_payment_status: FieldStatusEnum.PENDING,
        final_payment_date: null,
        final_payment_status: FieldStatusEnum.PENDING,
        estimated_production_completion_date: null,
        db_create_tms: new Date().toISOString(),
        db_update_tms: new Date().toISOString(),
        db_create_by: 'system',
        db_update_by: 'system',
        products: [
            {
                product_id: 'p4',
                product_name: 'Whey Protein',
                packaging_quantity: 2,
                packaging_unit: 'kg Tub',
                total_quantity: 10000,
                sale_unit: 'Tub',
                gacc_image: null,
                gacc_note: 'Pending Renewal',
                coding_format: 'Review Needed',
                expected_shipping_method: null,
                labeling_requirement: null,
                additional_notes: null,
                production_schedule_notes: 'Check inventory',
                production_schedule_date: null,
                actual_quantity_produced: 0,
                shipping_date: null,
                actual_quantity_shipped: 0,
                db_create_tms: new Date().toISOString(),
                db_update_tms: new Date().toISOString(),
                db_create_by: 'system',
                db_update_by: 'system'
            }
        ]
    },
    {
        contract_id: '5',
        contract_number: 'C2412-002',
        status: ContractStatusEnum.PENDING_PREPARATION,
        signing_date: '2024-12-01',
        brand: 'NatureBest',
        invoice_number: null,
        deposit_date: null,
        deposit_payment_status: FieldStatusEnum.PENDING,
        pre_prod_payment_date: null,
        pre_prod_payment_status: FieldStatusEnum.PENDING,
        final_payment_date: null,
        final_payment_status: FieldStatusEnum.PENDING,
        estimated_production_completion_date: null,
        db_create_tms: new Date().toISOString(),
        db_update_tms: new Date().toISOString(),
        db_create_by: 'system',
        db_update_by: 'system',
        products: [
            {
                product_id: 'p5',
                product_name: 'Multivitamin',
                packaging_quantity: 30,
                packaging_unit: 'ct Sachet',
                total_quantity: 75000,
                sale_unit: 'Sachet',
                gacc_image: null,
                gacc_note: 'OK',
                coding_format: 'Standard',
                expected_shipping_method: null,
                labeling_requirement: null,
                additional_notes: null,
                production_schedule_notes: 'Normal production',
                production_schedule_date: null,
                actual_quantity_produced: 0,
                shipping_date: null,
                actual_quantity_shipped: 0,
                db_create_tms: new Date().toISOString(),
                db_update_tms: new Date().toISOString(),
                db_create_by: 'system',
                db_update_by: 'system'
            }
        ]
    }
];

// Initialize DB safely
let db: GetContractResponse[] = [];

try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        db = JSON.parse(stored);
    } else {
        db = INITIAL_CONTRACTS;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    }
} catch (e) {
    console.warn('Failed to load mock contracts, resetting', e);
    db = INITIAL_CONTRACTS;
}

const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
};

// API Implementations

export const getContracts = async (params: GetContractsRequest): Promise<GetContractResponse[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));

    let results = [...db];

    if (params?.status) {
        results = results.filter(c => c.status === params.status);
    }

    if (params?.contract_number) {
        results = results.filter(c => c.contract_number?.includes(params.contract_number!));
    }

    return results;
};

export const getContract = async (contractId: string, _params?: GetContractRequest): Promise<GetContractResponse> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const found = db.find(c => c.contract_id === contractId);
    if (!found) throw new Error(`Contract ${contractId} not found`);
    return found;
};

export const getContractStatusCount = async (_params: GetContractStatusRequest): Promise<GetStatusCountResponse> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    // Count simple statuses
    const counts = db.reduce((acc, curr) => {
        acc[curr.status] = (acc[curr.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return {
        total_count: db.length,
        statuses: Object.entries(counts).map(([status, count]) => ({ status, count }))
    };
};

export const createContract = async (data: CreateContractRequest): Promise<GetContractResponse> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const newContract: GetContractResponse = {
        ...data,
        contract_id: uuid(),
        db_create_by: 'mock_user',
        db_update_by: 'mock_user',
        db_create_tms: new Date().toISOString(),
        db_update_tms: new Date().toISOString(),
        products: []
    };

    db.unshift(newContract);
    save();
    return newContract;
};

export const updateContract = async (contractId: string, data: UpdateContractRequest): Promise<GetContractResponse> => {
    await new Promise(resolve => setTimeout(resolve, 600));

    const index = db.findIndex(c => c.contract_id === contractId);
    if (index === -1) throw new Error('Contract not found');

    const updated = {
        ...db[index],
        ...data,
        db_update_tms: new Date().toISOString()
    };
    db[index] = updated;
    save();
    return updated;
};

export const deleteContract = async (contractId: string): Promise<DeleteContractResponse> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const initLen = db.length;
    db = db.filter(c => c.contract_id !== contractId);
    if (db.length === initLen) throw new Error('Contract not found');

    save();
    return { message: 'Deleted successfully' };
};
