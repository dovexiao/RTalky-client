// 在文件顶部或类型声明文件中添加以下内容
import 'axios';

declare module 'axios' {
    export interface InternalAxiosRequestConfig {
        requestId?: string;
    }
}
