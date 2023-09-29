import * as Financial from './Financial';

describe('constructors', () => {
    it('should create a Tender', ()=> {
        const a = Financial.Tender.asString().from('10023 USD');
        expect(a).not.toBeNull();
    });
})

describe('Duration operators', () => {
    // it('add computes the right result', () => {
    //     expect(Financial.Tender.cmp(Financial.Tender.add(Financial.Tender.fromAmount(31330, 'USD'), Financial.Tender.fromAmount(12510, 'USD')), Financial.Tender.fromAmount(43840, 'USD'))).toEqual(0);
    // });
    // it('sub computes the right result', () => {
    //     expect(Financial.Tender.cmp(Financial.Tender.sub(Financial.Tender.fromAmount(43840, 'USD'), Financial.Tender.fromAmount(12510, 'USD')), Financial.Tender.fromAmount(31330, 'USD'))).toEqual(0);
    // });
    // it('mul computes the right result', () => {
    //     expect(Financial.Tender.cmp(Financial.Tender.mul(Financial.Tender.fromAmount(12510, 'USD'), 2), Financial.Tender.fromAmount(25020, 'USD'))).toEqual(0);
    // });
    // it('div computes the right result', () => {
    //     expect(Financial.Tender.cmp(Financial.Tender.div(Financial.Tender.fromAmount(25020, 'USD'), 2), Financial.Tender.fromAmount(12510, 'USD'))).toEqual(0);
    // });

    it('cmp computes the right result', () => {
        expect(Financial.Tender.cmp(Financial.Tender.asString().from('12356 USD'), Financial.Tender.asString().from('52356 USD'))).toEqual(-1);
        expect(Financial.Tender.cmp(Financial.Tender.asString().from('61101 USD'), Financial.Tender.asString().from('61099 USD'))).toEqual(1);
    });

})
