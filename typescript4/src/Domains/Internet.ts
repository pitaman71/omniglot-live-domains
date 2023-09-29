import faker from 'faker';
import { Domain } from '@pitaman71/omniglot-introspect';

export const TheURLDomain = new class extends Domain<URL> {
    asString() {
        return new class {
            from(text: string) { 
                return new URL(text)
            }
            to(value: URL) { return value.toString() }
        }
    }
    asEnumeration() {
        return undefined
    }
    asColumns() { return undefined; }

    cmp(a: URL, b:URL) { return a < b ? -1 : a > b ? +1 : 0 }
}

export function PickURL() {
    return new URL(faker.internet.url());
}

export function PickEmail() {
    return faker.internet.email();
}
