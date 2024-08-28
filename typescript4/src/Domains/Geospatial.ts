import * as Elevated from '@pitaman71/omniglot-introspect';
import { Values } from '@pitaman71/omniglot-live-data';

export class Feature {
    feature: GeoJSON.Feature;
    private constructor(feature: GeoJSON.Feature) { this.feature = feature; }

    static fromFeature(feature: GeoJSON.Feature) { return new Feature(feature) }
}

export namespace Units {
    export type Distance = 'mi'|'km';
}

export interface _Distance {
    units: Units.Distance;
    distance: number;
}

export function makeDistanceDomain(units: Units.Distance, min: number, max: number, step: number) {
    return new Values.AggregateDomain<_Distance>({ 
        units: new Values.EnumerationDomain(units),
        distance: new Values.RangeDomain(min, max, step)
    });
}
