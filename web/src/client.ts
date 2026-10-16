import { api, auth } from '@appdeploy/client';
import type { Workspace, RecordKind, PageKind } from './types';

export { auth };

export class ApiError extends Error {
    code: string;
    status: number;

    constructor(message: string, status = 500) {
        super(message);
        this.name = 'ApiError';
        this.code = message;
        this.status = status;
    }
}

async function request<T>(method: 'get' | 'post' | 'put' | 'delete', path: string, body?: unknown): Promise<T> {
    try {
        const response = method === 'get'
            ? await api.get(path)
            : method === 'post'
                ? await api.post(path, body)
                : method === 'put'
                    ? await api.put(path, body)
                    : await api.delete(path, body);
        return response.data as T;
    } catch (cause) {
        const failure = cause as { response?: { status?: number; data?: { error?: string; message?: string } }; message?: string };
        const status = failure.response?.status ?? 500;
        const message = failure.response?.data?.error ?? failure.response?.data?.message ?? failure.message ?? 'request_failed';
        throw new ApiError(message, status);
    }
}

export const client = {
    workspace: () => request<Workspace>('get', '/api/workspace'),
    saveProfile: (value: unknown) => request('post', '/api/profile', value),
    create: (kind: RecordKind, value: unknown) => request('post', `/api/records/${kind}`, value),
    update: (kind: RecordKind, id: string, value: unknown) => request('put', `/api/records/${kind}/${encodeURIComponent(id)}`, value),
    remove: (kind: RecordKind, id: string) => request('delete', `/api/records/${kind}/${encodeURIComponent(id)}`),
    page: (kind: PageKind, nextToken: string) => request<{ items: Array<Record<string, unknown>>; nextToken?: string }>('get', `/api/records/${kind}?nextToken=${encodeURIComponent(nextToken)}`),
    transition: (id: string, status: string) => request('post', `/api/campaigns/${encodeURIComponent(id)}/transition`, { status }),
    archiveRelease: (id: string) => request('post', `/api/releases/${encodeURIComponent(id)}/archive`, {}),
    suppress: (id: string, reason: string) => request('post', `/api/leads/${encodeURIComponent(id)}/suppress`, { reason }),
    importRoyalties: (statementReference: string, rows: unknown[]) => request<{ imported: number; skipped: number; failed?: number; duplicateOnly: boolean }>('post', '/api/royalties/import', { statementReference, rows }),
    exportPage: () => request<{ product: string; exportedAt: string; data: Record<PageKind, Array<Record<string, unknown>>>; pages: Record<PageKind, string | null> }>('get', '/api/data/export'),
    deletePage: (kind: PageKind, confirmation: string) => request<{ deletedCount: number; moreRecords: boolean; authAccountRemains: boolean }>('delete', `/api/account/data/${kind}`, { confirmation }),
};
