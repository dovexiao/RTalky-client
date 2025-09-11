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
class UserAuthManager {
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
                    this.generateServiceKey(userId, AUTH_KEYS.PHONE_NUMBER),
                    AUTH_KEYS.PHONE_NUMBER,
                    authData.phoneNumber
                )
            );

            // 保存会话token
            promises.push(
                Keychain.setInternetCredentials(
                    this.generateServiceKey(userId, AUTH_KEYS.SESSION_TOKEN),
                    AUTH_KEYS.SESSION_TOKEN,
                    authData.sessionToken
                )
            );

            await Promise.all(promises);
            return true;
        } catch (error) {
            console.error('保存用户认证数据失败:', error);
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
                    this.generateServiceKey(userId, AUTH_KEYS.PHONE_NUMBER)
                ),
                Keychain.getInternetCredentials(
                    this.generateServiceKey(userId, AUTH_KEYS.SESSION_TOKEN)
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
            console.error('获取用户认证数据失败:', error);
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
                this.generateServiceKey(userId, AUTH_KEYS.PHONE_NUMBER)
            );
            return (result && result.password) || null;
        } catch (error) {
            console.error('获取手机号失败:', error);
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
                this.generateServiceKey(userId, AUTH_KEYS.SESSION_TOKEN)
            );
            return (result && result.password) || null;
        } catch (error) {
            console.error('获取会话token失败:', error);
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
                this.generateServiceKey(userId, AUTH_KEYS.PHONE_NUMBER),
                AUTH_KEYS.PHONE_NUMBER,
                newPhoneNumber
            );
            return true;
        } catch (error) {
            console.error('更新手机号失败:', error);
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
                this.generateServiceKey(userId, AUTH_KEYS.SESSION_TOKEN),
                AUTH_KEYS.SESSION_TOKEN,
                newSessionToken
            );
            return true;
        } catch (error) {
            console.error('更新会话token失败:', error);
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
            await Promise.all([
                Keychain.resetInternetCredentials({
                    service: this.generateServiceKey(userId, AUTH_KEYS.PHONE_NUMBER),
                }),
                Keychain.resetInternetCredentials({
                    service: this.generateServiceKey(userId, AUTH_KEYS.SESSION_TOKEN),
                }),
            ]);
            return true;
        } catch (error) {
            console.error('删除用户认证数据失败:', error);
            return false;
        }
    }

    /**
     * 检查用户是否存在
     * @param userId 用户ID
     * @returns 用户是否存在
     */
    static async userExists(userId: string): Promise<boolean> {
        try {
            const authData = await this.getUserAuth(userId);
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
            const authData = await this.getUserAuth(userId);

            if (!authData) {
                return {isAuthenticated: false};
            }

            return {
                isAuthenticated: true,
                authData,
            };
        } catch (error) {
            console.error('获取认证状态失败:', error);
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
            console.error('获取所有用户ID失败:', error);
            return [];
        }
    }

    /**
     * 添加用户到用户列表
     * @param userId 用户ID
     */
    static async addUserToList(userId: string): Promise<void> {
        try {
            const userList = await this.getAllUserIds();
            if (!userList.includes(userId)) {
                userList.push(userId);
                await Keychain.setInternetCredentials(
                    'rtalky_all_users',
                    'user_list',
                    JSON.stringify(userList)
                );
            }
        } catch (error) {
            console.error('添加用户到列表失败:', error);
        }
    }

    /**
     * 从用户列表中移除用户
     * @param userId 用户ID
     */
    static async removeUserFromList(userId: string): Promise<void> {
        try {
            const userList = await this.getAllUserIds();
            const updatedList = userList.filter(id => id !== userId);
            await Keychain.setInternetCredentials(
                'rtalky_all_users',
                'user_list',
                JSON.stringify(updatedList)
            );
        } catch (error) {
            console.error('从列表中移除用户失败:', error);
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
            const saveSuccess = await this.saveUserAuth(userId, authData);
            if (saveSuccess) {
                await this.addUserToList(userId);
            }
            return saveSuccess;
        } catch (error) {
            console.error('保存用户认证数据（含列表）失败:', error);
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
            const deleteSuccess = await this.deleteUserAuth(userId);
            if (deleteSuccess) {
                await this.removeUserFromList(userId);
            }
            return deleteSuccess;
        } catch (error) {
            console.error('删除用户认证数据（含列表）失败:', error);
            return false;
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
            console.error('保存当前用户ID失败:', error);
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
            console.error('获取当前用户ID失败:', error);
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
            return true;
        } catch (error) {
            console.error('删除当前用户ID失败:', error);
            return false;
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
            const saveSuccess = await this.saveUserAuthWithList(userId, authData);
            if (saveSuccess) {
                // 保存当前用户ID
                await this.saveCurrentUserId(userId);
            }
            console.log('保存用户认证数据（完整）成功');
            return saveSuccess;
        } catch (error) {
            console.error('保存用户认证数据（完整）失败:', error);
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
            const deleteSuccess = await this.deleteUserAuthWithList(userId);
            if (deleteSuccess) {
                // 删除当前用户ID
                await this.deleteCurrentUserId();
            }
            return deleteSuccess;
        } catch (error) {
            console.error('删除用户认证数据（完整）失败:', error);
            return false;
        }
    }
}

// 导出UserAuthManager类
export default UserAuthManager;

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
} = UserAuthManager;
