import * as Elevated from '@pitaman71/omniglot-introspect';
import { Values } from '@pitaman71/omniglot-live-data';

export interface Parseable<BodyT = undefined> {
    text?: string;
    error?: any;
    parsed?: BodyT
}

export function ParseableDomain<ElementType>(elementDomain: Elevated.Domain<ElementType>) {
    return new Values.PartialDomain({
        text: Values.TheStringDomain,
        error: Values.TheStringDomain,
        parsed: elementDomain
    });
}