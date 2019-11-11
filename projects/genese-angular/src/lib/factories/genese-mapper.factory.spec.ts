import { GeneseMapperFactory } from './genese-mapper.factory';
import { Tools } from '../services/tools.service';

describe('GeneseMapperFactory', () => {
    const gmp = new GeneseMapperFactory(Object);

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
                const result = gmp._diveMap(true, null);
                expect(result === null).toBeTruthy();
            });

            it('target string1, source {a: 1} => string1', () => {
                expect(gmp._diveMap('string1', {a: 1}) === 'string1').toBeTruthy();
            });
        });

        describe('not primitives', () => {

            it('target {a: 1}, source {a: 1} => {a: 1}', () => {
                expect(Tools.isSameObject(gmp._diveMap({a: 1}, {a: 1}), {a: 1})).toBeTruthy();
            });

            it('target {a: 1}, source {} => {a: 1}', () => {
                expect(Tools.isSameObject(gmp._diveMap({a: 1}, {}), {a: 1})).toBeTruthy();
            });

            it('target {a: 1}, source null => null', () => {
                expect(gmp._diveMap({a: 1}, null) === null).toBeTruthy();
            });

            it('target {a: 1}, source undefined => {a: 1}', () => {
                expect(Tools.isSameObject(gmp._diveMap({a: 1}, undefined), {a: 1})).toBeTruthy();
            });

            it('target {a: 1}, source {a: 2} => {a: 2}', () => {
                expect(Tools.isSameObject(gmp._diveMap({a: 1}, {a: 2}), {a: 2})).toBeTruthy();
            });

            it('target {a: 1}, source {a: null} => {a: null}', () => {
                expect(Tools.isSameObject(gmp._diveMap({a: 1}, {a: null}), {a: null})).toBeTruthy();
            });
        });
    });

    describe('_cast', () => {

        it('string1, string2 => string2', () => {
            expect(gmp._cast('string1', 'string2') === 'string2').toBeTruthy();
        });

        it('string1, 1 => "1"', () => {
            expect(gmp._cast('string1', 1) === '1').toBeTruthy();
        });

        it('2, "1" => 1', () => {
            expect(gmp._cast(2, '1') === 1).toBeTruthy();
        });

        it('{}, {a: 1} => {a: 1}', () => {
            expect(Tools.isSameObject(gmp._cast({}, {a: 1}), {a: 1})).toBeTruthy();
        });

        it('zzz, {a: 1} => {a: 1}', () => {
            expect(Tools.isSameObject(gmp._cast('zzz', {a: 1}), {a: 1})).toBeTruthy();
        });
    });

});
