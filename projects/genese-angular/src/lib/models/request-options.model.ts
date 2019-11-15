import { HttpHeaders, HttpParams } from '@angular/common/http';

export class RequestOptions {
    body?: any;
    headers?: HttpHeaders | {
        [header: string]: string | string[];
    };
    id?: string;
    mapData ?= true;
    observe?: HttpObserve ;
    params?: HttpParams | {
        [param: string]: string | string[];
    };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
}

export type HttpObserve = 'body' | 'events' | 'response';
