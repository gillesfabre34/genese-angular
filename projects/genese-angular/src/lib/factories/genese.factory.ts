import { Observable, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { GetAllWithPaginationParams, GetAllResponse, GetAllParams } from '../models/get-all-params.model';
import { TConstructor } from '../models/t-constructor.model';
import { GeneseMapperFactory } from './genese-mapper.factory';
import { Tools } from '../services/tools.service';
import { GeneseEnvironmentService } from '../services/genese-environment.service';
import { ResponseStatus } from '../enums/response-status';
import { RequestMethod } from '../enums/request-method';
import { RequestOptions } from '../models/request-options.model';
import { GetOneParams } from '../models/get-one-params.model';

export class Genese<T> {

    // --------------------------------------------------
    //                     PROPERTIES
    // --------------------------------------------------


    private geneseMapperService: GeneseMapperFactory<T>;

    // --------------------------------------------------
    //                     CONSTRUCTOR
    // --------------------------------------------------


    constructor(private http: HttpClient,
                private geneseEnvironment: GeneseEnvironmentService,
                private tConstructor: TConstructor<T>) {
        this.geneseMapperService = new GeneseMapperFactory<T>(tConstructor);
    }


    // --------------------------------------------------
    //                   CRUD METHODS
    // --------------------------------------------------


    /**
     * Create an object and return an Observable of the created object with T type
     */
    create(path: string, body?: object, options?: RequestOptions): Observable<T | any> {
        body = Tools.default(body, {});
        options = Tools.default(options, {});
        options.headers = Tools.default(options.headers, {'Content-Type': 'application/json'});
        const requestOptions: any = Object.assign(options, {observe: 'body'});
        const url = this.apiRoot(path);
        return this.http.post(url, body, requestOptions)
            .pipe(
                map((result) => {
                    if (options && options.mapData === false) {
                        return result;
                    } else {
                        return this.geneseMapperService.mapToObject(result);
                    }
                })
            );
    }


    /**
     * Delete an element and returns success or failed status
     */
    delete(path: string, id?: string, options?: RequestOptions): Observable<ResponseStatus> {
        if (!path) {
            console.error('Undefined path : impossible to delete element');
            return of(undefined);
        }
        const url = this.apiRoot(path, id);
        return this.http.delete(url, {observe: 'response'})
            .pipe(
                map((response: HttpResponse<any>) => {
                    return response && response.ok === true ? ResponseStatus.SUCCESS : ResponseStatus.FAILED;
                })
            );
    }

    /**
     * Returns mapped object using fetch method
     */
    async fetch(path: string, method: RequestMethod, requestInit?: RequestInit): Promise<T> {
        if (!method || !path) {
            console.error('Incorrect parameters : impossible to send request');
            return Promise.reject('Incorrect parameters : impossible to send request');
        }
        const url = this.apiRoot(path);
        const response = await fetch(url, requestInit);
        const data = await response.clone().json();
        if (method === RequestMethod.DELETE) {
            return this.geneseMapperService.mapToObject<T>(data ? data.body : undefined);
        } else {
            return this.geneseMapperService.mapToObject<T>(data);
        }
    }


    /**
     * Get all elements of array of data returned by GET request and map them with T type
     */
    getAll(params?: GetAllParams): Observable<T[]> {
        let httpParams = new HttpParams();
        if (params && params.filters) {
            for (const key of Object.keys(params.filters)) {
                if (params.filters[key]) {
                    httpParams = httpParams.set(key, params.filters[key].toString());
                }
            }
        }
        const options = {params: httpParams};
        const url = this.apiRoot(this.getStandardPath());
        return this.http.get(url, options).pipe(
            map((response: any) => {
                return response ? this.geneseMapperService.mapGetAllResults<T>(response) : [];
            })
        );
    }


    /**
     * Get all elements of array of data returned by GET request and map them with T type
     */
    getAllCustom(path: string, params?: GetAllParams): Observable<T[]> {
        let httpParams = new HttpParams();
        if (!path) {
            console.error('No path : impossible to get elements');
            return of(undefined);
        }
        if (params && params.filters) {
            for (const key of Object.keys(params.filters)) {
                if (params.filters[key]) {
                    httpParams = httpParams.set(key, params.filters[key].toString());
                }
            }
        }
        const options = {params: httpParams};
        const url = this.apiRoot(path);
        return this.http.get(url, options).pipe(
            map((response: any) => {
                return response ? this.geneseMapperService.mapGetAllResults<T>(response) : [];
            })
        );
    }


    /**
     * Get all elements with pagination
     * If the http response have paginated format, it returns paginated response with this format :
     * {
     *      totalResults?: number;
     *      results: T[];
     * }
     */
    getAllWithPagination(path: string, params: GetAllWithPaginationParams): Observable<GetAllResponse<T>> {
        if (!path) {
            console.error('No path : impossible to get paginated elements');
            return of(undefined);
        }
        if (!params || !params.pageSize) {
            console.error('Incorrect parameters : impossible to get paginated elements. The parameter pageSize must be defined.');
            return of(undefined);
        }
        let httpParams = new HttpParams();
        if (params) {
            if (params.pageIndex !== undefined) {
                httpParams = httpParams.set(this.geneseEnvironment.pageIndex, params.pageIndex.toString());
            }
            if (params.pageSize !== undefined) {
                httpParams = httpParams.set(this.geneseEnvironment.pageSize, params.pageSize.toString());
            }
            if (params.filters) {
                for (const key of Object.keys(params.filters)) {
                    if (params.filters[key]) {
                        httpParams = httpParams.set(key, params.filters[key].toString());
                    }
                }
            }
        }
        const options = {params: httpParams};
        const url = this.apiRoot(path);
        return this.http.get(url, options).pipe(
            map((response: any) => {
                if (response && this.isPaginatedResponse(response)) {
                    return {
                        results: this.geneseMapperService.mapGetAllResults<T>(response[this.geneseEnvironment.results]),
                        totalResults: response[this.geneseEnvironment.totalResults]
                    };
                } else {
                    console.error('Response is not paginated. ' +
                        'Please verify that the response includes an array corresponding to your Genese pagination environment.');
                    return undefined;
                }
            })
        );
    }


    /**
     * Get one element of the T class (or the U class if the uConstructor param is defined)
     */
    getOne(id?: string): Observable<T> {
        this.checkId(id);
        const url = this.apiRoot(this.getStandardPath(), id);
        return this.http.get(url)
            .pipe(
                map((data: any) => {
                    // console.log('%c getOne', 'font-weight: bold; color: red;', data);
                    return this.geneseMapperService.mapToObject<T>(data);
                })
            );
    }


    /**
     * Get one element of the T class (or the U class if the uConstructor param is defined)
     */
    getOneCustom(path: string, params?: GetOneParams): Observable<T> {
        this.checkPath(path);
        let httpParams = new HttpParams();
        if (params) {
            if (params.filters) {
                for (const key of Object.keys(params.filters)) {
                    if (params.filters[key]) {
                        httpParams = httpParams.set(key, params.filters[key].toString());
                    }
                }
            }
        }
        const options = {params: httpParams};
        const url = this.apiRoot(path);
        return this.http.get(url, options)
            .pipe(
                map((data: any) => {
                    return this.geneseMapperService.mapToObject<T>(data);
                })
            );
    }

    /**
     * Get one element of the T class (or the U class if the uConstructor param is defined)
     */
    request(path: string, method: RequestMethod, options?: RequestOptions): Observable<T | any> {
        this.checkPath(path);
        if (!method) {
            throw Error('Incorrect Genese method : impossible to send request');
        }
        options = Tools.default(options, {});
        if (!options.headers
            && (method === RequestMethod.POST || method === RequestMethod.PUT || method === RequestMethod.PATCH)) {
            options.headers = {'Content-Type': 'application/json'};
        }
        if (!options.observe && method === RequestMethod.DELETE) {
            options.observe = 'response';
        }
        const url = this.apiRoot(path, options.id);
        return this.http.request(method, url, options)
            .pipe(
                map((result: any) => {
                    if (method === RequestMethod.DELETE) {
                        if (options && options.mapData === false) {
                            return result;
                        } else {
                            return this.geneseMapperService.mapToObject<T>(result ? result.body : undefined);
                        }
                    } else {
                        if (options && options.mapData === false) {
                            return result;
                        } else {
                            return this.geneseMapperService.mapToObject(result);
                        }
                    }
                })
            );
    }

    /**
     * Update an element with T type
     */
    update(path: string, id?: string, body?: object, options?: RequestOptions): Observable<T | any> {
        if (!id && !path) {
            console.error('Error updating element: undefined id or incorrect path');
            return of(undefined);
        }
        body = Tools.default(body, {});
        options = Tools.default(options, {});
        options.headers = Tools.default(options.headers, {'Content-Type': 'application/json'});
        const requestOptions: any = Object.assign(options, {observe: 'body'});
        const url = this.apiRoot(path, id);
        return this.http.put( url, body, requestOptions)
            .pipe(
                map(result => {
                    if (options && options.mapData === false) {
                        return result;
                    } else {
                        return this.geneseMapperService.mapToObject(result);
                    }
                })
            );
    }

    // --------------------------------------------------
    //                   OTHER METHODS
    // --------------------------------------------------

    /**
     * Get the root path of the api
     */
    apiRoot(path?: string, id?: string): string {
        const url = path ? this.geneseEnvironment.api + path : this.geneseEnvironment.api;
        return id ? `${url}/${id}` : url;
    }


    checkId(id: string): void {
        if (!id || !(+id > 0)) {
            throw Error('Incorrect Genese id.');
        }
    }


    checkPath(path: string): void {
        if (!path || typeof path !== 'string') {
            throw Error('Incorrect Genese path.');
        }
    }

    /**
     * Check if the response is paginated
     */
    private isPaginatedResponse(data: any): boolean {
        return data && Array.isArray(data[this.geneseEnvironment.results]);
    }


    private getStandardPath(): string {
        const model = new this.geneseMapperService.tConstructor();
        if (!model['genese'] || !model['genese'].path) {
            throw Error('No Genese path environment for the model  : impossible to get element.');
        } else {
            return model['genese'].path;
        }
    }

    /**
     * Translate data for a given language
     */
    translate(data: any, language: string): any {
        if (!language) {
            console.error('No data or no language : impossible to get element');
            return undefined;
        } else {
            return this.geneseMapperService.translate(data, language);
        }
    }

}
