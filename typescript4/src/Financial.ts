/**
 * @packageDocumentation
 * Introspectable domain definitions for financial data.
 */
import * as Introspection from 'typescript-introspection';
import { Definitions, Values } from '@pitaman71/omniglot-live-data';

import * as Currency from './Currency';

const __moduleName__ = 'omniglot-live-domains.Financial';
export const directory = new Definitions.Directory();

export const BasisDomain = new Values.EnumerationDomain(`${__moduleName__}.BasisDomain`, 'hr', 'day', 'week', 'month', 'project');
directory.add(BasisDomain);
export const AmountDomain = new Values.RangeDomain(`${__moduleName__}.AmountDomain`, undefined, undefined, 1);
directory.add(AmountDomain);

type BasisType = Introspection.getValueType<typeof BasisDomain>;
type AmountType = Introspection.getValueType<typeof AmountDomain>;
type CurrencyCodesType = Introspection.getValueType<typeof Currency.CodesDomain>;

export interface _Tender {
    currency?: CurrencyCodesType;
    amount: AmountType;
};

class _TenderDomain extends Values.AggregateDomain<_Tender> {
    constructor(canonicalName: string) {
        super(canonicalName, {
            currency: Currency.CodesDomain,
            amount: AmountDomain
        }, ['currency'])
    }
    asSchema() { return { currency: Currency.CodesDomain.asSchema(), amount: AmountDomain.asSchema() } }
    asString(format?: Introspection.Format) { 
        return format !== undefined ? undefined : {
            from(text: string|null): _Tender|null { 
                let error: string|undefined;
                let currency: CurrencyCodesType|undefined;
                let amount: number|undefined;
                if(text === null) return null;
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
            to(value: _Tender|null) { 
                if(value === null) return null;
                return value.currency === undefined || value.amount === undefined ? '' : `${value.currency} ${value.amount}` }
        };
    }
    asEnumeration(maxCount: number) { return undefined }
    cmp(a: _Tender, b: _Tender) {
        return undefined;
    }
}
/**
 * Inrtospectable domain for a value representing an amount of money in a specific currency.
 */
export const TenderDomain = new _TenderDomain(`${__moduleName__}.TenderDomain`);
directory.add(TenderDomain);

export type _PayRange = {
    currency?: CurrencyCodesType, 
    minimum: AmountType, 
    maximum: AmountType,
    basis: { standard?: BasisType },
};

class _PayRangeDomain extends Values.AggregateDomain<_PayRange> {
    constructor(canonicalName: string) {
        super(canonicalName, {
            currency: Currency.CodesDomain,
            minimum: AmountDomain,
            maximum: AmountDomain,
            basis: new Values.AggregateDomain(`${canonicalName}.standard`, {
                standard: BasisDomain
            }, [ 'standard' ])
        }, ['currency'])
    }
    asSchema() { return { currency: "string", minimum: "number", maximum: "number", standard: "string" } }
    asString(format?: Introspection.Format) { 
        const domain = this;
        return format !== undefined ? undefined : {
            from(text: string): _PayRange|null { 
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
            to(value: _PayRange|null) { 
                if(value === null) return null;
                return value.minimum === value.maximum ? `${value.currency} ${value.minimum} ${value.basis?.standard}` : `${value.currency} ${value.minimum} - ${value.maximum} ${value.basis?.standard}` }
        };
    }
    asEnumeration(maxCount: number) { return undefined }
    cmp(a: _PayRange, b: _PayRange) {
        return undefined;
    }
}
/**
 * Inrtospectable domain for a value representing an range of acceptable pay rates,
 * including a payment basis.
 */
export const PayRangeDomain = new _PayRangeDomain(`${__moduleName__}.PayRangeDomain`);
directory.add(PayRangeDomain);
