import axios, { AxiosInstance, AxiosRequestHeaders, CancelTokenSource } from 'axios';
import Config from 'react-native-config';
import UserAuthManager from '@/utils/UserAuthManager';
import { useAuthStore } from '@/auth/stores/auth.store.ts';
import { useNavigationStore } from '@navigation/stores';

// 401 处理并发锁
let isHandling401 = false;

// 存储所有进行中的请求
const pendingRequests = new Map<string, CancelTokenSource>();

// 生成请求唯一标识
const generateRequestId = () => `${Date.now()}_${Math.random()}`;

const api: AxiosInstance = axios.create({
    baseURL: Config.API_URL,
    timeout: 10000,
});

api.interceptors.request.use(async (config) => {
    try {
        const token = await UserAuthManager.getCurrentSessionToken();
        console.log('当前用户Token:', token);

        if (config.headers) {
            (config.headers as AxiosRequestHeaders).set('Authorization', `Bearer ${token ?? ''}`);

            (config.headers as AxiosRequestHeaders).set('Content-Type', 'application/json');
            (config.headers as AxiosRequestHeaders).set('Accept', 'application/json');
        }

        // 为每个请求添加取消令牌
        const requestId = generateRequestId();
        const cancelTokenSource = axios.CancelToken.source();
        config.cancelToken = cancelTokenSource.token;
        config.requestId = requestId;

        pendingRequests.set(requestId, cancelTokenSource);

        // 输出请求信息的 JSON
        // console.log('请求信息 JSON:', JSON.stringify(config));
        console.log('请求信息 JSON:', config);

        return config;
    } catch (error) {
        throw error;
    }
});

api.interceptors.response.use((response) => {
    // 请求完成，移除取消令牌
    const requestId = response.config?.requestId;
    if (requestId) {
        pendingRequests.delete(requestId);
    }

    // console.log('响应信息 JSON:', JSON.stringify(response));
    console.log('响应信息 JSON:', response);

    return response;
}, async (resError) => {
    try {
        // 请求完成，移除取消令牌
        const requestId = resError.config?.requestId;
        if (requestId) {
            pendingRequests.delete(requestId);
        }
        // 输出错误响应信息的 JSON
        console.log('错误响应信息 JSON:', resError);

        if (resError.response?.status === 401) {
            // 401 幂等处理：如果已经在处理中，直接返回
            if (isHandling401) {
                console.log('401 已在处理中，跳过重复处理');
                return Promise.reject(resError);
            }

            // 设置锁，开始处理
            isHandling401 = true;
            console.log('Token 过期或无效，清除本地认证信息');

            // 取消所有进行中的请求
            console.log(`取消 ${pendingRequests.size} 个进行中的请求`);
            pendingRequests.forEach((source, requestId) => {
                source.cancel('Token expired, request cancelled');
                pendingRequests.delete(requestId);
            });

            const { resetInitialRouteName } = useNavigationStore.getState();
            resetInitialRouteName();

            const { setIsLoggedIn } = useAuthStore.getState();
            setIsLoggedIn(false);

            isHandling401 = false;
        }

        return Promise.reject(resError);
    } catch (error) {
        throw error;
    }
});

export default api;
