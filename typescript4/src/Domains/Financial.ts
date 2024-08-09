import * as Elevated from '@pitaman71/omniglot-introspect';
import { Values } from '@pitaman71/omniglot-live-data';
import * as Base from './Base';

import * as Currency from './Currency';

export const BasisDomain = new Values.EnumerationDomain('hr', 'day', 'week', 'month', 'project');
export const AmountDomain = new Values.RangeDomain(undefined, undefined, 1);

type BasisType = Elevated.getValueType<typeof BasisDomain>;
type AmountType = Elevated.getValueType<typeof AmountDomain>;
type CurrencyCodesType = Elevated.getValueType<typeof Currency.CodesDomain>;

export type _Tender = {
    currency?: CurrencyCodesType, amount?: AmountType
};

export const TenderDomain = new class _TenderDomain extends Elevated.Domain<Base.Parseable<_Tender>> {
    asJSON() {
        return {
            schema() { return { currency: BasisDomain.asJSON().schema(), amount: AmountDomain.asJSON().schema() } },
            from(json: Elevated.JSONValue): Base.Parseable<_Tender>|null {
                if(!!json && typeof json === 'object' && !Array.isArray(json)) {
                    let errors: string[] = [];
                    let currency: undefined|CurrencyCodesType;
                    let amount: undefined|number;
                    if(json.currency) {
                        currency = Currency.CodesDomain.asJSON().from(json.currency) || undefined;
                    }
                    if(json.amount) {
                        amount = AmountDomain.asJSON().from(json.amount) || undefined;
                    } 
                    const parsed = {
                        currency, amount
                    };
                    const text = TenderDomain.asString().to({ parsed })
                    return (
                        errors.length > 0 ? { error: errors.join(', ') } 
                        : { parsed, text }
                    );
                }
                return null;
            },
            to(value: Base.Parseable<_Tender>) {
                return {
                    currency: value.parsed?.currency?.toString(),
                    amount: value.parsed?.amount
                };
            }
        }
    }
    asString(format?: string) { 
        return {
            from(text: string) { 
                let error: string|undefined;
                let currency: CurrencyCodesType|undefined;
                let amount: number|undefined;
                const re1 = new RegExp(/([A-Z][A-Z][A-Z])?\s*(\d+)(\.\d+)?/);
                const parsed1 = text.match(re1);
                if(parsed1) {
                    currency = Currency.CodesDomain.asJSON().from(parsed1[1]) || undefined;
                    if(parsed1[3]) {
                        amount = Number.parseFloat(`${parsed1[2]}${parsed1[3]}`);
                    } else {
                        amount = Number.parseInt(parsed1[2]);
                    }
                } else {
                    error = 'Invalid format. Expected: CCC ##(.##)'
                }
                return { text, error, currency, amount};
            },
            to(value: Base.Parseable<_Tender>) { return value.text ? value.text : value.parsed === undefined ? '' : `${value.parsed.currency} ${value.parsed.amount}` }
        };
    }
    asEnumeration(maxCount: number) { return undefined }
    asColumns() { return undefined }
    cmp(a: Base.Parseable<_Tender>, b: Base.Parseable<_Tender>) {
        return undefined;
    }
};
export type _PayRange = {
    currency?: CurrencyCodesType, minimum?: AmountType, maximum?: AmountType,
    basis: Base.Parseable & { standard?: BasisType },
};

export const PayRangeDomain = new class _PayRangeDomain extends Elevated.Domain<Base.Parseable<_PayRange>> {
    asJSON() {
        return {
            schema() { return { currency: "string", minimum: "number", maximum: "number", standard: "string" } },
            from(json: Elevated.JSONValue): Base.Parseable<_PayRange>|null {
                let errors: string[] = [];
                let currency: undefined|CurrencyCodesType;
                let minimum: undefined|AmountType;
                let maximum: undefined|AmountType;
                let standard: undefined|BasisType;
                if(!!json && typeof json === 'object' && !Array.isArray(json)) {
                    if(json.currency) {
                        currency = Currency.CodesDomain.asJSON().from(json.currency) || undefined;
                    }
                    if(json.basis && typeof json.basis === 'object' && !Array.isArray(json.basis) && json.basis.standard) {
                        const basis = json.basis;
                        standard = BasisDomain.asJSON().from(json.basis.standard) || undefined;
                    }
                    if(json.minimum) minimum = AmountDomain.asJSON().from(json.minimum) || undefined;
                    if(json.maximum) maximum = AmountDomain.asJSON().from(json.maximum) || undefined;
                    const parsed = {
                        currency, basis: { standard }, minimum, maximum
                    };
                    const text = PayRangeDomain.asString().to({ parsed })
                    return (
                        errors.length > 0 ? { error: errors.join(', ') } 
                        : { parsed, text }
                    );
                }
                return null;
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
                let currency: CurrencyCodesType|undefined;
                let minimum: number|undefined;
                let maximum: number|undefined;
                let basis: BasisType|undefined;
                const re1 = new RegExp(/([A-Z][A-Z][A-Z])?\s*(\d+)(\.\d+)?\s*(\/\S+)?/);
                const re2 = new RegExp(/([A-Z][A-Z][A-Z])?\s*(\d+)(\.\d+)?\s*-\s*(\d+)(\.\d+)\s*(\/\S+)?/);
                const parsed1 = text.match(re1);
                const parsed2 = text.match(re2);
                if(parsed2) {
                    currency = Currency.CodesDomain.asJSON().from(parsed2[1]) || undefined;
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
                    basis = BasisDomain.asJSON().from(parsed2[6]) || undefined;
                } else if(parsed1) {
                    currency = Currency.CodesDomain.asJSON().from(parsed1[1]) || undefined;
                    if(parsed1[3]) {
                        minimum = Number.parseFloat(`${parsed1[2]}${parsed1[3]}`);
                        maximum = minimum;
                    } else {
                        minimum = Number.parseInt(parsed1[2]);
                        maximum = minimum;
                    }
                    basis = BasisDomain.asJSON().from(parsed1[4]) || undefined;
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
