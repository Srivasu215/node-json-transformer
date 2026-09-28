import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getObjectOrArrayFromStringKey, isNonEmptyArray, isNumber } from '../src/v1/utils/utilities.js';

describe('test getObjectOrArrayFromStringKey', () => {

    it('get object by path from nested object', () => {
        let obj = {
            a: {
                b: 123
            }
        };
        assert.equal(getObjectOrArrayFromStringKey("a.b", obj), 123);
    });

    it('get object by path when path is empty', () => {
        let obj = {
            a: {
                b: 123
            }
        };
        assert.deepEqual(getObjectOrArrayFromStringKey("", obj), obj);
    });

    it('get object when path is invalid', () => {
        let obj = {
            a: {
                b: 123
            }
        };
        assert.equal(getObjectOrArrayFromStringKey("a.b.c.d", obj), undefined);
    });

    it('get array by path from nested object', () => {
        let obj = {
            a: {
                b: [{
                    x: 123
                }]
            }
        };
        assert.deepEqual(getObjectOrArrayFromStringKey("a.b.x", obj), [123]);
    });
});

describe('test isNonEmptyArray', () => {

    it('check is array empty - empty array', () => {
        assert.equal(isNonEmptyArray([]), false);
    });

    it('check is array empty - non empty array', () => {
        assert.equal(isNonEmptyArray([1]), true);
    });
});

describe('test isNumber', () => {

    it('check is number - number passed', () => {
        assert.equal(isNumber(1), true);
    });

    it('check is number - string passed', () => {
        assert.equal(isNumber("abc"), false);
    });
});
