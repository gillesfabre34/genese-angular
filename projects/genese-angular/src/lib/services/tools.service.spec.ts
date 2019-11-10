import { Tools } from './tools.service';

describe('Tools', () => {

    describe('isPrimitive', () => {

        it('true', () => {
            expect(Tools.isPrimitive(true) === true).toBeTruthy();
        });

        it('false', () => {
            expect(Tools.isPrimitive(false) === true).toBeTruthy();
        });

        it('string', () => {
            expect(Tools.isPrimitive('string') === true).toBeTruthy();
        });

        it('number', () => {
            expect(Tools.isPrimitive(3) === true).toBeTruthy();
        });

        it('object', () => {
            expect(Tools.isPrimitive({}) === false).toBeTruthy();
        });

        it('null', () => {
            expect(Tools.isPrimitive(null) === false).toBeTruthy();
        });
    });
});
