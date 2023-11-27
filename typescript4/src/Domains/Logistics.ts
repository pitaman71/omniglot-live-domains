import * as Elevated from '@pitaman71/omniglot-introspect';
import * as Base from './Base';

export interface _GeoPoint {
    asString?: { lat: string, lng: string }, 
    asNumber?: { lat: number, lng: number }
}

export interface _Where {
    googlePlaceId?: string;
    address?: {
        addressLine1?: string;
        addressLine2?: string;
        postalCode?: string;
        city?: string;
        country?: string;
    };
    geo?: { 
        point?: _GeoPoint; 
        cloud?: _GeoPoint[];
    };
}

export const WhereDomain = new class _EventDomain extends Elevated.Domain<Base.Parseable & _Where> {
    asString(format?: string) { 
        return {
            from(text: string): Base.Parseable & _Where { return { text } },
            to(value: Base.Parseable & _Where) { return value.text || "" }
        };
    }
    asEnumeration(maxCount: number) { return undefined }
    asColumns() { return undefined }
    cmp(a: Base.Parseable & _Where, b: Base.Parseable & _Where) {
        return undefined;
    }
};

export interface _Radius {
    sense: 'inside'|'outside';
    miles?: number;
    kilometers?: number;
}

export const RadiusDomain = new class _EventDomain extends Elevated.Domain<Base.Parseable & _Radius> {
    asString(format?: string) { 
        return {
            from(text: string): Base.Parseable & _Radius { 
                let sense:'inside'|'outside' = 'outside';
                let miles: number|undefined;
                let kilometers: number|undefined;
                let error: string|undefined;
                const match = text.match(/([+-]?)(\d+)\s*(\w+)/);
                if(match) {
                    if(match[1] == '-') sense = 'inside';
                    if(match[3] == 'mi' || match[3] == 'miles') miles = parseInt(match[2]);
                    if(match[3] == 'km' || match[3] == 'kilometers') kilometers = parseInt(match[2]);
                } else {
                    error = `Expected format: [+-]##[mi|km]`
                }
                return { text, error, sense, miles, kilometers }
            },
            to(value: Base.Parseable & _Radius) { return value.text || `${value.sense == 'inside' ? '-' : '+'}${value.miles || value.kilometers}${!!value.miles ? 'mi' : !!value.kilometers ? 'km' : ''}`}
        };
    }
    asEnumeration(maxCount: number) { return undefined }
    asColumns() { return undefined }
    cmp(a: Base.Parseable & _Radius, b: Base.Parseable & _Radius) {
        return undefined;
    }
};

export interface _When {
    before?: { iso8601: string };
    after?: { iso8601: string };
    at?: { iso8601: string };
    from?: { iso8601: string };
    to?: { iso8601: string };
}

export const WhenDomain = new class _EventDomain extends Elevated.Domain<Base.Parseable & _When> {
    asRange() {
        return {
            from(text_: { from: string, to: string }): Base.Parseable & _When { 
                const from = { iso8601: new Date(text_.from).toISOString() };
                const to = { iso8601: new Date(text_.to).toISOString() };
                const text = `${new Date(from.iso8601).toLocaleDateString()} - ${new Date(to.iso8601).toLocaleDateString()}`;
                const error = new Date(from.iso8601) <= new Date(to.iso8601) ? undefined : `Date range: 'from' date must occur before 'to' date`;
                return { text, error, from, to };
            },
            to(value: Base.Parseable & _When) { return { from: value.from?.iso8601, to: value.to?.iso8601 } }
        };
    }
    asString(format?: string) { 
        return {
            from(text: string): Base.Parseable & _When { return { text } },
            to(value: Base.Parseable & _When) { return value.text || "" }
        };
    }
    asEnumeration(maxCount: number) { return undefined }
    asColumns() { return undefined }
    cmp(a: Base.Parseable & _When, b: Base.Parseable & _When) {
        return undefined;
    }
};

export interface _Event {
    where?: _Where;
    radius?: _Radius;
    when?: _When;
}

export const EventDomain = new class _EventDomain extends Elevated.Domain<Base.Parseable & _Event> {
    asString(format?: string) { 
        return {
            from(text: string) { return { text } },
            to(value: Base.Parseable & _Event) { return value.text || "" }
        };
    }
    asEnumeration(maxCount: number) { return undefined }
    asColumns() { return undefined }
    cmp(a: Base.Parseable & _Event, b: Base.Parseable & _Event) {
        return undefined;
    }
};
