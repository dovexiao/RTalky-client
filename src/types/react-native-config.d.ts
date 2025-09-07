// react-native-config.d.ts
declare module 'react-native-config' {
    export interface NativeConfig {
        APP_ENV: 'development' | 'staging' | 'production';
        API_URL: string;
        APP_NAME: string;
        APP_VERSION: string;
        DEFAULT_LOCALE: 'zh-CN' | 'en-US';
        LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';
        CURRENT_USER_ID_KEY: string;
    }
    export const Config: NativeConfig;
    export default Config;
}
