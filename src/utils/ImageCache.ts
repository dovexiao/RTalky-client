import RNFS from 'react-native-fs';
import { sha256 } from 'react-native-sha256';

// 缓存分组配置 - 目前只支持头像
const CACHE_GROUPS = {
    AVATARS: 'avatars',  // 用户头像
} as const;

type CacheGroup = keyof typeof CACHE_GROUPS;

// 获取缓存目录路径
const getCacheDir = (group: CacheGroup) =>
    `${RNFS.CachesDirectoryPath}/images/${CACHE_GROUPS[group]}/`;

// 初始化缓存目录
const initCacheDir = async (dirPath: string) => {
    const exists = await RNFS.exists(dirPath);
    if (!exists) {
        await RNFS.mkdir(dirPath, { NSURLIsExcludedFromBackupKey: true });
    }
};

/**
 * 图片缓存管理类
 * 专门用于缓存头像资源
 */
export class ImageCache {
    /**
     * 保存 base64 图片到缓存目录
     * @param base64Data base64 图片数据
     * @param group 缓存分组，目前只支持 'AVATARS'
     * @returns 返回本地文件路径，可用于组件渲染
     */
    static async saveImageToFile(
        base64Data: string,
        group: CacheGroup = 'AVATARS'
    ): Promise<string> {
        try {
            if (!base64Data) {
                throw new Error('Base64 数据不能为空');
            }

            const cacheDir = getCacheDir(group);
            await initCacheDir(cacheDir);

            // 使用 base64 数据生成唯一哈希值作为文件名
            const hash = await sha256(base64Data);
            const filename = `${hash}.jpg`;
            const filePath = `${cacheDir}${filename}`;

            // 如果文件已存在，直接返回路径
            if (await RNFS.exists(filePath)) {
                return filePath;
            }

            // 处理 base64 数据（移除 data:image/jpeg;base64, 前缀）
            const pureBase64 = base64Data.split(',')[1] || base64Data;
            await RNFS.writeFile(filePath, pureBase64, 'base64');

            return filePath;
        } catch (error) {
            console.error('保存图片到缓存失败:', error);
            throw error;
        }
    }

    /**
     * 清理过期的头像缓存
     * @param maxAgeDays 最大保存天数，默认7天
     */
    static async cleanAvatarCacheByAge(maxAgeDays: number = 7): Promise<void> {
        try {
            const cacheDir = getCacheDir('AVATARS');
            const files = await RNFS.readDir(cacheDir);
            const now = new Date();
            const maxAgeMs = maxAgeDays * 24 * 3600 * 1000;

            for (const file of files) {
                const { mtime } = file;
                if (!mtime || now.getTime() - mtime.getTime() >= maxAgeMs) {
                    await RNFS.unlink(file.path);
                }
            }
        } catch (error) {
            console.error('清理过期头像缓存失败:', error);
            throw error;
        }
    }

    /**
     * 清理所有头像缓存
     */
    static async cleanAllAvatarCache(): Promise<void> {
        try {
            const cacheDir = getCacheDir('AVATARS');
            const files = await RNFS.readDir(cacheDir);

            for (const file of files) {
                await RNFS.unlink(file.path);
            }
        } catch (error) {
            console.error('清理所有头像缓存失败:', error);
            throw error;
        }
    }

    /**
     * 获取头像缓存目录大小
     * @returns 缓存大小（字节）
     */
    static async getAvatarCacheSize(): Promise<number> {
        try {
            const cacheDir = getCacheDir('AVATARS');
            const files = await RNFS.readDir(cacheDir);

            let totalSize = 0;
            for (const file of files) {
                totalSize += file.size || 0;
            }

            return totalSize;
        } catch (error) {
            console.error('获取头像缓存大小失败:', error);
            return 0;
        }
    }

    /**
     * 检查头像缓存是否存在
     * @param base64Data base64 图片数据
     * @returns 如果缓存存在返回文件路径，否则返回 null
     */
    static async getCachedAvatarPath(base64Data: string): Promise<string | null> {
        try {
            if (!base64Data) {
                return null;
            }

            const hash = await sha256(base64Data);
            const filename = `${hash}.jpg`;
            const filePath = `${getCacheDir('AVATARS')}${filename}`;

            if (await RNFS.exists(filePath)) {
                return filePath;
            }

            return null;
        } catch (error) {
            console.error('检查头像缓存失败:', error);
            return null;
        }
    }
}

// 导出类型和常量
export type { CacheGroup };
export { CACHE_GROUPS };
