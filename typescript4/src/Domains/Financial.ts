import * as Elevated from '@pitaman71/omniglot-introspect';
import * as Base from './Base';

export type Currency = 'USD';

export enum Basis { 
    Hour = 'hr', 
    Day = 'day',
    Week = 'week',
    Month = 'month'
};

export type _PayRange = {
    currency: Currency, minimum?: number, maximum?: number,
    basis: Base.Parseable & { standard?: Basis },
};

export const PayRangeDomain = new class _PayRangeDomain extends Elevated.Domain<Base.Parseable & _PayRange> {
    asString(format?: string) { 
        return {
            from(text: string) { 
                let error: string|undefined;
                let minimum: number|undefined;
                let maximum: number|undefined;
                let unit: string = '';
                const re1 = new RegExp(/\$\s*(\d+)(\.\d+)?\s*(\/\S+)?/);
                const re2 = new RegExp(/\$\s*(\d+)(\.\d+)?\s*-\s*\$?\s*(\d+)(\.\d+)\s*(\/\S+)?/);
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
                    if(parsed2[5]) {
                        unit = parsed2[5].toLowerCase();
                    }
                } else if(parsed1) {
                    if(parsed1[2]) {
                        minimum = Number.parseFloat(`${parsed1[1]}${parsed1[2]}`);
                        maximum = minimum;
                    } else {
                        minimum = Number.parseInt(parsed1[1]);
                        maximum = minimum;
                    }
                    if(parsed1[3]) {
                        unit = parsed1[3].toLowerCase();
                    }
                } else {
                    error = 'Invalid format. Expected: $##.## (- $##.##)'
                }
                let currency: Currency = 'USD';
                if(unit === '' || unit[0] === 'h') {
                    return { text, error, currency, minimum, maximum, basis: { text: 'hour', standard: Basis.Hour }};
                } else if(unit[0] === 'd') {
                    return { text, error, currency, minimum, maximum, basis:  { text: 'day', standard: Basis.Day }};
                } else if(unit[0] === 'w') {
                    return { text, error, currency, minimum, maximum, basis: { text: 'week', standard: Basis.Week }};
                } else if(unit === 'm') {
                    return { text, error, currency, minimum, maximum, basis: { text: 'month', standard: Basis.Month }};
                } else {
                    return { text, error, currency, minimum, maximum, basis: { text: unit } };
                }
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
