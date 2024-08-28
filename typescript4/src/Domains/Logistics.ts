import * as Elevated from '@pitaman71/omniglot-introspect';
import { Values } from '@pitaman71/omniglot-live-data';
import { _When, WhenDomain } from './Temporal';

export const GeoPointDomain = new Values.AggregateDomain({ 
    lat: Values.TheNumberDomain, 
    lng: Values.TheNumberDomain
});

export const GeoShapeDomain = new Values.AggregateDomain({ 
    point: GeoPointDomain,
    cloud: new Values.ArrayDomain(GeoPointDomain)
});

export const NameDomain = new Values.AggregateDomain({
    shortName: Values.TheStringDomain,
    longName: Values.TheStringDomain,
    iso: new Values.AggregateDomain({ 
        standard: Values.TheStringDomain, 
        code: Values.TheStringDomain
    })
}, [ 'shortName', 'longName', 'iso']);

export const AddressDomain = new Values.AggregateDomain({ 
    addressLine1: Values.TheStringDomain,
    addressLine2: Values.TheStringDomain,
    postalCode: Values.TheStringDomain,
    city: NameDomain,
    county: NameDomain,
    state: NameDomain,
    country: NameDomain
}, ['addressLine1', 'addressLine2', 'postalCode', 'city', 'county', 'state', 'country']);

export const WhereDomain = new Values.AggregateDomain({
    name: Values.TheStringDomain,
    googlePlaceId: Values.TheStringDomain,
    address: AddressDomain,
    geo: GeoShapeDomain
}, ['googlePlaceId', 'address', 'geo']);

export interface _Radius {
    sense: 'inside'|'outside';
    miles?: number;
    kilometers?: number;
}

class _RadiusDomain extends Elevated.Domain<_Radius> {
    asString(format?: string) { 
        return {
            from(text: string): null|_Radius { 
                let sense:'inside'|'outside' = 'outside';
                let miles: number|undefined;
                let kilometers: number|undefined;
                const match = text.match(/([+-]?)(\d+)\s*(\w+)/);
                if(match) {
                    if(match[1] == '-') sense = 'inside';
                    if(match[3] == 'mi' || match[3] == 'miles') miles = parseInt(match[2]);
                    if(match[3] == 'km' || match[3] == 'kilometers') kilometers = parseInt(match[2]);
                } else {
                    //error = `Expected format: [+-]##[mi|km]`
                    return null;
                }
                return { sense, miles, kilometers }
            },
            to(value: _Radius) { 
                if(value.miles === undefined && value.kilometers === undefined) return "";
                return `${value.sense == 'inside' ? '-' : '+'}${value.miles || value.kilometers}${!!value.miles ? 'mi' : !!value.kilometers ? 'km' : ''}`
            }
        };
    }
    asEnumeration(maxCount: number) { return undefined }
    cmp(a: _Radius, b: _Radius) {
        return undefined;
    }
}
export const RadiusDomain = new _RadiusDomain();

class _EventDomain extends Values.AggregateDomain<{
    where: Elevated.getValueType<typeof WhereDomain>,
    radius: Elevated.getValueType<typeof RadiusDomain>,
    when: Elevated.getValueType<typeof WhenDomain>
}> {
    constructor() {
        super({
            where: WhereDomain,
            radius: RadiusDomain,
            when: WhenDomain
        })
    }
}
export const EventDomain = new _EventDomain();
