import { get, post } from '@services/fetch/request.ts';

// 笔记信息
export interface NoteInfo {
    noteId: string;
    title: string;
    description: string;
    tags: string[];
    createdTime: string;
    updatedTime: string;
}

// 创建笔记请求参数
export interface CreateNoteRequest {
    title: string;
    description: string;
    content: string;
    tags: string[];
}

// 笔记响应数据（包含内容）
export interface NoteResponse {
    noteId: string;
    title: string;
    description: string;
    content: string;
    tags: string[];
    createdTime: string;
    updatedTime: string;
}

// 分页响应数据
export interface NotePageResponse {
    content: NoteInfo[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
    hasNext: boolean;
    hasPrevious: boolean;
}

// 分页请求参数
export interface NotePageRequest {
    page?: number;
    size?: number;
}

// 错误响应
export interface ErrorResponse {
    success: false;
    message: string;
    timestamp: string;
}

export class NoteService {
    /**
     * 分页获取笔记列表
     * @param params 分页参数
     * @returns 笔记分页数据
     */
    static async getNoteList(params: NotePageRequest = {}): Promise<NotePageResponse> {
        try {
            const { page = 0, size = 20 } = params;

            // 构建查询参数
            const queryParams = new URLSearchParams({
                page: page.toString(),
                size: size.toString(),
            });

            const response = await get<NotePageResponse>(`/notes?${queryParams.toString()}`);

            return response;
        } catch (error) {
            console.error('获取笔记列表失败:', error);
            throw error;
        }
    }

    /**
     * 创建笔记
     * @param request 创建笔记请求参数
     * @returns 创建的笔记数据
     */
    static async createNote(request: CreateNoteRequest): Promise<NoteResponse> {
        try {
            const response = await post<NoteResponse>('/notes', request);

            return response;
        } catch (error) {
            console.error('创建笔记失败:', error);
            throw error;
        }
    }
}
