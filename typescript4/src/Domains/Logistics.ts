import * as Elevated from '@pitaman71/omniglot-introspect';

interface _GeoPoint {
    asString?: { lat: string, lng: string }, 
    asNumber?: { lat: number, lng: number }
}

interface _Where {
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

interface _Radius {
    sense: 'inside'|'outside';
    miles?: number;
    kilometers?: number;
}

interface _When {
    before?: { iso8601: string };
    after?: { iso8601: string };
    at?: { iso8601: string };
    from?: { iso8601: string };
    to?: { iso8601: string };
}

export interface _Event {
    where?: _Where;
    radius?: _Radius;
    when?: _When;
}

export interface _Parseable {
    text?: string;
    error?: any;
}

export const EventDomain = new class _EventDomain extends Elevated.Domain<_Parseable & _Event> {
    asString(format?: string) { 
        return {
            from(text: string) { return { text } },
            to(value: _Parseable & _Event) { return value.text || "" }
        };
    }
    asEnumeration(maxCount: number) { return undefined }
    asColumns() { return undefined }
    cmp(a: _Parseable & _Event, b: _Parseable & _Event) {
        return undefined;
    }
};
