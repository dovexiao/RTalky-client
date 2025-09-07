// api/request.ts
import api from './axios.ts';

type ApiResponse<T> = {
    success: boolean;
    message?: string;
    data?: T;
    code?: number;
};

/**
 * 封装 GET 请求
 * @param url 请求路径
 * @param config 请求配置
 * @returns 响应数据
 */
export const get = async <T = any>(
    url: string,
    config?: Record<string, any>
): Promise<ApiResponse<T>> => {
    try {
        const response = await api.get<ApiResponse<T>>(url, config);
        return response.data;
    } catch (error: any) {
        // 统一错误处理逻辑
        throw handleApiError(error);
    }
};

/**
 * 封装 POST 请求
 * @param url 请求路径
 * @param data 请求数据
 * @param config 请求配置
 * @returns 响应数据
 */
export const post = async <T = any>(
    url: string,
    data?: Record<string, any>,
    config?: Record<string, any>
): Promise<T> => {
    try {
        const response = await api.post<T>(url, data, config);
        return response.data;
    } catch (error: any) {
        // 统一错误处理逻辑
        throw handleApiError(error);
    }
};

/**
 * 统一处理 API 错误
 * @param error 原始错误对象
 * @returns 格式化后的错误响应
 */
const handleApiError = (error: any): ApiResponse<never> => {
    if (error.response) {
        // 服务器返回了错误响应 (4xx, 5xx)
        const { status, data } = error.response;
        return {
            success: false,
            message: data?.message || `服务器错误: ${status}`,
            code: status,
            data: data?.data
        };
    } else if (error.request) {
        // 请求已发出但无响应
        return {
            success: false,
            message: '网络错误: 服务器无响应',
            code: 503
        };
    } else {
        // 请求配置错误
        return {
            success: false,
            message: `请求错误: ${error.message}`,
            code: 400,
        };
    }
};
