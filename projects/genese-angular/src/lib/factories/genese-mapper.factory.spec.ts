import { GeneseMapperFactory } from './genese-mapper.factory';
import { Tools } from '../services/tools.service';

describe('GENESE MAPPER FACTORY', () => {
    const gmp = new GeneseMapperFactory(Object);

    // **************************************************************************
    // _diveMap
    // **************************************************************************

    describe('_diveMap', () => {

        describe('primitives', () => {

            it('target true, source true => true', () => {
                expect(gmp._diveMap(true, true) === true).toBeTruthy();
            });

            it('target true, source false => false', () => {
                expect(gmp._diveMap(true, false) === false).toBeTruthy();
            });

            it('target string1, source 1 => "1"', () => {
                expect(gmp._diveMap('string1', 1) === '1').toBeTruthy();
            });

            it('target true, source null => null', () => {
                expect(gmp._diveMap(true, null) === null).toBeTruthy();
            });

            it('target string1, source {a: 1} => string1', () => {
                expect(gmp._diveMap('string1', {a: 1}) === 'string1').toBeTruthy();
            });
        });

        // **************************************************************************

        describe('not primitives', () => {

            it('target {a: 1}, source null => null', () => {
                expect(gmp._diveMap({a: 1}, null) === null).toBeTruthy();
            });

            it('target {a: 1}, source undefined => {a: 1}', () => {
                expect(Tools.isSameObject(gmp._diveMap({a: 1}, undefined), {a: 1})).toBeTruthy();
            });

            it('target {a: 1}, source {a: 1} => {a: 1}', () => {
                expect(Tools.isSameObject(gmp._diveMap({a: 1}, {a: 1}), {a: 1})).toBeTruthy();
            });

            it('target {a: 1}, source {} => {a: 1}', () => {
                expect(Tools.isSameObject(gmp._diveMap({a: 1}, {}), {a: 1})).toBeTruthy();
            });

            it('target {a: 1}, source {a: 2} => {a: 2}', () => {
                expect(Tools.isSameObject(gmp._diveMap({a: 1}, {a: 2}), {a: 2})).toBeTruthy();
            });

            it('target {a: 1}, source {a: null} => {a: null}', () => {
                expect(Tools.isSameObject(gmp._diveMap({a: 1}, {a: null}), {a: null})).toBeTruthy();
            });
        });
    });

    // **************************************************************************
    // _castStringAndNumbers
    // **************************************************************************

    describe('_castStringAndNumbers', () => {

        it('undefined, {a: 1} => undefined', () => {
            expect(gmp._castStringAndNumbers(undefined, {a: 1}) === undefined).toBeTruthy();
        });

        it('{a: 1}, undefined => undefined', () => {
            expect(gmp._castStringAndNumbers({a: 1}, undefined) === undefined).toBeTruthy();
        });

        it('{a: 1}, null => null', () => {
            expect(gmp._castStringAndNumbers({a: 1}, null) === null).toBeTruthy();
        });

        it('string1, string1 => string1', () => {
            expect(gmp._castStringAndNumbers('string1', 'string1') === 'string1').toBeTruthy();
        });

        it('1, 1 => 1', () => {
            expect(gmp._castStringAndNumbers(1, 1) === 1).toBeTruthy();
        });

        it('string1, string2 => string2', () => {
            expect(gmp._castStringAndNumbers('string1', 'string2') === 'string2').toBeTruthy();
        });

        it('string1, 1 => "1"', () => {
            expect(gmp._castStringAndNumbers('string1', 1) === '1').toBeTruthy();
        });

        it('2, "1" => 1', () => {
            expect(gmp._castStringAndNumbers(2, '1') === 1).toBeTruthy();
        });

        it('{a: 1}, {a: 2} => undefined', () => {
            expect(gmp._castStringAndNumbers({a: 1}, {a: 2}) === undefined).toBeTruthy();
        });

        // it('zzz, {a: 1} => {a: 1}', () => {
        //     expect(Tools.isSameObject(gmp._castStringAndNumbers('zzz', {a: 1}), {a: 1})).toBeTruthy();
        // });
    });

    // **************************************************************************
    // _mapNotPrimitive
    // **************************************************************************

    describe('_mapNotPrimitive', () => {

        it('{a: 1}, undefined => undefined', () => {
            expect(Tools.isSameObject(gmp._mapNotPrimitive({a: 1}, undefined), {a: 1})).toBeTruthy();
        });

        it('{a: 1}, null => null', () => {
            expect(gmp._mapNotPrimitive({a: 1}, null) === null).toBeTruthy();
        });

        it('{a: 1}, {a: null} => {a: null}', () => {
            expect(Tools.isSameObject(gmp._mapNotPrimitive({a: 1}, {a: null}), {a: null})).toBeTruthy();
        });

        it('{a: 1}, {a: 1} => {a: 1}', () => {
            expect(Tools.isSameObject(gmp._mapNotPrimitive({a: 1}, {a: 1}), {a: 1})).toBeTruthy();
        });

        it('{a: 1}, {} => {a: 1}', () => {
            expect(Tools.isSameObject(gmp._mapNotPrimitive({a: 1}, {}), {a: 1})).toBeTruthy();
        });

        it('{a: 1}, {a: 2} => {a: 2}', () => {
            expect(Tools.isSameObject(gmp._mapNotPrimitive({a: 1}, {a: 2}), {a: 2})).toBeTruthy();
        });

        it('{a: {b: 1}}, {a: {b: 2}} => {a: {b: 2}}', () => {
            expect(Tools.isSameObject(gmp._mapNotPrimitive({a: {b: 1}}, {a: {b: 2}}), {a: {b: 2}})).toBeTruthy();
        });

        it('{a: [1]}, {a: {b: 2}} => {a: [1]}', () => {
            expect(Tools.isSameObject(gmp._mapNotPrimitive({a: [1]}, {a: {b: 2}}), {a: [1]})).toBeTruthy();
        });

    });

    // **************************************************************************
    // _areStringOrNumber
    // **************************************************************************

    describe('_areStringOrNumber', () => {

        it('1, undefined => false', () => {
            expect(gmp._areStringOrNumber(1, undefined) === false).toBeTruthy();
        });

        it('undefined, 1 => false', () => {
            expect(gmp._areStringOrNumber(undefined, 1) === false).toBeTruthy();
        });

        it('2, 1 => true', () => {
            expect(gmp._areStringOrNumber(2, 1) === true).toBeTruthy();
        });

        it('2, "1" => true', () => {
            expect(gmp._areStringOrNumber(2, '1') === true).toBeTruthy();
        });

        it('"2", 1 => true', () => {
            expect(gmp._areStringOrNumber('2', 1) === true).toBeTruthy();
        });

        it('"2", "1" => true', () => {
            expect(gmp._areStringOrNumber('2', '1') === true).toBeTruthy();
        });
    });
});
