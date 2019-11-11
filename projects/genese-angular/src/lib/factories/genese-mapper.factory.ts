import { Tools } from '../services/tools.service';
import { TConstructor } from '../models/t-constructor.model';
import { ExtractService } from '../services/extract.service';
import { Language } from '../enums/language';
import { PRIMITIVES } from '../models/primitive.model';

export class GeneseMapperFactory<T> {

    // --------------------------------------------------
    //                     PROPERTIES
    // --------------------------------------------------

    readonly tConstructor: TConstructor<T>;

    // --------------------------------------------------
    //                     CONSTRUCTOR
    // --------------------------------------------------

    /**
     * The constructor takes a Class as parameter.
     * The tConstructor property is an object with the Type corresponding to this Class
     */
    constructor(tConstructor: TConstructor<T>) {
        this.tConstructor = tConstructor;
    }


    // --------------------------------------------------
    //                     METHODS
    // --------------------------------------------------

    /**
     * The core of the generic mapper
     * If uConstructor is undefined, U equals T and this methodName returns a mapped T object
     * If not, it returns a mapped U object
     * uConstructor is useful for extraction of given fields of a T class object
     */
    public mapToObject<U = T>(data: any, uConstructor?: TConstructor<U>): U {
        if (!data) {
            const target = uConstructor ? new uConstructor() : new this.tConstructor();
            return target as U;
        }
        const tObject = new this.tConstructor();
        if (uConstructor) {
            let uObject = new uConstructor();
            if (uConstructor.hasOwnProperty('gnRename')) {
                data = this._rename(uConstructor, data);
            }
            uObject = Object.assign(uObject, ExtractService.extractFieldsFromData(tObject, uObject));
            uObject = Object.assign(uObject, this._diveMap<U>(uObject, data));
            return uObject;
        } else {
            if (this.tConstructor.hasOwnProperty('gnRename')) {
                data = this._rename(this.tConstructor, data);
            }
            const target = new this.tConstructor();
            return Object.assign(target, this._diveMap<T>(target, data));
        }
    }

    /**
     * Returns array of mapped results
     */
    mapGetAllResults<U = T>(data: any[], uConstructor?: TConstructor<U>): U[] {
        const gConstructor = uConstructor ? uConstructor : this.tConstructor;
        const results: any[] = [];
        if (PRIMITIVES.includes(gConstructor.name)) {
            data.forEach(e => {
                const newElement = typeof e === gConstructor.name.toLowerCase() ? e : undefined;
                results.push(newElement);
            });
        } else {
            data.forEach(e => {
                results.push(uConstructor ? this.mapToObject<U>(e, uConstructor) : this.mapToObject<T>(e));
            });
        }
        return results;
    }


    /**
     * If a property of the U class have the decorator @GnRename, this methodName replaces the key of the gnRename http param
     * This methodName is useful when the backend renamed some DTO properties :
     * with @GnRename decorator, you can get values from backend without changing the property name of your T objects in every file
     */
    _rename<U>(uConstructor: TConstructor<U>, data: any): any {
        const constr: any = uConstructor;
        Object.keys(constr.gnRename).map(oldKey => {
            const newKey = constr.gnRename[oldKey];
            if (data[newKey]) {
                data[oldKey] = data[newKey];
                delete data[newKey];
            }
        });
        this._diveMap(undefined, 'zzz');
        return data;
    }


    /**
     * For a given object with U type (the target model), returns the source object mapped with the U model
     * If source === null, it returns null
     * CAUTION: param "target" can't be undefined
     */
    _diveMap<U>(target: U, source: any): any {
        if (source === undefined) {
            return target;
        } else if (source === null) {
            return source;
        } else {
            if (Tools.isPrimitive(target)) {
                if (Tools.isPrimitive(source)) {
                    if (this._areStringOrNumber(target, source)) {
                        return this._castStringAndNumbers(target, source);
                    } else {
                        return source === false ? false : target;
                    }
                } else {
                    return target;
                }
            } else {
                return this._mapNotPrimitive(target, source);
            }
        }
    }


