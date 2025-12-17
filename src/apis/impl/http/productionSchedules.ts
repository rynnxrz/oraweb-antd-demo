import { api } from '../../configs/axiosConfigs';
import type {
    CreateProductionScheduleRequest,
    GetProductionScheduleResponse,
    UpdateProductionScheduleRequest,
    GetProductionSchedulesRequest,
    GetContractResponse
} from '../../../types/schema';

const ENDPOINT = '/production_schedules';

export const createProductionSchedule = async (data: CreateProductionScheduleRequest): Promise<GetProductionScheduleResponse> => {
    const res = await api.request({
        method: 'POST',
        url: `${ENDPOINT}/`,
        data,
    });
    return res.data;
};

export const updateProductionSchedule = async (productionScheduleId: string, data: UpdateProductionScheduleRequest): Promise<GetProductionScheduleResponse> => {
    const res = await api.request({
        method: 'PUT',
        url: `${ENDPOINT}/${productionScheduleId}`,
        data,
    });
    return res.data;
};

export const getProductionSchedules = async (params: GetProductionSchedulesRequest): Promise<GetProductionScheduleResponse[]> => {
    const res = await api.request({
        method: 'GET',
        url: `${ENDPOINT}/`,
        params,
    });
    return res.data;
};

export const deleteProductionSchedule = async (productionScheduleId: string): Promise<{ message: string }> => {
    const res = await api.request({
        method: 'DELETE',
        url: `${ENDPOINT}/${productionScheduleId}`,
    });
    return res.data;
};

export const getContractByProductionScheduleId = async (productionScheduleId: string): Promise<GetContractResponse> => {
    const res = await api.request({
        method: 'GET',
        url: `${ENDPOINT}/${productionScheduleId}`,
    });
    return res.data;
};
