import { useSessionStore, createSessionEvents } from './index';
import { SessionService } from '@/auth/services';
import { ExceptionUtils, UserAuthManager } from '@/utils';

// 会话校验服务类
class SessionValidator {
    private isValidationInProgress = false; // 幂等控制

    /**
     * 验证会话有效性
     * 先检查本地会话，再决定是否进行远程验证
     */
    async validateSession(): Promise<void> {
        // 幂等控制：防止重复校验
        if (this.isValidationInProgress) {
            console.log('[SessionValidator] 会话校验已在进行中，跳过重复校验');
            return;
        }

        this.isValidationInProgress = true;
        console.log('[SessionValidator] 开始会话校验流程');

        try {
            // 检查本地会话是否存在
            console.log('[SessionValidator] 检查本地会话存储');
            const hasSession = await UserAuthManager.hasValidSessionStrict();

            if (!hasSession) {
                console.log('[SessionValidator] 本地无有效会话，发布INIT_FAIL事件');
                // 本地无会话 → 发布INIT_FAIL事件
                const events = createSessionEvents();
                useSessionStore.getState().dispatch(events.initFail('本地会话不存在'));
                return;
            }

            console.log('[SessionValidator] 本地会话存在，开始远程验证');

            // 进行远程会话验证
            const result = await SessionService.validateSession();

            console.log('[SessionValidator] 远程会话验证结果:', {
                success: result.success,
                message: result.message,
                timestamp: result.timestamp,
            });

            if (result.success) {
                console.log('[SessionValidator] 会话验证通过，发布INIT_REQUEST事件');
                // 会话有效 → 发布INIT_REQUEST事件（开始初始化流程）
                const events = createSessionEvents();
                useSessionStore.getState().dispatch(events.initRequest());
            }
        } catch (error: unknown) {
            ExceptionUtils.logError(error, 'SessionValidator');

            console.log('[SessionValidator] 会话验证失败，发布INIT_FAIL事件');
            // 会话无效 → 发布INIT_FAIL事件
            const events = createSessionEvents();
            useSessionStore.getState().dispatch(events.initFail(new Error(ExceptionUtils.getErrorMessage(error))));

            // // 根据错误类型发布不同事件
            // if (ExceptionUtils.isUnauthorizedError(error)) {
            //     console.log('[SessionValidator] 检测到401错误，发布TOKEN_401_DETECTED事件');
            //     // 401错误 → 发布TOKEN_401_DETECTED事件（让HTTP守卫处理）
            //     const events = createSessionEvents();
            //     useSessionStore.getState().dispatch(events.token401Detected());
            // } else {
            //     console.log('[SessionValidator] 会话验证异常，发布INIT_FAIL事件');
            //     // 其他所有错误 → 发布INIT_FAIL事件
            //     const events = createSessionEvents();
            //     useSessionStore.getState().dispatch(events.initFail('Session validation exception'));
            // }
        } finally {
            this.isValidationInProgress = false;
            console.log('[SessionValidator] 会话校验流程结束');
        }
    }
}

// 创建单例实例
export const sessionValidationService = new SessionValidator();
