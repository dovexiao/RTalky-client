import { get, post, put, del } from '@core/auth/request.ts';

// 笔记信息
export interface NoteInfo {
    noteId: string;
    displayId: string;
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

// 重命名笔记请求参数
export interface RenameNoteRequest {
    title: string;
}

// 更新笔记简介请求参数
export interface UpdateDescriptionRequest {
    description: string;
}

// 更新笔记请求参数（完整更新）
export interface UpdateNoteRequest {
    title: string;
    description: string;
    content: string;
    tags: string[];
}

// 笔记响应数据（包含内容）
export interface NoteResponse {
    noteId: string;
    displayId: string;
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

// 删除响应
export interface DeleteResponse {
    success: true;
    message: string;
    timestamp: string;
}

export class NoteService {
    /**
     * 分页获取笔记列表
     * @param params 分页参数
     * @returns 笔记分页数据
     */
    static async getNoteList(params: NotePageRequest = {}): Promise<NotePageResponse | ErrorResponse> {
        try {
            const { page = 0, size = 20 } = params;

            // 构建查询参数
            const queryParams = new URLSearchParams({
                page: page.toString(),
                size: size.toString(),
            });

            const response = await get<NotePageResponse | ErrorResponse>(`/notes?${queryParams.toString()}`);

            return response;
        } catch (error) {
            // console.error('获取笔记列表失败:', error);
            throw error;
        }
    }

    /**
     * 创建笔记
     * @param request 创建笔记请求参数
     * @returns 创建的笔记数据
     */
    static async createNote(request: CreateNoteRequest): Promise<NoteResponse | ErrorResponse> {
        try {
            const response = await post<NoteResponse | ErrorResponse>('/notes', request);

            return response;
        } catch (error) {
            // console.error('创建笔记失败:', error);
            throw error;
        }
    }

    /**
     * 获取笔记详情
     * @param noteId 笔记ID
     * @returns 笔记详情数据
     */
    static async getNoteDetail(noteId: string): Promise<NoteResponse | ErrorResponse> {
        try {
            const response = await get<NoteResponse | ErrorResponse>(`/notes/${noteId}`);

            return response;
        } catch (error) {
            // console.error('获取笔记详情失败:', error);
            throw error;
        }
    }

    /**
     * 重命名笔记
     * @param noteId 笔记ID
     * @param request 重命名请求参数
     * @returns 更新后的笔记数据
     */
    static async renameNote(noteId: string, request: RenameNoteRequest): Promise<NoteResponse | ErrorResponse> {
        try {
            const response = await put<NoteResponse | ErrorResponse>(`/notes/${noteId}/title`, request);

            return response;
        } catch (error) {
            // console.error('重命名笔记失败:', error);
            throw error;
        }
    }

    /**
     * 修改笔记简介
     * @param noteId 笔记ID
     * @param request 更新简介请求参数
     * @returns 更新后的笔记数据
     */
    static async updateNoteDescription(noteId: string, request: UpdateDescriptionRequest): Promise<NoteResponse | ErrorResponse> {
        try {
            const response = await put<NoteResponse | ErrorResponse>(`/notes/${noteId}/description`, request);

            return response;
        } catch (error) {
            // console.error('修改笔记简介失败:', error);
            throw error;
        }
    }

    /**
     * 修改笔记（完整更新）
     * @param noteId 笔记ID
     * @param request 更新笔记请求参数
     * @returns 更新后的笔记数据
     */
    static async updateNote(noteId: string, request: UpdateNoteRequest): Promise<NoteResponse | ErrorResponse> {
        try {
            const response = await put<NoteResponse | ErrorResponse>(`/notes/${noteId}`, request);

            return response;
        } catch (error) {
            // console.error('修改笔记失败:', error);
            throw error;
        }
    }

    /**
     * 删除笔记
     * @param noteId 笔记ID
     * @returns 删除操作结果
     */
    static async deleteNote(noteId: string): Promise<DeleteResponse> {
        try {
            const response = await del<DeleteResponse>(`/notes/${noteId}`);

            return response;
        } catch (error) {
            // console.error('删除笔记失败:', error);
            throw error;
        }
    }
}
