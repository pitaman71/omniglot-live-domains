import * as Currency from './Currency';
import * as Financial from './Financial';

describe('Tender', () => {
    const asString = Financial.TenderDomain.asString();
    it('should parse an amount without currency type', ()=> {
        if(asString === undefined) throw new Error('Financial.TenderDomain did not implement asString');
        let a = asString.from('123');
        expect(a).toBeTruthy();
        expect(a?.amount).toEqual(123);
        a = asString.from('123.456');
        expect(a).toBeTruthy();
        expect(a?.amount).toEqual(123.456);
        a = asString.from('USD 123.456');
        expect(a).toBeTruthy();
        expect(a?.amount).toEqual(123.456);
        expect(a?.currency).toEqual('USD');
        a = asString.from('123.45 - 67.89');
        expect(a).toBeTruthy();
        expect(a?.amount).toEqual(123.45);
        a = asString.from('CAD 123.45 -  67.89');
        expect(a).toBeTruthy();
        expect(a?.amount).toEqual(123.45);
        expect(a?.currency).toEqual('CAD');
        a = asString.from('123.45');
        expect(a).toBeTruthy();
        a = asString.from('EUR123.45-');
        expect(a).toBeTruthy();
        expect(a?.currency).toEqual('EUR');
        a = asString.from('-123.45');
        expect(a).toBeTruthy();
        a = asString.from('');
        expect(a).toBeNull();
        let b = Financial.TenderDomain.asJSON().from({ "currency": "USD", "amount": 1850, "text": "USD 1850"});
        expect(b).toBeTruthy();
        expect(b?.currency).toEqual('USD');
    });
})

describe('PayRate', () => {
    const asString = Financial.PayRangeDomain.asString();
    it('should parse a range without currency type', ()=> {
        if(asString === undefined) throw new Error('Financial.PayRangeDomain did not implement asString');
        let a = asString.from('123');
        expect(a).toBeTruthy();
        expect(a?.minimum).toEqual(123);
        expect(a?.maximum).toEqual(123);
        a = asString.from('123.456');
        expect(a).toBeTruthy();
        expect(a?.minimum).toEqual(123.456);
        expect(a?.maximum).toEqual(123.456);
        a = asString.from('USD 123.456');
        expect(a).toBeTruthy();
        expect(a?.minimum).toEqual(123.456);
        expect(a?.maximum).toEqual(123.456);
        expect(a?.currency).toEqual('USD');
        a = asString.from('123.45 - 67.89');
        expect(a).toBeTruthy();
        expect(a?.minimum).toEqual(123.45);
        expect(a?.maximum).toEqual(67.89);
        a = asString.from('CAD 123.45 -  67.89');
        expect(a).toBeTruthy();
        expect(a?.minimum).toEqual(123.45);
        expect(a?.maximum).toEqual(67.89);
        expect(a?.currency).toEqual('CAD');
        a = asString.from('123.45');
        expect(a).toBeTruthy();
        a = asString.from('EUR123.45-');
        expect(a).toBeTruthy();
        expect(a?.currency).toEqual('EUR');
        a = asString.from('-123.45');
        expect(a).toBeTruthy();
        a = asString.from('');
        expect(a).toBeNull();
        let b = Financial.PayRangeDomain.asJSON().from({ "basis": { "standard": "hr" }, "currency": "USD", "minimum": 1850, "maximum": 1850, "text": "USD 1850 - 1850 hr"});
        expect(b).toBeTruthy();
        expect(b?.currency).toEqual('USD');
        expect(b?.basis).toBeTruthy();
        expect(b?.basis?.standard).toEqual('hr');
    });
})
