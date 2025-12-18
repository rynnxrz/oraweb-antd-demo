export interface Contract {
    id: string;
    contractNo: string;
    client: string; // e.g., 'Little Umbrella'
    brand?: string; // e.g., 'Little Umbrella'
    productName: string; // e.g., 'Gummies'
    spec?: string; // e.g., '60ct Bottle'
    totalQty: number; // e.g., 50000
    scheduledQty: number;
    status: 'Pending' | 'Production' | 'Completed';
    startDate?: string;
    dueDate?: string;

    // Status Flags for Reqs Tab (Mapped to Schema: t_products)
    gacc_note?: string;          // was gaccStatus
    coding_format?: string;      // was codingStatus
    expected_shipping_method?: string; // was shipMode
    labeling_requirement?: string; // was labelStatus

    // Finance Tab
    invoiceNo?: string;
    depositStatus?: 'Paid' | 'Unpaid';
    balanceStatus?: 'Paid' | 'Unpaid';

    // Pkg Tab
    pkgStatus?: 'Ready' | 'Partial' | 'Missing';
    pkg_arrive_date?: string; // e.g., '2024-11-01'

    // Plan Tab
    materialStatus?: 'Ready' | 'Partial' | 'Missing';
    schedule_notes?: string;

    // Dashboard & PRD Required Fields
    signingDate?: string; // YYYY-MM-DD

    // Payment Details
    depositDate?: string;
    preProdPaymentDate?: string;
    finalPaymentDate?: string;
    finalPaymentStatus?: 'Paid' | 'Unpaid' | 'Pending';
    preProdPaymentStatus?: 'Paid' | 'Unpaid' | 'Pending';

    // Production & Materials
    materialsReadyDate?: string;
    productionStartDate?: string;
    productionEndDate?: string;
    estimatedCompletionDate?: string;

    // Shipping & Meta
    shippingDate?: string;
    lastUpdated?: string; // timestamp or date string for "Zombie" check

    // Computed/Analysis Flags (Optional, if we want to store them on object)
    stageInfo?: {
        stage: string;
        delayDays: number;
        status: string;
    };
}

export interface Machine {
    id: string;
    name: string;
    room: string; // e.g., 'Square Sachet Room'
}

export interface DailySchedule {
    date: string; // YYYY-MM-DD
    quantity: number;
}

export interface Schedule {
    id: string;
    contractId: string;
    machineId: string;
    startDate: string;
    endDate: string;
    dailyQuantities: DailySchedule[];
    totalScheduled: number;
    notes?: string;
}
