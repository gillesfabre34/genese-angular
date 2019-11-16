export class GeneseConfig {
    api: string;
    extract?: string;
    pagination?: {
        pageIndex: string,
        pageSize: string,
        results: string,
        totalResults: string
    } = {
        pageIndex: 'gnPageIndex',
        pageSize: 'gnPageSize',
        results: 'gnResults',
        totalResults: 'gnTotalResults'
    };
}