    /**
     * For non-primitive objects, returns source object mapped with the type of the target (U)
     * If source === null, it returns null
     * CAUTION: param "target" can't be undefined
     */
    _mapNotPrimitive<U>(target: U, source: any): any {
        if (source === undefined) {
            return target;
        } else if (source === null) {
            return null;
        } else {
            let cloneTarget = Object.assign({}, target);
            for (const key of Object.keys(target)) {
                if (key === 'gnIndexableKey') {
                    cloneTarget = this._mapIndexableType(target[key], source);
                }
                if (target[key] !== undefined) {
                    if (source[key] === null) {
                        cloneTarget[key] = null;
                    } else if (source[key] === undefined) {
                        cloneTarget[key] = target[key];
                    } else {
                        if (Array.isArray(target[key])) {
                            cloneTarget[key] = Array.isArray(source[key])
                                ? this._mapArrayOfObjects(target[key], source[key])
                                : cloneTarget[key];
                        } else {
                            if (this._areStringOrNumber(target[key], source[key])) {
                                cloneTarget[key] = this._castStringAndNumbers(target[key], source[key]);
                            } else {
                                cloneTarget[key] = this._diveMap(target[key], source[key]);
                            }
                        }
                    }
                }
            }
            return cloneTarget;
        }
    }


    /**
     * When an object haves a field named 'gnIndexableKey', that means that this object haves a model like this :
     * public myProperty?: {
     *   [key: string]: {
     *       type: string
     *      }
     *   } = {
     *      gnIndexableKey: {
     *           type: ''
     *      }
     *  };
     * For each key of gnIndexableKey field, this method returns the corresponding mapped object with the target model
     * Caution: param target should be defined
     */
    _mapIndexableType(target: {[key: string]: any}, source: any): any {
        if (!target) {
            console.warn('Impossible to map indexable types with undefined target.');
            return undefined;
        }
        if (source === undefined) {
            return target;
        }
        if (source === null) {
            return null;
        }
        const mappedObject = {};
        for (const key of Object.keys(source)) {
            Object.assign(mappedObject, { [key]: this._diveMap(target, source[key])});
        }
        return mappedObject;
    }


    /**
     * Check if two objects are both string or number.
     * In this case, returns true.
     */
    _areStringOrNumber(target: any, source: any): boolean {
        return ((typeof target === 'string' || typeof target === 'number') && (typeof source === 'number' || typeof source === 'string'));
    }


    /**
     * If source and target are both string or number, we cast source into the target's type and returns it.
     * This methodName adds a tolerance for http requests which returns numbers instead of strings and inversely
     * Caution : params target and source should not be falsy values
     */
    _castStringAndNumbers(target: any, source: any): any {
        if ((typeof target !== 'string' && typeof target !== 'number') || source === undefined) {
            console.warn('Genese _castStringAndNumbers : source or target undefined');
            return undefined;
        } else if (source === null) {
            return null;
        } else if (typeof target === 'string' && (typeof source === 'number' || typeof source === 'string')) {
            return  source.toString();
        } else if (typeof target === 'number' && (typeof source === 'number' || typeof source === 'string')) {
            return +source;
        // } else if (Tools.isSameObject(target, source)) {
        //     return source;
        } else {
            console.warn('Genese _castStringAndNumbers : impossible to cast this elements');
            return undefined;
        }
    }


    /**
     * Mapper to array of objects by calling _diveMap for each object of the array
     */
    _mapArrayOfObjects(target: {[key: string]: any}[], source: {[key: string]: any}[]): {[key: string]: any}[] {
        if (!Array.isArray(target) || target.length === 0 || !Array.isArray(source)) {
            console.warn('Impossible to map array of objects with undefined or empty array');
            return undefined;
        }
        const arrayOfObjects: any[] = [];
        const model = Tools.clone(target[0]);
        for (const element of source) {
            arrayOfObjects.push(this._diveMap(model, element));
        }
        return arrayOfObjects;
    }


    /**
     * If data object with type U have keys 'gnTranslate', this methodName returns the same object removing gnTranslate key
     * and preserving only the gnTranslate[language] objects
     * Example :
     * if data is like
     * {
     *     gnTranslate: {
     *         fr: {
     *             country: 'Allemagne'
     *         },
     *         en: {
     *             country: 'Germany'
     *         }
     *     }
     * }
     * and if language is 'fr', his methodName will return
     * {
     *     country: 'Allemagne'
     * }
     */
    public translate<U = T>(data: U, language: Language): U {
        if (!language) {
            console.error('No data or no language : impossible to get element');
            return undefined;
        } else {
            const result = Tools.clone(data);
            Object.keys(result).map(key => {
                if (key === 'gnTranslate') {
                    Object.assign(result, result.gnTranslate[language]);
                    delete result.gnTranslate;
                } else {
                    if (typeof result[key] === 'object') {
                        const clone = Tools.clone(result[key]);
                        result[key] = this.translate(clone, language);
                    }
                }
            });
            return result;
        }
    }
}
