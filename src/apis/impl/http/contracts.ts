import { api } from '../../configs/axiosConfigs';
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

const ENDPOINT = '/contracts';

export const getContracts = async (params: GetContractsRequest): Promise<GetContractResponse[]> => {
    const res = await api.request({
        method: 'GET',
        url: `${ENDPOINT}/`,
        params,
    });
    return res.data;
};

export const getContract = async (contractId: string, params?: GetContractRequest): Promise<GetContractResponse> => {
    const res = await api.request({
        method: 'GET',
        url: `${ENDPOINT}/${contractId}`,
        params,
    });
    return res.data;
};

export const getContractStatusCount = async (params: GetContractStatusRequest): Promise<GetStatusCountResponse> => {
    const res = await api.request({
        method: 'GET',
        url: `${ENDPOINT}/status-count/`,
        params,
    });
    return res.data;
};

export const createContract = async (data: CreateContractRequest): Promise<GetContractResponse> => {
    const res = await api.request({
        method: 'POST',
        url: `${ENDPOINT}/`,
        data,
    });
    return res.data;
};

export const updateContract = async (contractId: string, data: UpdateContractRequest): Promise<GetContractResponse> => {
    const res = await api.request({
        method: 'PUT',
        url: `${ENDPOINT}/${contractId}`,
        data,
    });
    return res.data;
};

export const deleteContract = async (contractId: string): Promise<DeleteContractResponse> => {
    const res = await api.request({
        method: 'DELETE',
        url: `${ENDPOINT}/${contractId}`,
    });
    return res.data;
};
