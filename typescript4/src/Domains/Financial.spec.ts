import * as Currency from './Currency';
import * as Financial from './Financial';

describe('Tender', () => {
    it('should parse an amount without currency type', ()=> {
        let a = Financial.TenderDomain.asString().from('123');
        expect(a).toBeTruthy();
        expect(a?.amount).toEqual(123);
        a = Financial.TenderDomain.asString().from('123.456');
        expect(a).toBeTruthy();
        expect(a?.amount).toEqual(123.456);
        a = Financial.TenderDomain.asString().from('USD 123.456');
        expect(a).toBeTruthy();
        expect(a?.amount).toEqual(123.456);
        expect(a?.currency).toEqual('USD');
        a = Financial.TenderDomain.asString().from('123.45 - 67.89');
        expect(a).toBeTruthy();
        expect(a?.amount).toEqual(123.45);
        a = Financial.TenderDomain.asString().from('CAD 123.45 -  67.89');
        expect(a).toBeTruthy();
        expect(a?.amount).toEqual(123.45);
        expect(a?.currency).toEqual('CAD');
        a = Financial.TenderDomain.asString().from('123.45');
        expect(a).toBeTruthy();
        a = Financial.TenderDomain.asString().from('EUR123.45-');
        expect(a).toBeTruthy();
        expect(a?.currency).toEqual('EUR');
        a = Financial.TenderDomain.asString().from('-123.45');
        expect(a).toBeTruthy();
        a = Financial.TenderDomain.asString().from('');
        expect(a).toBeNull();
        let b = Financial.TenderDomain.asJSON().from({ "currency": "USD", "amount": 1850, "text": "USD 1850"});
        expect(b).toBeTruthy();
        expect(b?.currency).toEqual('USD');
    });
})

describe('PayRate', () => {
    it('should parse a range without currency type', ()=> {
        let a = Financial.PayRangeDomain.asString().from('123');
        expect(a).toBeTruthy();
        expect(a?.minimum).toEqual(123);
        expect(a?.maximum).toEqual(123);
        a = Financial.PayRangeDomain.asString().from('123.456');
        expect(a).toBeTruthy();
        expect(a?.minimum).toEqual(123.456);
        expect(a?.maximum).toEqual(123.456);
        a = Financial.PayRangeDomain.asString().from('USD 123.456');
        expect(a).toBeTruthy();
        expect(a?.minimum).toEqual(123.456);
        expect(a?.maximum).toEqual(123.456);
        expect(a?.currency).toEqual('USD');
        a = Financial.PayRangeDomain.asString().from('123.45 - 67.89');
        expect(a).toBeTruthy();
        expect(a?.minimum).toEqual(123.45);
        expect(a?.maximum).toEqual(67.89);
        a = Financial.PayRangeDomain.asString().from('CAD 123.45 -  67.89');
        expect(a).toBeTruthy();
        expect(a?.minimum).toEqual(123.45);
        expect(a?.maximum).toEqual(67.89);
        expect(a?.currency).toEqual('CAD');
        a = Financial.PayRangeDomain.asString().from('123.45');
        expect(a).toBeTruthy();
        a = Financial.PayRangeDomain.asString().from('EUR123.45-');
        expect(a).toBeTruthy();
        expect(a?.currency).toEqual('EUR');
        a = Financial.PayRangeDomain.asString().from('-123.45');
        expect(a).toBeTruthy();
        a = Financial.PayRangeDomain.asString().from('');
        expect(a).toBeNull();
        let b = Financial.PayRangeDomain.asJSON().from({ "basis": { "standard": "hr" }, "currency": "USD", "minimum": 1850, "maximum": 1850, "text": "USD 1850 - 1850 hr"});
        expect(b).toBeTruthy();
        expect(b?.currency).toEqual('USD');
        expect(b?.basis).toBeTruthy();
        expect(b?.basis?.standard).toEqual('hr');
    });
})
