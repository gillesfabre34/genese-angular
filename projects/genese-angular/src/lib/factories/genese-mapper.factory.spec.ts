import { GeneseMapperFactory } from './genese-mapper.factory';
import { Tools } from '../services/tools.service';

describe('GENESE MAPPER FACTORY', () => {
    const gmp = new GeneseMapperFactory(Object);


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

        it('{a: 1}, null => undefined', () => {
            expect(gmp._castStringAndNumbers({a: 1}, null) === undefined).toBeTruthy();
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

        it('{a: 1}, {a: 1} => {a: 1}', () => {
            expect(gmp._castStringAndNumbers({a: 1}, {a: 1}) === undefined).toBeTruthy();
        });

        it('{a: 1}, {a: 2} => true', () => {
            expect(gmp._castStringAndNumbers({a: 1}, {a: 2}) === undefined).toBeTruthy();
        });
    });

    // **************************************************************************
    // _diveMap
    // **************************************************************************

    describe('_diveMap', () => {

        describe('primitives', () => {

            it('true, true => true', () => {
                expect(gmp._diveMap(true, true) === true).toBeTruthy();
            });

            it('true, false => false', () => {
                expect(gmp._diveMap(true, false) === false).toBeTruthy();
            });

            it('string1, 1 => "1"', () => {
                expect(gmp._diveMap('string1', 1) === '1').toBeTruthy();
            });

            it('true, null => null', () => {
                expect(gmp._diveMap(true, null) === null).toBeTruthy();
            });

            it('string1, {a: 1} => string1', () => {
                expect(gmp._diveMap('string1', {a: 1}) === 'string1').toBeTruthy();
            });
        });

        // **************************************************************************

        describe('not primitives', () => {

            it('{a: 1}, null => null', () => {
                expect(gmp._diveMap({a: 1}, null) === null).toBeTruthy();
            });

            it('{a: 1}, undefined => {a: 1}', () => {
                expect(Tools.isSameObject(gmp._diveMap({a: 1}, undefined), {a: 1})).toBeTruthy();
            });

            it('{a: 1}, {a: 1} => {a: 1}', () => {
                expect(Tools.isSameObject(gmp._diveMap({a: 1}, {a: 1}), {a: 1})).toBeTruthy();
            });

            it('{a: ""}, {a: "1"} => {a: "1"}', async () => {
                expect(Tools.isSameObject(gmp._diveMap({a: ''}, {a: '1'}), {a: '1'})).toBeTruthy();
            });

            it('{a: 1}, {} => {a: 1}', () => {
                expect(Tools.isSameObject(gmp._diveMap({a: 1}, {}), {a: 1})).toBeTruthy();
            });

            it('{a: 1}, {a: 2} => {a: 2}', () => {
                expect(Tools.isSameObject(gmp._diveMap({a: 1}, {a: 2}), {a: 2})).toBeTruthy();
            });

            it('{a: 1}, {a: null} => {a: null}', () => {
                expect(Tools.isSameObject(gmp._diveMap({a: 1}, {a: null}), {a: null})).toBeTruthy();
            });

            it('{country: ""}, {country: "Allemagne"} => {country: "Allemagne"}', () => {
                expect(Tools.isSameObject(gmp._diveMap({country: ''}, {country: 'Allemagne'}), {country: 'Allemagne'})).toBeTruthy();
            });
        });
    });


    // **************************************************************************
    // _mapArrayOfObjects
    // **************************************************************************


    describe('_mapArrayOfObjects', () => {

        it('[{a: 1}], undefined => undefined', () => {
            expect(gmp._mapArrayOfObjects([{a: 1}], undefined) === undefined).toBeTruthy();
        });

        it('undefined, [{a: 1}] => undefined', () => {
            expect(gmp._mapArrayOfObjects(undefined, [{a: 1}]) === undefined).toBeTruthy();
        });

        it('[], [{a: 1}] => undefined', () => {
            expect(gmp._mapArrayOfObjects([], [{a: 1}]) === undefined).toBeTruthy();
        });

        it('[{a: 1}], [{a: 1}] => [{a: 1}]', () => {
            expect(Tools.isSameObject(gmp._mapArrayOfObjects([{a: 1}], [{a: 1}]), [{a: 1}])).toBeTruthy();
        });

        it('[{a: 1}], [{a: 1}] => [{a: 1}]', () => {
            expect(Tools.isSameObject(gmp._mapArrayOfObjects([{a: 1}], [{a: 1}]), [{a: 1}])).toBeTruthy();
        });
    });


    // **************************************************************************
    // _mapIndexableType
    // **************************************************************************

    const countriesSource = {
        fr: {
            country: 'Allemagne'
        },
        en: {
            country: 'Germany'
        }
    };

    describe('_mapIndexableType', () => {

        it('undefined, {a: 1} => undefined', () => {
            expect(gmp._mapIndexableType(undefined, {a: 1}) === undefined).toBeTruthy();
        });

        it('{gnIndexableKey: {a: 1}}, undefined => {a: 1}', () => {
            expect(Tools.isSameObject(gmp._mapIndexableType({gnIndexableKey: {a: 1}}, undefined), {a: 1})).toBeTruthy();
        });

        it('{gnIndexableKey: {a: 1}}, null => null', () => {
            expect(gmp._mapIndexableType({gnIndexableKey: {a: 1}}, null) === null).toBeTruthy();
        });

        it('{gnIndexableKey: {country: ""}}, countriesSource => {fr: {country: "Allemagne"}}', () => {
            expect(Tools.isSameObject(gmp._mapIndexableType({gnIndexableKey: {country: ''}}, countriesSource), countriesSource))
                .toBeTruthy();
        });

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

});
