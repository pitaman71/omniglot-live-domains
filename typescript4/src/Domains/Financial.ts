import Dinero from 'dinero.js';
import * as Elevated from '@pitaman71/omniglot-introspect';

export const Tender = new class _Tender extends Elevated.Domain<Dinero.Dinero> {
    asString(format?: string) { return new class {
            from(text: string): Dinero.Dinero {
                const matches = text.match(/(\d+)(\.\d+)?\s*(\w+)/);
                if(matches === null) {
                    throw new Error(`Cannot parse string ${text}`)
                }
                const amount = matches[1]+matches[2];
                const currency = matches[3];
                return Dinero({ amount: Number.parseFloat(amount), currency: currency as any })
            }
            to(value: Dinero.Dinero): string { return `${value.getAmount()} ${value.getCurrency()}` }
        }
    }
    asEnumeration(maxCount: number) { return undefined }
    asColumns() { return new class {
        getColumnNames(): string[]{ return [ 'amount', 'currency' ]};
    } }
    cmp(a: Dinero.Dinero, b:Dinero.Dinero): undefined|-1|0|1 {
        return a.lessThan(b) ? -1
            : a.greaterThan(b) ? 1
            : 0;
    }
}
