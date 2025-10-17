import Keychain from 'react-native-keychain';
import Config from 'react-native-config';

// 用户认证信息键名常量
const AUTH_KEYS = {
    PHONE_NUMBER: 'phone_number',
    SESSION_TOKEN: 'session_token',
    CURRENT_USER_ID: 'current_user_id',
} as const;

// 获取当前用户ID的存储键
const getCurrentUserIdKey = (): string => {
    return Config.CURRENT_USER_ID_KEY || 'rtalky_current_user_id';
};

// 用户认证数据类型定义
export interface UserAuthData {
    phoneNumber: string;
    sessionToken: string;
}

export interface AuthStatus {
    isAuthenticated: boolean;
    authData?: UserAuthData;
    error?: string;
}

/**
 * 用户认证管理类
 * 使用react-native-keychain的进阶功能进行多凭证管理
 * 服务属性: rtalky_${userId}_${usernameKey}
 * 用户名属性: 对应字段名 (user_id, phone_number, session_token)
 * 密码属性: 对应值
 */
export class UserAuthManager {
    /**
     * 生成Keychain的服务键
     * @param userId 用户ID
     * @param usernameKey 用户名键
     * @returns 服务键
     */
    private static generateServiceKey(userId: string, usernameKey: string): string {
        return `rtalky_${userId}_${usernameKey}`;
    }

    /**
     * 保存用户认证数据到Keychain
     * @param userId 用户ID
     * @param authData 用户认证数据
     * @returns 是否保存成功
     */
    static async saveUserAuth(userId: string, authData: UserAuthData): Promise<boolean> {
        try {
            const promises = [];

            // 保存手机号
            promises.push(
                Keychain.setInternetCredentials(
                    UserAuthManager.generateServiceKey(userId, AUTH_KEYS.PHONE_NUMBER),
                    AUTH_KEYS.PHONE_NUMBER,
                    authData.phoneNumber
                )
            );

            // 保存会话token
            promises.push(
                Keychain.setInternetCredentials(
                    UserAuthManager.generateServiceKey(userId, AUTH_KEYS.SESSION_TOKEN),
                    AUTH_KEYS.SESSION_TOKEN,
                    authData.sessionToken
                )
            );

            await Promise.all(promises);
            return true;
        } catch (error) {
            console.log('保存用户认证数据失败:', error);
            return false;
        }
    }

    /**
     * 获取用户认证数据
     * @param userId 用户ID
     * @returns 用户认证数据或null
     */
    static async getUserAuth(userId: string): Promise<UserAuthData | null> {
        try {
            // 并行获取所有认证信息
            const [phoneResult, tokenResult] = await Promise.all([
                Keychain.getInternetCredentials(
                    UserAuthManager.generateServiceKey(userId, AUTH_KEYS.PHONE_NUMBER)
                ),
                Keychain.getInternetCredentials(
                    UserAuthManager.generateServiceKey(userId, AUTH_KEYS.SESSION_TOKEN)
                ),
            ]);

            // 检查必要字段是否存在
            if (!phoneResult || !tokenResult) {
                return null;
            }

            return {
                phoneNumber: phoneResult.password,
                sessionToken: tokenResult.password,
            };
        } catch (error) {
            console.log('获取用户认证数据失败:', error);
            return null;
        }
    }

    /**
     * 获取用户手机号
     * @param userId 用户ID
     * @returns 手机号或null
     */
    static async getPhoneNumber(userId: string): Promise<string | null> {
        try {
            const result = await Keychain.getInternetCredentials(
                UserAuthManager.generateServiceKey(userId, AUTH_KEYS.PHONE_NUMBER)
            );
            return (result && result.password) || null;
        } catch (error) {
            console.log('获取手机号失败:', error);
            return null;
        }
    }

    /**
     * 获取用户会话token
     * @param userId 用户ID
     * @returns 会话token或null
     */
    static async getSessionToken(userId: string): Promise<string | null> {
        try {
            const result = await Keychain.getInternetCredentials(
                UserAuthManager.generateServiceKey(userId, AUTH_KEYS.SESSION_TOKEN)
            );
            return (result && result.password) || null;
        } catch (error) {
            console.log('获取会话token失败:', error);
            return null;
        }
    }

