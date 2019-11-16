
export interface GetAllWithPaginationParams {
    extract?: {
        [key: string]: any
    };
    filters?: {
        [key: string]: string
    };
    order?: 'asc' | 'desc';
    pageIndex: number;
    pageSize: number;
    sort?: string;
}

export interface GetAllParams {
    extract?: {
        [key: string]: any
    };
    filters?: {
        [key: string]: string
    };
    order?: 'asc' | 'desc';
    sort?: string;
}

export interface GetAllResponse<T> {
    totalResults?: number;
    results: T[];
}
