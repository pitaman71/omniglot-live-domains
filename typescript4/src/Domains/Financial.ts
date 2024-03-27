import * as Elevated from '@pitaman71/omniglot-introspect';
import * as Base from './Base';

import * as Currency from './Currency';

export enum Basis { 
    Hour = 'hr', 
    Day = 'day',
    Week = 'week',
    Month = 'month',
    Project = 'project'
};

export type _PayRange = {
    currency?: Currency.Codes, minimum?: number, maximum?: number,
    basis: Base.Parseable & { standard?: Basis },
};

export const PayRangeDomain = new class _PayRangeDomain extends Elevated.Domain<Base.Parseable<_PayRange>> {
    asJSON() {
        return {
            from(json: any): Base.Parseable<_PayRange> {
                let errors: string[] = [];
                let currency: undefined|Currency.Codes;
                let minimum: undefined|number;
                let maximum: undefined|number;
                let standard: undefined|Basis;
                if(json.currency) {
                    Object.entries(Currency.Codes).forEach(([key_, value_]) => {
                        if(json.currency === value_) currency = value_;
                    });
                    if(currency === undefined)
                        errors.push(`Illegal currency value ${json.currency}`);
                }
                if(json.basis) {
                    Object.entries(Basis).forEach(([key_, value_]) => {
                        if(json.basis?.standard === value_ || json.basis === standard) standard = value_
                    });
                    if(standard === undefined) 
                        errors.push(`Illegal basis value ${json.basis}`)
                }
                minimum = json.minimum;
                maximum = json.maximum;
                return (
                    errors.length > 0 ? { error: errors.join(', ') } 
                    : { parsed: {
                            currency, basis: { standard }, minimum, maximum
                        }, text: `${currency} ${minimum} - ${maximum} ${standard}`
                    }
                );
            },
            to(value: Base.Parseable<_PayRange>) {
                return JSON.stringify({
                    currency: value.parsed?.currency,
                    basis: value.parsed?.basis,
                    minimum: value.parsed?.minimum,
                    maximum: value.parsed?.maximum
                });
            }
        }
    }
    asString(format?: string) { 
        return {
            from(text: string) { 
                let error: string|undefined;
                let currency: Currency.Codes|undefined;
                let minimum: number|undefined;
                let maximum: number|undefined;
                let basis: Basis|undefined;
                const re1 = new RegExp(/([A-Z][A-Z][A-Z])?\s*(\d+)(\.\d+)?\s*(\/\S+)?/);
                const re2 = new RegExp(/([A-Z][A-Z][A-Z])?\s*(\d+)(\.\d+)?\s*-\s*(\d+)(\.\d+)\s*(\/\S+)?/);
                const parsed1 = text.match(re1);
                const parsed2 = text.match(re2);
                if(parsed2) {
                    Object.entries(Currency.Codes).forEach(([key_, value_]) => {
                        if(parsed2[1] === value_) currency = value_
                    });
                    if(parsed2[3]) {
                        minimum = Number.parseFloat(`${parsed2[2]}${parsed2[3]}`);
                    } else {
                        minimum = Number.parseInt(parsed2[2]);
                    }
                    if(parsed2[5]) {
                        maximum = Number.parseFloat(`${parsed2[4]}${parsed2[5]}`);
                    } else {
                        maximum = Number.parseInt(parsed2[4]);
                    }
                    Object.entries(Basis).forEach(([key_, value_]) => {
                        if(parsed2[6] === value_) basis = value_
                    });
                } else if(parsed1) {
                    Object.entries(Currency.Codes).forEach(([key_, value_]) => {
                        if(parsed1[1] === value_) currency = value_
                    });
                    if(parsed1[3]) {
                        minimum = Number.parseFloat(`${parsed1[2]}${parsed1[3]}`);
                        maximum = minimum;
                    } else {
                        minimum = Number.parseInt(parsed1[2]);
                        maximum = minimum;
                    }
                    Object.entries(Basis).forEach(([key_, value_]) => {
                        if(parsed1[4] === value_) basis = value_
                    });
                } else {
                    error = 'Invalid format. Expected: CCC ##(.##) (- $##().##)) bbb'
                }
                return { text, error, currency, minimum, maximum, basis: { standard: basis }};
            },
            to(value: Base.Parseable<_PayRange>) { return value.text ? value.text : value.parsed === undefined ? '' : value.parsed.minimum === value.parsed.maximum ? `${value.parsed.currency} ${value.parsed.minimum} ${value.parsed.basis.standard || value.parsed.basis.text}` : `${value.parsed.currency} ${value.parsed.minimum} - ${value.parsed.maximum} ${value.parsed.basis.standard || value.parsed.basis.text}` }
        };
    }
    asEnumeration(maxCount: number) { return undefined }
    asColumns() { return undefined }
    cmp(a: Base.Parseable<_PayRange>, b: Base.Parseable<_PayRange>) {
        return undefined;
    }
};
