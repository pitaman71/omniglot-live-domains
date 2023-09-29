import * as faker from 'faker';

import { ZoneDomain, DateTimeDomain, IntervalDomain } from './Temporal';

describe('constructors', () => {
    it('should create a DateTime', ()=> {
        expect(DateTimeDomain.fromISOString('2015-06-061')).not.toBeNull();
    });
})

describe('DateTime operators', () => {
    it('cmp computes the right result', () => {
        expect(DateTimeDomain.cmp(DateTimeDomain.fromISOString('2015-06-01'), DateTimeDomain.fromISOString('2015-05-02'))).toEqual(1);
        expect(DateTimeDomain.cmp(DateTimeDomain.fromISOString('2020-12-21'), DateTimeDomain.fromISOString('2020-12-22'))).toEqual(-1);
        expect(DateTimeDomain.cmp(DateTimeDomain.fromISOString('3000-01-01'), DateTimeDomain.fromISOString('3000-01-01'))).toEqual(0);
    });

})

describe('Interval operators', () => {
    it('cmp computes the right result', () => {
        expect(IntervalDomain.cmp(
            IntervalDomain.from(DateTimeDomain.fromISOString('2015-06-09'), DateTimeDomain.fromISOString('2015-06-21')),
            IntervalDomain.from(DateTimeDomain.fromISOString('2015-07-09'), DateTimeDomain.fromISOString('2015-07-21'))
        )).toEqual(-1);
    });
    it('cmp computes the right result', () => {
        expect(IntervalDomain.cmp(
            IntervalDomain.from(DateTimeDomain.fromISOString('2015-07-09'), DateTimeDomain.fromISOString('2015-07-21')),
            IntervalDomain.from(DateTimeDomain.fromISOString('2015-06-09'), DateTimeDomain.fromISOString('2015-06-21'))
        )).toEqual(1);
    });
    it('cmp computes the right result', () => {
        expect(IntervalDomain.cmp(
            IntervalDomain.from(DateTimeDomain.fromISOString('2015-06-09'), DateTimeDomain.fromISOString('2015-06-21')),
            IntervalDomain.from(DateTimeDomain.fromISOString('2015-06-09'), DateTimeDomain.fromISOString('2015-06-21'))
        )).toEqual(0);
    });
})
