import * as Financial from './Financial';

describe('PayRate', () => {
    it('should parse a range without currency type', ()=> {
        let a = Financial.PayRangeDomain.asString().from('$123');
        expect(a).not.toBeNull();
        expect(a.hourly.minimum).toEqual(123);
        expect(a.hourly.maximum).toEqual(123);
        a = Financial.PayRangeDomain.asString().from('$123.456');
        expect(a).not.toBeNull();
        expect(a.hourly.minimum).toEqual(123.456);
        expect(a.hourly.maximum).toEqual(123.456);
        a = Financial.PayRangeDomain.asString().from('$ 123.456');
        expect(a).not.toBeNull();
        expect(a.hourly.minimum).toEqual(123.456);
        expect(a.hourly.maximum).toEqual(123.456);
        a = Financial.PayRangeDomain.asString().from('$123.45 - 67.89');
        expect(a).not.toBeNull();
        expect(a.hourly.minimum).toEqual(123.45);
        expect(a.hourly.maximum).toEqual(67.89);
        a = Financial.PayRangeDomain.asString().from('$123.45 - $ 67.89');
        expect(a).not.toBeNull();
        expect(a.hourly.minimum).toEqual(123.45);
        expect(a.hourly.maximum).toEqual(67.89);
        a = Financial.PayRangeDomain.asString().from('123.45');
        expect(a).not.toBeNull();
        expect(a.error).not.toBeNull();
        a = Financial.PayRangeDomain.asString().from('$123.45-');
        expect(a).not.toBeNull();
        expect(a.error).not.toBeNull();
        a = Financial.PayRangeDomain.asString().from('-$123.45');
        expect(a).not.toBeNull();
        expect(a.error).not.toBeNull();
        a = Financial.PayRangeDomain.asString().from('');
        expect(a).not.toBeNull();
        expect(a.error).not.toBeNull();
    });
})