    /**
     * 更新用户手机号
     * @param userId 用户ID
     * @param newPhoneNumber 新手机号
     * @returns 是否更新成功
     */
    static async updatePhoneNumber(userId: string, newPhoneNumber: string): Promise<boolean> {
        try {
            await Keychain.setInternetCredentials(
                UserAuthManager.generateServiceKey(userId, AUTH_KEYS.PHONE_NUMBER),
                AUTH_KEYS.PHONE_NUMBER,
                newPhoneNumber
            );
            return true;
        } catch (error) {
            console.log('更新手机号失败:', error);
            return false;
        }
    }

    /**
     * 更新用户会话token
     * @param userId 用户ID
     * @param newSessionToken 新会话token
     * @returns 是否更新成功
     */
    static async updateSessionToken(userId: string, newSessionToken: string): Promise<boolean> {
        try {
            await Keychain.setInternetCredentials(
                UserAuthManager.generateServiceKey(userId, AUTH_KEYS.SESSION_TOKEN),
                AUTH_KEYS.SESSION_TOKEN,
                newSessionToken
            );
            return true;
        } catch (error) {
            console.log('更新会话token失败:', error);
            return false;
        }
    }

    /**
     * 删除用户认证数据
     * @param userId 用户ID
     * @returns 是否删除成功
     */
    static async deleteUserAuth(userId: string): Promise<boolean> {
        try {
            const [phoneResult, tokenResult] = await Promise.allSettled([
                Keychain.resetInternetCredentials({
                    service: UserAuthManager.generateServiceKey(userId, AUTH_KEYS.PHONE_NUMBER),
                }),
                Keychain.resetInternetCredentials({
                    service: UserAuthManager.generateServiceKey(userId, AUTH_KEYS.SESSION_TOKEN),
                }),
            ]);

            const phoneSuccess = phoneResult.status === 'fulfilled';
            const tokenSuccess = tokenResult.status === 'fulfilled';

            if (!phoneSuccess || !tokenSuccess) {
                throw new Error(`删除用户认证数据失败: 手机号删除${phoneSuccess ? '成功' : '失败'}, token删除${tokenSuccess ? '成功' : '失败'}`);
            }

            console.log('删除用户认证数据成功');
            return true;
        } catch (error) {
            console.log('删除用户认证数据失败:', error);
            throw error; // 重新抛出错误
        }
    }

    /**
     * 检查用户是否存在
     * @param userId 用户ID
     * @returns 用户是否存在
     */
    static async userExists(userId: string): Promise<boolean> {
        try {
            const authData = await getUserAuth(userId);
            return authData !== null;
        } catch (error) {
            return false;
        }
    }

    /**
     * 检查用户认证状态
     * @param userId 用户ID
     * @returns 认证状态
     */
    static async getAuthStatus(userId: string): Promise<AuthStatus> {
        try {
            const authData = await getUserAuth(userId);

            if (!authData) {
                return {isAuthenticated: false};
            }

            return {
                isAuthenticated: true,
                authData,
            };
        } catch (error) {
            console.log('获取认证状态失败:', error);
            return {isAuthenticated: false, error: '获取认证状态失败'};
        }
    }

    /**
     * 获取所有已存储的用户ID列表
     * 注意：由于Keychain限制，此方法需要特殊实现
     * @returns 用户ID数组
     */
    static async getAllUserIds(): Promise<string[]> {
        try {
            // 这个实现需要额外的机制来跟踪用户ID
            // 一种方法是维护一个特殊的键来存储所有用户ID
            const result = await Keychain.getInternetCredentials('rtalky_all_users');
            if (result && result.password) {
                return JSON.parse(result.password);
            }
            return [];
        } catch (error) {
            console.log('获取所有用户ID失败:', error);
            return [];
        }
    }

    /**
     * 添加用户到用户列表
     * @param userId 用户ID
     */
    static async addUserToList(userId: string): Promise<void> {
        try {
            const userList = await getAllUserIds();
            if (!userList.includes(userId)) {
                userList.push(userId);
                await Keychain.setInternetCredentials(
                    'rtalky_all_users',
                    'user_list',
                    JSON.stringify(userList)
                );
            }
        } catch (error) {
            console.log('添加用户到列表失败:', error);
        }
    }

