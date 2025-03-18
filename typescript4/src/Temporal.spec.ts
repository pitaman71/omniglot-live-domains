import { JSONValue } from 'typescript-introspection';
import { DateDomain, DateTimeDomain, IntervalDomain, WhenDomain } from './Temporal';

function _cmp<DataType>(a: DataType|undefined|null, b:DataType|undefined|null, comparator?: (a: DataType, b: DataType) => -1 | 0 | 1 | undefined): -1 | 0 | 1 | undefined {
    if(a === undefined || b === undefined) {
        if(a === undefined && b !== undefined) return -1;
        if(a !== undefined && b === undefined) return +1;
        return 0;
    }
    if(a === null || b === null) {
        if(a === null && b !== null) return -1;
        if(a !== null && b === null) return +1;
        return 0;
    }

    if(comparator) return comparator(a,b);
    return (a < b) ? -1 : (a > b) ? +1 : 0;
}

describe('constructors', () => {
    it('should create a DateTime', ()=> {
        expect(DateTimeDomain.fromISOString('2015-06-061')).not.toBeNull();
    });
})

describe('DateTime operators', () => {
    it('cmp computes the right result', () => {
        expect(_cmp(DateTimeDomain.fromISOString('2015-06-01'), DateTimeDomain.fromISOString('2015-05-02'), (a,b) => DateTimeDomain.cmp(a,b))).toEqual(1);
        expect(_cmp(DateTimeDomain.fromISOString('2020-12-21'), DateTimeDomain.fromISOString('2020-12-22'), (a,b) => DateTimeDomain.cmp(a,b))).toEqual(-1);
        expect(_cmp(DateTimeDomain.fromISOString('3000-01-01'), DateTimeDomain.fromISOString('3000-01-01'), (a,b) => DateTimeDomain.cmp(a,b))).toEqual(0);
    });

})

describe('Interval operators', () => {
    it('cmp computes the right result', () => {
        expect(_cmp(
            IntervalDomain.from(DateTimeDomain.fromISOString('2015-06-09'), DateTimeDomain.fromISOString('2015-06-21')),
            IntervalDomain.from(DateTimeDomain.fromISOString('2015-07-09'), DateTimeDomain.fromISOString('2015-07-21')),
            (a,b) => IntervalDomain.cmp(a,b)
        )).toEqual(-1);
    });
    it('cmp computes the right result', () => {
        expect(_cmp(
            IntervalDomain.from(DateTimeDomain.fromISOString('2015-07-09'), DateTimeDomain.fromISOString('2015-07-21')),
            IntervalDomain.from(DateTimeDomain.fromISOString('2015-06-09'), DateTimeDomain.fromISOString('2015-06-21')),
            (a,b) => IntervalDomain.cmp(a,b)
        )).toEqual(1);
    });
    it('cmp computes the right result', () => {
        expect(_cmp(
            IntervalDomain.from(DateTimeDomain.fromISOString('2015-06-09'), DateTimeDomain.fromISOString('2015-06-21')),
            IntervalDomain.from(DateTimeDomain.fromISOString('2015-06-09'), DateTimeDomain.fromISOString('2015-06-21')),
            (a,b) => IntervalDomain.cmp(a,b)
        )).toEqual(0);
    });
})

describe('When.asDates.from', () => {
    const asString = DateDomain.asString();
    it('cmp merges nonoverlapping ranges', () => {
        if(asString === undefined) throw new Error('Financial.Temporal.DateDomain did not implement asString');
        let input: JSONValue = { from: "2024-06-20T19:30:59.734Z", to: "2024-08-06T19:30:59.734Z"};
        const a = WhenDomain.asJSON().from(input, { onError: error => console.error(`Parsing JSON ${JSON.stringify(input)} causes ${JSON.stringify(error)}`) });
        input = { from: "2024-08-08T19:30:59.734Z", to: "2024-11-22T20:30:59.734Z"};
        const b = WhenDomain.asJSON().from(input, { onError: error => console.error(`Parsing JSON ${JSON.stringify(input)} causes ${JSON.stringify(error)}`) });
        expect(a).toBeTruthy();
        expect(b).toBeTruthy();
        const expanded = a && b && WhenDomain.expand(
            a,
            b
        );
        expanded?.dates?.from && expect(asString.to(expanded.dates.from)).toEqual("2024-06-20T19:30:59.734Z");
        expanded?.dates?.to && expect(asString.to(expanded.dates.to)).toEqual("2024-11-22T20:30:59.734Z");
    });
})
