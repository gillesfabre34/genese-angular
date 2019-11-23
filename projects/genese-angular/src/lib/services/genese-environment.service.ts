import { Injectable } from '@angular/core';
import { GeneseConfig } from '../models/genese-config.model';
import { Tools } from './tools.service';

@Injectable()
export class GeneseEnvironmentService {

    // --------------------------------------------------
    //                     CONSTRUCTOR
    // --------------------------------------------------

    public api: string;
    public extract: string;
    public pageIndex: string;
    public pageSize: string;
    public results: string;
    public totalResults: string;

    constructor() { }

    // --------------------------------------------------
    //                     METHODS
    // --------------------------------------------------

    /**
     * Configure Genese environment
     */
    setEnvironment(config: GeneseConfig) {
        if (config) {
            this.api = Tools.default(config.api, 'http://localhost:3000');
            this.extract = Tools.default(config.extract, 'gnExtract');
            if (config.pagination) {
                this.pageIndex = Tools.default(config.pagination.pageIndex, 'gnPageIndex');
                this.pageSize = Tools.default(config.pagination.pageSize, 'gnPageSize');
                this.results = Tools.default(config.pagination.results, 'gnPageResults');
                this.totalResults = Tools.default(config.pagination.totalResults, 'gnPageTotalResults');
            }
        }
    }
}
