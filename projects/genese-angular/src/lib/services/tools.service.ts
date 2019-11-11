import { Injectable } from '@angular/core';

// @dynamic
@Injectable()
export class Tools {

    // --------------------------------------------------
    //                     CONSTRUCTOR
    // --------------------------------------------------


    constructor() { }



    // --------------------------------------------------
    //                     METHODS
    // --------------------------------------------------


    /**
     * clone object with deep copy
     */
    static clone(model: any): any {
        if (model) {
            if (Array.isArray(model)) {
                const newArray = [];
                model.forEach(item => newArray.push(this.clone(item)));
                return newArray;
            } else if (typeof model === 'object') {
                const newObject = {};
                Object.keys(model).forEach(key => newObject[key] = this.clone(model[key]));
                return newObject;
            } else {
                return model;
            }
        } else {
            return model;
        }
    }


    /**
     * Check if an object is a primitive or not
     */
    static isPrimitive(target: any): boolean {
        return typeof target === 'string'
            || typeof target === 'number'
            || typeof target === 'boolean';
    }


    /**
     * Returns a value by default if value to check doesn't exists
     */
    static default(valueToCheck, valueByDefault): any {
        return valueToCheck ? valueToCheck : valueByDefault;
    }


    /**
     * Check if two objects have the same values for every key
     */
    static isSameObject(obj1: any, obj2: any): boolean {
        if (obj1 === obj2) {
            return true;
        }
        if (typeof obj1 === 'number' && obj1.toString() === obj2.toString()) {
            return true;
        }
        if (
            (obj1 === undefined || obj2 === undefined)
            || (Array.isArray(obj1) && !Array.isArray(obj2))
            || (!Array.isArray(obj1) && Array.isArray(obj2))
            || (Array.isArray(obj1) && Array.isArray(obj2) && obj1.length !== obj2.length)
        ) {
            return false;
        }
        if (Array.isArray(obj1) && Array.isArray(obj2)) {
            let index = 0;
            for (const element of obj1) {
                if (!this.isSameObject(element, obj2[index])) {
                    return false;
                }
                index++;
            }
            return true;
        } else {
            for (const key of Object.keys(obj1)) {
                if ((!obj2[key] && !!obj1[key]) || (!!obj2[key] && !obj1[key])) {
                    return false;
                }
                if (Array.isArray(obj1[key])) {
                    if (!this.isSameObject(obj1[key], obj2[key])) {
                        return false;
                    }
                } else {
                    if (typeof obj1[key] === 'object') {
                        if (!this.isSameObject(obj1[key], obj2[key])) {
                            return false;
                        }
                    } else {
                        if (obj1[key] && obj2[key] && obj1[key].toString() !== obj2[key].toString()) {
                            return false;
                        }
                    }
                }
            }

        }
        return true;
    }
}
