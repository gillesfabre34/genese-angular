import { Tools } from './tools.service';

describe('TOOLS', () => {

    describe('isPrimitive', () => {

        it('true => true', () => {
            expect(Tools.isPrimitive(true) === true).toBeTruthy();
        });

        it('false => true', () => {
            expect(Tools.isPrimitive(false) === true).toBeTruthy();
        });

        it('string => true', () => {
            expect(Tools.isPrimitive('string') === true).toBeTruthy();
        });

        it('number => true', () => {
            expect(Tools.isPrimitive(3) === true).toBeTruthy();
        });

        it('object => false', () => {
            expect(Tools.isPrimitive({}) === false).toBeTruthy();
        });

        it('null => false', () => {
            expect(Tools.isPrimitive(null) === false).toBeTruthy();
        });
    });

    describe('isSameObject', () => {

        it('{a: "z"}, {a: "z"} => true', () => {
            expect(Tools.isSameObject({a: 'z'}, {a: 'z'}) === true).toBeTruthy();
        });

        it('{a: ""}, {a: "z"} => true', () => {
            expect(Tools.isSameObject({a: ''}, {a: 'z'}) === false).toBeTruthy();
        });
    });
});