    /**
     * 从用户列表中移除用户
     * @param userId 用户ID
     */
    static async removeUserFromList(userId: string): Promise<void> {
        try {
            const userList = await getAllUserIds();
            const updatedList = userList.filter(id => id !== userId);
            await Keychain.setInternetCredentials(
                'rtalky_all_users',
                'user_list',
                JSON.stringify(updatedList)
            );
            console.log('从用户列表中移除用户成功');
        } catch (error: any) {
            console.log('从列表中移除用户失败:', error);
            throw new Error(`从用户列表中移除用户失败: ${error?.message ?? error}`);
        }
    }

    /**
     * 完整的用户认证数据保存（包含用户列表管理）
     * @param userId 用户ID
     * @param authData 用户认证数据
     * @returns 是否保存成功
     */
    static async saveUserAuthWithList(userId: string, authData: UserAuthData): Promise<boolean> {
        try {
            const saveSuccess = await saveUserAuth(userId, authData);
            if (saveSuccess) {
                await addUserToList(userId);
            }
            return saveSuccess;
        } catch (error) {
            console.log('保存用户认证数据（含列表）失败:', error);
            return false;
        }
    }

    /**
     * 完整的用户认证数据删除（包含用户列表管理）
     * @param userId 用户ID
     * @returns 是否删除成功
     */
    static async deleteUserAuthWithList(userId: string): Promise<boolean> {
        try {
            // 删除用户认证数据
            await deleteUserAuth(userId);

            // 从用户列表中移除
            await removeUserFromList(userId);

            console.log('删除用户认证数据（含列表）成功');
            return true;
        } catch (error) {
            console.log('删除用户认证数据（含列表）失败:', error);
            throw error; // 重新抛出错误
        }
    }

    /**
     * 保存当前用户ID到Keychain
     * @param userId 用户ID
     * @returns 是否保存成功
     */
    static async saveCurrentUserId(userId: string): Promise<boolean> {
        try {
            await Keychain.setInternetCredentials(
                getCurrentUserIdKey(),
                AUTH_KEYS.CURRENT_USER_ID,
                userId
            );
            return true;
        } catch (error) {
            console.log('保存当前用户ID失败:', error);
            return false;
        }
    }

    /**
     * 获取当前用户ID
     * @returns 当前用户ID或null
     */
    static async getCurrentUserId(): Promise<string | null> {
        try {
            const result = await Keychain.getInternetCredentials(getCurrentUserIdKey());
            return (result && result.password) || null;
        } catch (error) {
            console.log('获取当前用户ID失败:', error);
            return null;
        }
    }

    /**
     * 删除当前用户ID
     * @returns 是否删除成功
     */
    static async deleteCurrentUserId(): Promise<boolean> {
        try {
            await Keychain.resetInternetCredentials({
                service: getCurrentUserIdKey(),
            });
            console.log('删除当前用户ID成功');
            return true;
        } catch (error: any) {
            console.log('删除当前用户ID失败:', error);
            throw new Error(`删除当前用户ID失败: ${error?.message ?? error}`);
        }
    }

    /**
     * 完整的用户认证数据保存（包含当前用户ID和用户列表管理）
     * @param userId 用户ID
     * @param authData 用户认证数据
     * @returns 是否保存成功
     */
    static async saveUserAuthComplete(userId: string, authData: UserAuthData): Promise<boolean> {
        try {
            const saveSuccess = await saveUserAuthWithList(userId, authData);
            if (saveSuccess) {
                // 保存当前用户ID
                await saveCurrentUserId(userId);
            }
            console.log('保存用户认证数据（完整）成功');
            return saveSuccess;
        } catch (error) {
            console.log('保存用户认证数据（完整）失败:', error);
            return false;
        }
    }

    /**
     * 完整的用户认证数据删除（包含当前用户ID和用户列表管理）
     * @param userId 用户ID
     * @returns 是否删除成功
     */
    static async deleteUserAuthComplete(userId: string): Promise<boolean> {
        try {
            const deleteSuccess = await deleteUserAuthWithList(userId);
            if (deleteSuccess) {
                // 删除当前用户ID
                await deleteCurrentUserId();
            }
            return deleteSuccess;
        } catch (error) {
            console.log('删除用户认证数据（完整）失败:', error);
            return false;
        }
    }

    /**
     * 检查当前会话是否存在（不暴露用户ID和会话信息）
     * @returns 会话是否存在
     */
    static async hasValidSession(): Promise<boolean> {
        try {
            // 获取当前用户ID
            const userId = await getCurrentUserId();
            if (!userId) {
                return false;
            }

            // 检查该用户是否有有效的认证数据
            const authData = await getUserAuth(userId);
            if (!authData) {
                return false;
            }

            // 检查关键字段是否存在且不为空
            const hasValidData = !!authData.phoneNumber && !!authData.sessionToken && authData.phoneNumber.trim() !== '' && authData.sessionToken.trim() !== '';

            return hasValidData;
        } catch (error) {
            console.log('检查当前会话失败:', error);
            return false;
        }
    }

