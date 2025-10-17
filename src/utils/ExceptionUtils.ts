/**
 * 异常处理工具类
 */
export class ExceptionUtils {
    /**
     * 安全地记录错误信息
     * @param error 错误对象
     * @param context 上下文信息（可选）
     */
    static logError(error: unknown, context?: string): void {
        const prefix = context ? `[${context}] ` : '';

        console.error(`${prefix}Error: ${this.getErrorMessage(error)}`,
            { ...this.getErrorInfo(error) }
        );
    }

    /**
     * 获取错误消息
     * @param error 错误对象
     * @returns 错误消息字符串
     */
    static getErrorMessage(error: unknown): string {
        if (error instanceof Error && this.isAxiosError(error)) {
            const axiosError = error as any;
            return axiosError?.response?.data?.message;
        }
        if (error instanceof Error) {
            return error.message;
        }
        return String(error);
    }

    /**
     * 获取完整的错误信息对象
     * @param error 错误对象
     * @returns 包含所有可用错误信息的对象
     */
    static getErrorInfo(error: unknown): Record<string, unknown> {
        if (error instanceof Error) {
            return {
                name: error.name,
                // message: error.message,
                // stack: error.stack,
                ...this.extractErrorDetails(error),
            };
        }
        return {
            name: 'UnknownError',
        };
    }

    /**
     * 提取特定类型错误的详细信息
     * @param error 错误对象
     * @returns 详细信息对象
     */
    private static extractErrorDetails(error: Error): Record<string, unknown> {
        // Axios 错误处理
        if (this.isAxiosError(error)) {
            const axiosError = error as any;
            return {
                code: axiosError.code,
                message: axiosError.message,
                status: axiosError.response?.status,
                statusText: axiosError.response?.statusText,
                url: axiosError.config?.url,
                method: axiosError.config?.method,
                requestData: axiosError.config?.data,
                responseData: axiosError.response?.data,
            };
        }

        // 其他特定错误类型的处理可以在这里扩展
        return {};
    }

    /**
     * 类型守卫：检查是否为 Axios 错误
     * @param error 错误对象
     * @returns 是否为 Axios 错误
     */
    private static isAxiosError(error: Error): boolean {
        return 'isAxiosError' in error || ('config' in error && 'request' in error);
    }

    /**
     * 检查是否为401未授权错误
     * @param error 错误对象
     * @returns 是否为401错误
     */
    static isUnauthorizedError(error: unknown): boolean {
        if (this.isAxiosError(error as Error)) {
            const axiosError = error as any;
            return axiosError.response?.status === 401;
        }
        return false;
    }
}
