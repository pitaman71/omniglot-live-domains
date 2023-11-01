import * as Elevated from '@pitaman71/omniglot-introspect';
import * as Base from './Base';

export type Currency = 'USD';

export interface _PayRange {
    hourly?: { currency: Currency, minimum?: number, maximum?: number }
}

export const PayRangeDomain = new class _PayRangeDomain extends Elevated.Domain<Base.Parseable & _PayRange> {
    asString(format?: string) { 
        return {
            from(text: string) { 
                let error: string|undefined;
                let minimum: number|undefined;
                let maximum: number|undefined;
                const re1 = new RegExp(/\$\s*(\d+)(\.\d+)?/);
                const re2 = new RegExp(/\$\s*(\d+)(\.\d+)?\s*-\s*\$?\s*(\d+)(\.\d+)?/);
                const parsed1 = text.match(re1);
                const parsed2 = text.match(re2);
                if(parsed2) {
                    if(parsed2[2]) {
                        minimum = Number.parseFloat(`${parsed2[1]}${parsed2[2]}`);
                    } else {
                        minimum = Number.parseInt(parsed2[2]);
                    }
                    if(parsed2[4]) {
                        maximum = Number.parseFloat(`${parsed2[3]}${parsed2[4]}`);
                    } else {
                        maximum = Number.parseInt(parsed2[4]);
                    }
                } else if(parsed1) {
                    if(parsed1[2]) {
                        minimum = Number.parseFloat(`${parsed1[1]}${parsed1[2]}`);
                        maximum = minimum;
                    } else {
                        minimum = Number.parseInt(parsed1[1]);
                        maximum = minimum;
                    }
                } else {
                    error = 'Invalid format. Expected: $##.## (- $##.##)'
                }
                let currency: Currency = 'USD';
                return { text, error, hourly: { currency, minimum, maximum }};
            },
            to(value: Base.Parseable & _PayRange) { return value.text || "" }
        };
    }
    asEnumeration(maxCount: number) { return undefined }
    asColumns() { return undefined }
    cmp(a: Base.Parseable & _PayRange, b: Base.Parseable & _PayRange) {
        return undefined;
    }
};