    /**
     * 检查当前会话是否存在（更严格的检查）
     * @returns 会话是否存在
     */
    static async hasValidSessionStrict(): Promise<boolean> {
        try {
            // 获取当前用户ID
            const userId = await getCurrentUserId();
            if (!userId) {
                return false;
            }

            // 并行检查手机号和会话token是否存在
            const [phoneResult, tokenResult] = await Promise.all([
                getPhoneNumber(userId),
                getSessionToken(userId),
            ]);

            // 检查两个关键字段都存在且不为空
            const hasValidData = !!phoneResult && !!tokenResult && phoneResult.trim() !== '' && tokenResult.trim() !== '';

            return hasValidData;
        } catch (error) {
            console.log('检查当前会话失败:', error);
            return false;
        }
    }

    /**
     * 完整删除当前用户的所有认证数据（包含当前用户ID和用户列表管理）
     * @returns 是否删除成功
     */
    static async deleteCurrentUserComplete(): Promise<boolean> {
        try {
            // 获取当前用户ID
            const userId = await getCurrentUserId();
            if (!userId) {
                console.log('没有当前用户ID，无需删除');
                return true;
            }

            console.log(`开始删除用户 ${userId} 的所有认证数据`);

            // 删除当前用户的所有认证数据
            await deleteUserAuthWithList(userId);

            // 删除当前用户ID
            await deleteCurrentUserId();

            console.log('删除当前用户认证数据（完整）成功');
            return true;
        } catch (error) {
            console.log('删除当前用户认证数据（完整）失败:', error);
            throw error; // 重新抛出错误，让调用方知道删除失败
        }
    }

    /**
     * 获取当前用户的会话token
     * @returns 当前用户的会话token或null
     */
    static async getCurrentSessionToken(): Promise<string | null> {
        try {
            // 获取当前用户ID
            const userId = await getCurrentUserId();
            if (!userId) {
                console.log('没有当前用户ID');
                return null;
            }

            // 获取当前用户的会话token
            const token = await getSessionToken(userId);
            return token;
        } catch (error) {
            console.log('获取当前用户会话token失败:', error);
            return null;
        }
    }

    /**
     * 获取当前用户的手机号
     * @returns 当前用户的手机号或null
     */
    static async getCurrentPhoneNumber(): Promise<string | null> {
        try {
            // 获取当前用户ID
            const userId = await getCurrentUserId();
            if (!userId) {
                console.log('没有当前用户ID');
                return null;
            }

            // 获取当前用户的手机号
            const phoneNumber = await getPhoneNumber(userId);
            return phoneNumber;
        } catch (error) {
            console.log('获取当前用户手机号失败:', error);
            return null;
        }
    }

    /**
     * 获取当前用户的完整认证数据
     * @returns 当前用户的认证数据或null
     */
    static async getCurrentUserAuth(): Promise<UserAuthData | null> {
        try {
            // 获取当前用户ID
            const userId = await getCurrentUserId();
            if (!userId) {
                console.log('没有当前用户ID');
                return null;
            }

            // 获取当前用户的完整认证数据
            const authData = await getUserAuth(userId);
            return authData;
        } catch (error) {
            console.log('获取当前用户认证数据失败:', error);
            return null;
        }
    }
}

// 导出便捷方法
export const {
    saveUserAuth,
    getUserAuth,
    getPhoneNumber,
    getSessionToken,
    updatePhoneNumber,
    updateSessionToken,
    deleteUserAuth,
    userExists,
    getAuthStatus,
    getAllUserIds,
    addUserToList,
    removeUserFromList,
    saveUserAuthWithList,
    deleteUserAuthWithList,
    saveCurrentUserId,
    getCurrentUserId,
    deleteCurrentUserId,
    saveUserAuthComplete,
    deleteUserAuthComplete,
    hasValidSession,
    hasValidSessionStrict,
    deleteCurrentUserComplete,
    getCurrentSessionToken,
    getCurrentPhoneNumber,
    getCurrentUserAuth,
} = UserAuthManager;
