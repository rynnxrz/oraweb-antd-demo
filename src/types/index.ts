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

    // Status Flags for Reqs Tab
    gaccStatus?: 'Done' | 'Pending' | 'Issue';
    codingStatus?: 'Done' | 'Pending' | 'Issue';
    shipMode?: string;
    labelStatus?: 'Done' | 'Pending';

    // Finance Tab
    invoiceNo?: string;
    depositStatus?: 'Paid' | 'Unpaid';
    balanceStatus?: 'Paid' | 'Unpaid';

    // Pkg Tab
    pkgStatus?: 'Ready' | 'Partial' | 'Missing';

    // Plan Tab
    materialStatus?: 'Ready' | 'Partial' | 'Missing';

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
