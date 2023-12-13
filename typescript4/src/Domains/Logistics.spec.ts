import * as faker from 'faker';

import { WhenDomain } from './Logistics';

describe('When.asDates.from', () => {
    it('cmp computes the right result', () => {
        const expanded = WhenDomain.expand(
            WhenDomain.asDates().from({ from: "2024-06-20T19:30:59.734Z", to: "2024-08-06T19:30:59.734Z"}),
            WhenDomain.asDates().from({ from: "2024-08-08T19:30:59.734Z", to: "2024-11-22T20:30:59.734Z"})
        );
        expect(expanded.dates?.from.iso8601).toEqual("2024-06-20T19:30:59.734Z");
        expect(expanded.dates?.to.iso8601).toEqual("2024-11-22T20:30:59.734Z");
    });

})
