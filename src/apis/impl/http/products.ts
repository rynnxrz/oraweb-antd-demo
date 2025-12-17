import { api } from '../../configs/axiosConfigs';
import type {
    CreateProductRequest,
    GetProductResponse,
    UpdateProductRequest,
    DeleteProductResponse
} from '../../../types/schema';

const ENDPOINT = '/products';

export const createProduct = async (data: CreateProductRequest): Promise<GetProductResponse> => {
    const res = await api.request({
        method: 'POST',
        url: `${ENDPOINT}/`,
        data,
    });
    return res.data;
};

export const updateProduct = async (productId: string, data: UpdateProductRequest): Promise<GetProductResponse> => {
    const res = await api.request({
        method: 'PUT',
        url: `${ENDPOINT}/${productId}`,
        data,
    });
    return res.data;
};

export const deleteProduct = async (productId: string): Promise<DeleteProductResponse> => {
    const res = await api.request({
        method: 'DELETE',
        url: `${ENDPOINT}/${productId}`,
    });
    return res.data;
};
