import { GeneseMapperFactory } from './genese-mapper.factory';
import { Tools } from '../services/tools.service';

describe('GeneseMapperFactory', () => {
    const geneseMapperFactory = new GeneseMapperFactory(Object);
    describe('_diveMap', () => {

        it('target true, source true', () => {
            const result = geneseMapperFactory._diveMap(true, true);
            expect(Tools.isSameObject(result, true)).toBeTruthy();
        });

        it('target true, source false', () => {
            const result = geneseMapperFactory._diveMap(true, false);
            expect(Tools.isSameObject(result, false)).toBeTruthy();
        });

        it('target true, source null', () => {
            const result = geneseMapperFactory._diveMap(true, null);
            expect(result === null).toBeTruthy();
        });
    });
});
