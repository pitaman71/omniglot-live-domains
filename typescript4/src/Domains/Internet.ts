import * as Base from './Base';
import faker from 'faker';
import { Domain } from '@pitaman71/omniglot-introspect';

interface _URL {
    url?: URL
}

export const URLDomain = new class extends Domain<Base.Parseable & _URL> {
    asString() {
        return new class {
            from(text: string): Base.Parseable & _URL { 
                return { text, url: new URL(text) }
            }
            to(value: Base.Parseable & _URL) { return value.url?.toString() || value.text || "" }
        }
    }
    asEnumeration() {
        return undefined;
    }
    asColumns() { return undefined; }

    cmp(a: _URL, b:_URL) { return a < b ? -1 : a > b ? +1 : 0 }
}

export function PickURL() {
    return URLDomain.asString().from(faker.internet.url());
}

export function PickEmail() {
    return URLDomain.asString().from(faker.internet.email());
}
