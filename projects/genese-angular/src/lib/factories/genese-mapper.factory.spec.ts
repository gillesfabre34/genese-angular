import { GeneseMapperFactory } from './genese-mapper.factory';
import { Tools } from '../services/tools.service';

describe('GeneseMapperFactory', () => {
    const gmp = new GeneseMapperFactory(Object);

    describe('_diveMap', () => {

        it('target true, source true', () => {
            expect(gmp._diveMap(true, true) === true).toBeTruthy();
        });

        it('target true, source false', () => {
            expect(gmp._diveMap(true, false) === false).toBeTruthy();
        });

        it('target true, source null', () => {
            const result = gmp._diveMap(true, null);
            expect(result === null).toBeTruthy();
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
