import { api } from '../../configs/axiosConfigs';
import type {
    GetPackagingMappingResponse
} from '../../../types/schema';

const ENDPOINT = '/packagings';

export const getPackagingUnitMapping = async (): Promise<GetPackagingMappingResponse[]> => {
    const res = await api.request({
        method: 'GET',
        url: `${ENDPOINT}/unit-mapping`,
    });
    return res.data;
};
