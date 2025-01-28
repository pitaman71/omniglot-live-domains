/**
 * Introspectable domain models representing logistical information;
 * e.g. where and when things happended, are happening, or will
 * happen. 
 */
import * as Introspection from 'typescript-introspection';
import { Definitions, Values } from '@pitaman71/omniglot-live-data';
import { _When, WhenDomain } from './Temporal';

const __moduleName__ = 'omniglot-live-domains.Logistics';
export const directory = new Definitions.Directory();

/**
 * Cartesian global coordinates in latitude, longitude format
 */
export const GeoPointDomain = new Values.AggregateDomain(`${__moduleName__}.GeoPointDomain`, { 
    lat: Values.TheNumberDomain, 
    lng: Values.TheNumberDomain
});
directory.add(GeoPointDomain);

/**
 * Shape on the surface of the globe as a single point or cloud of points.
 */
export const GeoShapeDomain = new Values.AggregateDomain(`${__moduleName__}.GeoShapeDomain`, { 
    point: GeoPointDomain,
    cloud: new Values.ArrayDomain(`${__moduleName__}.GeoShapeDomain.cloud`, GeoPointDomain)
});
directory.add(GeoShapeDomain);

/**
 * Name of a place
 */
export const NameDomain = new Values.AggregateDomain(`${__moduleName__}.NameDomain`, {
    shortName: Values.TheStringDomain,
    longName: Values.TheStringDomain,
    iso: new Values.AggregateDomain(`${__moduleName__}.NameDomain.iso`, { 
        standard: Values.TheStringDomain, 
        code: Values.TheStringDomain
    })
}, [ 'shortName', 'longName', 'iso']);
directory.add(NameDomain);

/**
 * Physical address of a place in pseudo-international format.
 */
export const AddressDomain = new Values.AggregateDomain(`${__moduleName__}.AddressDomain`, { 
    addressLine1: Values.TheStringDomain,
    addressLine2: Values.TheStringDomain,
    postalCode: Values.TheStringDomain
}, ['addressLine1', 'addressLine2', 'postalCode']);
directory.add(AddressDomain);

export const MunicipalityDomain = new Values.AggregateDomain(`${__moduleName__}.MunicipalityDomain`, { 
    city: NameDomain,
    county: NameDomain,
    state: NameDomain,
    country: NameDomain
}, ['city', 'county', 'state', 'country']);
directory.add(AddressDomain);

export interface _Where {
    name: string,
    googlePlaceId?: string,
    address?: Introspection.getValueType<typeof AddressDomain>,
    municipality?: Introspection.getValueType<typeof MunicipalityDomain>,
    geo?: Introspection.getValueType<typeof GeoShapeDomain>
};

class _WhereDomain extends Values.AggregateDomain<_Where> {
    constructor(canonicalName: string) {
        super(canonicalName, {
            name: Values.TheStringDomain,
            googlePlaceId: Values.TheStringDomain,
            address: AddressDomain,
            municipality: MunicipalityDomain,
            geo: GeoShapeDomain
        }, ['googlePlaceId', 'address', 'geo'])
    }
    asJSON() {
        const superAsJSON = () => super.asJSON();
        return {
            from(json: Introspection.JSONValue, options?: { onError?: (error: Introspection.Error) => void }): Partial<_Where>|null {
                if(typeof json === 'string') {
                    return {
                        name: json
                    }
                }
                return superAsJSON().from(json, options);
            }, to(value: Partial<_Where>): Introspection.JSONValue {
                if(value === null) return null;
                return superAsJSON().to(value);
            }
        }
    }
}

export const WhereDomain = new _WhereDomain(`${__moduleName__}.WhereDomain`);
directory.add(WhereDomain);

export interface _Radius {
    sense: 'inside'|'outside';
    miles?: number;
    kilometers?: number;
}

class _RadiusDomain extends Introspection.Domain<_Radius> {
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
/**
 * Radius around a point on the earth, as measured in surface distance.
 */
export const RadiusDomain = new _RadiusDomain(`${__moduleName__}.RadiusDomain`);
directory.add(RadiusDomain);

class _EventDomain extends Values.AggregateDomain<{
    where: Introspection.getValueType<typeof WhereDomain>,
    radius: Introspection.getValueType<typeof RadiusDomain>,
    when: Introspection.getValueType<typeof WhenDomain>
}> {
    constructor(canonicalName: string) {
        super(canonicalName, {
            where: WhereDomain,
            radius: RadiusDomain,
            when: WhenDomain
        })
    }
}

/**
 * Something that has happened, is happening, or will happen
 * at a known time and place.
 */
export const EventDomain = new _EventDomain(`${__moduleName__}.EventDomain`);
directory.add(EventDomain);
