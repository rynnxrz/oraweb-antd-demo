import { api } from '../../configs/axiosConfigs';
import type {
    GetProductionLineCategoryResponse
} from '../../../types/schema';

const ENDPOINT = '/production-lines';

export const getProductionLineMapping = async (): Promise<GetProductionLineCategoryResponse[]> => {
    const res = await api.request({
        method: 'GET',
        url: `${ENDPOINT}/production-line-mapping`,
    });
    return res.data;
};
