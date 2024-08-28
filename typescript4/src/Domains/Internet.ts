import faker from 'faker';
import { Domain } from '@pitaman71/omniglot-introspect';
import {  Values } from '@pitaman71/omniglot-live-data';

export interface _URL {
    url: URL
}

export const URLDomain = new class extends Domain<Partial<Values.Parseable<void> & _URL>> {
    asString() {
        return new class {
            from(text: string): Partial<Values.Parseable<void>> & _URL { 
                return { text, url: new URL(text) }
            }
            to(value: Partial<Values.Parseable<void>> & _URL) { 
                if(typeof value.text === 'string') value.text;
                return value.url?.toString()|| "" ;
            }
        }
    }
    asEnumeration() {
        return undefined;
    }
    cmp(a: Partial<Values.Parseable<void> & _URL>, b:Partial<Values.Parseable<void> & _URL>) { return a < b ? -1 : a > b ? +1 : 0 }
}

export function PickURL() {
    return URLDomain.asString().from(faker.internet.url());
}

export function PickEmail() {
    return URLDomain.asString().from(faker.internet.email());
}
