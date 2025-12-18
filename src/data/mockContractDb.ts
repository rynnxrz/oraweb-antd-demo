import type { Contract } from '../types';
import dayjs from 'dayjs';

const today = dayjs();
const fmt = (d: dayjs.Dayjs) => d.format('YYYY-MM-DD');

// Helper to create dates relative to today
const daysAgo = (n: number) => fmt(today.subtract(n, 'day'));
const daysFromNow = (n: number) => fmt(today.add(n, 'day'));

const generateContracts = (): Contract[] => {
    return [
        // --- 1. Healthy Contracts (5 items) ---
        {
            id: 'C24-1001', contractNo: 'C241001', client: 'Little Umbrella', brand: 'Little Umbrella', productName: 'Gummies',
            totalQty: 50000, scheduledQty: 50000, status: 'Production',
            signingDate: daysAgo(20), depositStatus: 'Paid', preProdPaymentStatus: 'Paid',
            materialStatus: 'Ready', productionStartDate: daysAgo(5), productionEndDate: daysFromNow(10),
            dueDate: daysFromNow(15), lastUpdated: daysAgo(1)
        },
        {
            id: 'C24-1002', contractNo: 'C241002', client: 'PowerGums', brand: 'PowerGums', productName: 'Powder',
            totalQty: 10000, scheduledQty: 10000, status: 'Completed',
            signingDate: daysAgo(60), depositStatus: 'Paid', preProdPaymentStatus: 'Paid',
            materialStatus: 'Ready', productionStartDate: daysAgo(50), productionEndDate: daysAgo(40),
            dueDate: daysAgo(35), shippingDate: daysAgo(38), lastUpdated: daysAgo(38),
            finalPaymentStatus: 'Paid'
        },
        {
            id: 'C24-1003', contractNo: 'C241003', client: 'Vitality', brand: 'Vitality', productName: 'Capsules',
            totalQty: 25000, scheduledQty: 25000, status: 'Pending',
            signingDate: daysAgo(2), depositStatus: 'Paid', preProdPaymentStatus: 'Pending',
            materialStatus: 'Ready', productionStartDate: daysFromNow(20),
            dueDate: daysFromNow(40), lastUpdated: daysAgo(0)
        },
        {
            id: 'C24-1004', contractNo: 'C241004', client: 'Muscle', brand: 'Muscle', productName: 'Tablets',
            totalQty: 100000, scheduledQty: 100000, status: 'Production',
            signingDate: daysAgo(15), depositStatus: 'Paid', preProdPaymentStatus: 'Paid',
            materialStatus: 'Ready', productionStartDate: daysAgo(2),
            dueDate: daysFromNow(25), lastUpdated: daysAgo(0)
        },
        {
            id: 'C24-1005', contractNo: 'C241005', client: 'HerbalLife', brand: 'HerbalLife', productName: 'Liquids',
            totalQty: 15000, scheduledQty: 0, status: 'Pending',
            signingDate: daysAgo(1), depositStatus: 'Unpaid',
            dueDate: daysFromNow(60), lastUpdated: daysAgo(0)
        },

        // --- 2. Payment Blocked (S1) (3 items) ---
        // Blocked > 3 days (Warning)
        {
            id: 'C24-2001', contractNo: 'C242001', client: 'GNC', brand: 'GNC', productName: 'Powder',
            totalQty: 20000, scheduledQty: 0, status: 'Pending',
            signingDate: daysAgo(10), // Signed 10 days ago
            depositStatus: 'Unpaid', // Still unpaid
            lastUpdated: daysAgo(9),
            dueDate: daysFromNow(50)
        },
        // Blocked > 5 days (Critical)
        {
            id: 'C24-2002', contractNo: 'C242002', client: 'Nature Bounty', brand: 'Nature Bounty', productName: 'Gummies',
            totalQty: 80000, scheduledQty: 0, status: 'Pending',
            signingDate: daysAgo(18), // Signed 18 days ago
            depositStatus: 'Unpaid',
            lastUpdated: daysAgo(15),
            dueDate: daysFromNow(40)
        },
        // Pre-prod payment missing
        {
            id: 'C24-2003', contractNo: 'C242003', client: 'Little Umbrella', brand: 'Little Umbrella', productName: 'Capsules',
            totalQty: 30000, scheduledQty: 30000, status: 'Pending',
            signingDate: daysAgo(25), depositStatus: 'Paid',
            preProdPaymentStatus: 'Unpaid', // Blocked here
            productionStartDate: daysFromNow(2), // Should start soon but blocked
            lastUpdated: daysAgo(1),
            dueDate: daysFromNow(20)
        },

        // --- 3. Material Risk (S2) (3 items) ---
        // Missing materials, prod start in 5 days
        {
            id: 'C24-3001', contractNo: 'C243001', client: 'PowerGums', brand: 'PowerGums', productName: 'Liquids',
            totalQty: 12000, scheduledQty: 12000, status: 'Pending',
            signingDate: daysAgo(20), depositStatus: 'Paid',
            materialStatus: 'Missing',
            productionStartDate: daysFromNow(5), // Risk!
            dueDate: daysFromNow(30),
            lastUpdated: daysAgo(2)
        },
        // Missing materials, prod start was yesterday (Blocked!)
        {
            id: 'C24-3002', contractNo: 'C243002', client: 'Vitality', brand: 'Vitality', productName: 'Gummies',
            totalQty: 40000, scheduledQty: 40000, status: 'Pending',
            signingDate: daysAgo(30), depositStatus: 'Paid',
            materialStatus: 'Partial',
            productionStartDate: daysAgo(1), // Already passed!
            dueDate: daysFromNow(25),
            lastUpdated: daysAgo(1)
        },
        // Missing materials, prod start in 10 days
        {
            id: 'C24-3003', contractNo: 'C243003', client: 'Muscle', brand: 'Muscle', productName: 'Powder',
            totalQty: 5000, scheduledQty: 5000, status: 'Pending',
            signingDate: daysAgo(15), depositStatus: 'Paid',
            materialStatus: 'Missing',
            productionStartDate: daysFromNow(10),
            dueDate: daysFromNow(40),
            lastUpdated: daysAgo(3)
        },

        // --- 4. Production Delay (S4) (3 items) ---
        // In Production, but passed Estimated End Date
        {
            id: 'C24-4001', contractNo: 'C244001', client: 'HerbalLife', brand: 'HerbalLife', productName: 'Tablets',
            totalQty: 60000, scheduledQty: 60000, status: 'Production',
            signingDate: daysAgo(40), depositStatus: 'Paid', materialStatus: 'Ready',
            productionStartDate: daysAgo(20),
            productionEndDate: daysAgo(2), // Should have finished 2 days ago
            dueDate: daysFromNow(5), // Approaching deadline
            lastUpdated: daysAgo(0)
        },
        // In Production, passed Due Date severely
        {
            id: 'C24-4002', contractNo: 'C244002', client: 'GNC', brand: 'GNC', productName: 'Capsules',
            totalQty: 150000, scheduledQty: 150000, status: 'Production',
            signingDate: daysAgo(60), depositStatus: 'Paid', materialStatus: 'Ready',
            productionStartDate: daysAgo(35),
            productionEndDate: daysAgo(10),
            dueDate: daysAgo(5), // 5 days late!
            lastUpdated: daysAgo(1)
        },
        // Production not started yet, but already past start date (Wait to Prod)
        {
            id: 'C24-4003', contractNo: 'C244003', client: 'Nature Bounty', brand: 'Nature Bounty', productName: 'Gummies',
            totalQty: 45000, scheduledQty: 45000, status: 'Pending',
            signingDate: daysAgo(25), depositStatus: 'Paid', materialStatus: 'Ready',
            productionStartDate: daysAgo(3), // Should have started 3 days ago
            dueDate: daysFromNow(20),
            lastUpdated: daysAgo(1)
        },

        // --- 5. Shipping (S5) & Data Quality (2 items) ---
        // Zombie Contract (Inactive > 45d)
        {
            id: 'C24-9001', contractNo: 'C249001', client: 'ZombieCorp', brand: 'ZombieCorp', productName: 'Unknown',
            totalQty: 0, scheduledQty: 0, status: 'Pending',
            signingDate: daysAgo(100),
            lastUpdated: daysAgo(50), // 50 days inactive
            dueDate: daysAgo(20)
        },
        // Data Quality: Start Date after End Date
        {
            id: 'C24-9002', contractNo: 'C249002', client: 'Glitchy', brand: 'Glitchy', productName: 'Error',
            totalQty: 1000, scheduledQty: 1000, status: 'Production',
            signingDate: daysAgo(10),
            productionStartDate: daysFromNow(10),
            productionEndDate: daysAgo(5), // End < Start
            dueDate: daysFromNow(20),
            lastUpdated: daysAgo(1)
        }
    ];
};

export const MOCK_CONTRACT_DB = generateContracts();
