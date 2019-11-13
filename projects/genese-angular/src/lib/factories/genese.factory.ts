import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { GnRequestParams, GetAllResponse } from '../models/get-all.params.model';
import { TConstructor } from '../models/t-constructor.model';
import { GeneseMapperFactory } from './genese-mapper.factory';
import { Tools } from '../services/tools.service';
import { Language } from '../enums/language';
import { GeneseEnvironmentService } from '../services/genese-environment.service';
import { ResponseStatus } from '../enums/response-status';
import { RequestMethod } from '../enums/request-method';
import { RequestOptions } from '../models/request-options.model';

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
    //                     METHODS
    // --------------------------------------------------


    /**
     * Get one element of the T class (or the U class if the uConstructor param is defined)
     */
    getOne(path: string, id?: string): Observable<T> {
        if (!path) {
            console.error('No path : impossible to get element');
            return of(undefined);
        }
        const url = this.apiRoot(path, id);
        return this.http.get(url, {})
            .pipe(
                map((data: any) => {
                    return this.geneseMapperService.mapToObject<T>(data);
                })
            );
    }

    /**
     * Get one element of the T class (or the U class if the uConstructor param is defined)
     */
    getOneExtract<U>(path: string, id: string, uConstructor: TConstructor<U>): Observable<U> {
        if (!id || !uConstructor) {
            console.error('No id or no uConstructor : impossible to get element');
            return of(undefined);
        }
        let httpParams = new HttpParams();
        httpParams = httpParams.set('gnExtract', JSON.stringify(new uConstructor()));
        const options = {params: httpParams};
        return this.http.get(this.apiRoot(path, id), options)
            .pipe(
                map((data: any) => {
                    return this.geneseMapperService.mapToObject<U>(data, uConstructor) as U;
                })
            );
    }

    /**
     * Get all elements
     * If the http response format have this format, it returns paginated response with this format :
     * {
     *      totalResults?: number;
     *      results: any;
     * }
     *
     * If not, it returns T[] object
     */
    getAll<U = T>(path: string, params?: GnRequestParams): Observable<GetAllResponse<U> | U[]> {
        let httpParams = new HttpParams();
        if (!path) {
            console.error('No path : impossible to get elements');
            return of(undefined);
        }
        if (params) {
            if (params.page !== undefined) {
                httpParams = httpParams.set(this.geneseEnvironment.gnPage, params.page.toString());
            }
            if (params.limit !== undefined) {
                httpParams = httpParams.set(this.geneseEnvironment.gnLimit, params.limit.toString());
            }
            if (params.extract !== undefined) {
                httpParams = httpParams.set(this.geneseEnvironment.gnExtract, params.extract.toString());
            }
            if (params.filters) {
                for (const key of Object.keys(params.filters)) {
                    if (params.filters[key]) {
                        httpParams = httpParams.set(key, params.filters[key].toString());
                    }
                }
            }
        } else {
            params = {};
        }
        const options = {params: httpParams};
        const url = this.apiRoot(path);
        return this.http.get(url, options).pipe(
            map((response: any) => {
                if (response) {
                    if (this._responseWithPagination(response)) {
                        return {
                            results: this.geneseMapperService.mapGetAllResults<U>(response.results),
                            totalResults: response.totalResults};
                    } else {
                        return this.geneseMapperService.mapGetAllResults<U>(response);
                    }
                } else {
                    return [];
                }
            })
        );
    }

    /**
     * Create an object and return an Observable of the created object with T type
     */
    create(path: string, body?: object, options?: RequestOptions): Observable<T> {
        body = Tools.default(body, {});
        options = Tools.default(options, {});
        options.headers = Tools.default(options.headers, {'Content-Type': 'application/json'});
        const requestOptions: any = Object.assign(options, {observe: 'body'});
        const url = this.apiRoot(path);
        return this.http.post(url, body, requestOptions)
            .pipe(
                map((result) => {
                    return this.geneseMapperService.mapToObject(result);
                })
            );
    }

    /**
     * Update an element with T type
     */
    update(path: string, id?: string, body?: object, options?: RequestOptions): Observable<T> {
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
                    return this.geneseMapperService.mapToObject(result);
                })
            );
    }


    /**
     * Delete an element
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
     * Get the root path of the api
     */
    apiRoot(path?: string, id?: string): string {
        const url = path ? this.geneseEnvironment.api + path : this.geneseEnvironment.api;
        return id ? `${url}/${id}` : url;
    }



    private _responseWithPagination(data: any): boolean {
        return data && Array.isArray(data.results);
    }


    /**
     * Translate data for a given language
     */
    translate<U = T>(data: U, language: Language): U {
        if (!language) {
            console.error('No data or no language : impossible to get element');
            return undefined;
        } else {
            return this.geneseMapperService.translate<U>(data, language);
        }
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
     * Get one element of the T class (or the U class if the uConstructor param is defined)
     */
    request(path: string, method: RequestMethod, options?: RequestOptions): Observable<T> {
        if (!method || !path) {
            console.error('Incorrect parameters : impossible to send request');
            return of(undefined);
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
                map((data: any) => {
                    if (method === RequestMethod.DELETE) {
                        return this.geneseMapperService.mapToObject<T>(data ? data.body : undefined);

                    } else {
                        return this.geneseMapperService.mapToObject<T>(data);
                    }
                })
            );
    }

}
