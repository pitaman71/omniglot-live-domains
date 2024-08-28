import * as Elevated from '@pitaman71/omniglot-introspect';
import { Values } from '@pitaman71/omniglot-live-data';

import * as Currency from './Currency';

export const BasisDomain = new Values.EnumerationDomain('hr', 'day', 'week', 'month', 'project');
export const AmountDomain = new Values.RangeDomain(undefined, undefined, 1);

type BasisType = Elevated.getValueType<typeof BasisDomain>;
type AmountType = Elevated.getValueType<typeof AmountDomain>;
type CurrencyCodesType = Elevated.getValueType<typeof Currency.CodesDomain>;

export interface _Tender {
    currency?: CurrencyCodesType;
    amount: AmountType;
};

class _TenderDomain extends Values.AggregateDomain<_Tender> {
    constructor() {
        super({
            currency: Currency.CodesDomain,
            amount: AmountDomain
        }, ['currency'])
    }
    asSchema() { return { currency: Currency.CodesDomain.asSchema(), amount: AmountDomain.asSchema() } }
    asString(format?: string) { 
        return {
            from(text: string): Partial<_Tender>|null { 
                let error: string|undefined;
                let currency: CurrencyCodesType|undefined;
                let amount: number|undefined;
                const re1 = new RegExp(/([A-Z][A-Z][A-Z])?\s*(\d+)(\.\d+)?/);
                const parsed1 = text.match(re1);
                if(parsed1) {
                    currency = Currency.CodesDomain.asJSON()?.from(parsed1[1]) || undefined;
                    if(parsed1[3]) {
                        amount = Number.parseFloat(`${parsed1[2]}${parsed1[3]}`);
                    } else {
                        amount = Number.parseInt(parsed1[2]);
                    }
                } else {
                    error = 'Invalid format. Expected: CCC ##(.##)'
                }
                if(!amount) return null;
                return { currency, amount };
            },
            to(value: Partial<_Tender>) { 
                return value.currency === undefined || value.amount === undefined ? '' : `${value.currency} ${value.amount}` }
        };
    }
    asEnumeration(maxCount: number) { return undefined }
    cmp(a: _Tender, b: _Tender) {
        return undefined;
    }
}
export const TenderDomain = new _TenderDomain();

export type _PayRange = {
    currency?: CurrencyCodesType, 
    minimum: AmountType, 
    maximum: AmountType,
    basis: { standard?: BasisType },
};

class _PayRangeDomain extends Values.AggregateDomain<_PayRange> {
    constructor() {
        super({
            currency: Currency.CodesDomain,
            minimum: AmountDomain,
            maximum: AmountDomain,
            basis: new Values.AggregateDomain({
                standard: BasisDomain
            }, [ 'standard' ])
        }, ['currency'])
    }
    asSchema() { return { currency: "string", minimum: "number", maximum: "number", standard: "string" } }
    asString(format?: string) { 
        const domain = this;
        return {
            from(text: string): Partial<_PayRange>|null { 
                let error: string|undefined;
                let currency: CurrencyCodesType|undefined;
                let minimum: number|undefined;
                let maximum: number|undefined;
                let basis: _PayRange['basis']|undefined;
                const re1 = new RegExp(/([A-Z][A-Z][A-Z])?\s*(\d+)(\.\d+)?\s*(\/\S+)?/);
                const re2 = new RegExp(/([A-Z][A-Z][A-Z])?\s*(\d+)(\.\d+)?\s*-\s*(\d+)(\.\d+)?\s*(\/\S+)?/);
                const parsed1 = text.match(re1);
                const parsed2 = text.match(re2);
                if(parsed2) {
                    currency = Currency.CodesDomain.asJSON()?.from(parsed2[1]) || undefined;
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
                    basis = domain.properties['basis'].asJSON()?.from(parsed2[6]) || {};
                } else if(parsed1) {
                    currency = Currency.CodesDomain.asJSON()?.from(parsed1[1]) || undefined;
                    if(parsed1[3]) {
                        minimum = Number.parseFloat(`${parsed1[2]}${parsed1[3]}`);
                        maximum = minimum;
                    } else {
                        minimum = Number.parseInt(parsed1[2]);
                        maximum = minimum;
                    }
                    basis = domain.properties['basis'].asJSON()?.from(parsed1[4]) || {};
                } else {
                    error = 'Invalid format. Expected: CCC ##(.##) (- $##().##)) bbb'
                }
                if(minimum === undefined || maximum === undefined || basis === undefined) return null;
                return { currency, minimum, maximum, basis };
            },
            to(value: Partial<_PayRange>) { 
                return value.minimum === value.maximum ? `${value.currency} ${value.minimum} ${value.basis?.standard}` : `${value.currency} ${value.minimum} - ${value.maximum} ${value.basis?.standard}` }
        };
    }
    asEnumeration(maxCount: number) { return undefined }
    cmp(a: _PayRange, b: _PayRange) {
        return undefined;
    }
}
export const PayRangeDomain = new _PayRangeDomain;
