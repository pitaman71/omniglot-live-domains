/**
 * Introspectable domain models representing logistical information;
 * e.g. where and when things happended, are happening, or will
 * happen. 
 */
import * as Introspection from 'typescript-introspection';
import { Definitions, Values } from '@pitaman71/omniglot-live-data';
import { _When, WhenDomain } from './Temporal';
import { PointSchema } from './GeoJSONSchemas';

const __moduleName__ = 'omniglot-live-domains.Geo';
export const directory = new Definitions.Directory();

export interface _Point { 
    lat: number, 
    lng: number 
}

export interface _Polygon {
    include: _Point[];
    exclude: _Point[][]; 
}

interface Utils<X, Y> {
    Transcoder: Introspection.Transcoder<X,Y>
}

const Position: Utils<GeoJSON.Position, _Point> = {
    Transcoder: {
        from: (x: null|GeoJSON.Position) => (!x ? null : { lat: x[0], lng: x[1] }),
        to: x => (!x ? null : [x.lat, x.lng])
    }
};

const PositionArray: Utils<GeoJSON.Position[], _Point[]> = {
    Transcoder: {
        from: x => (!x ? null : x.reduce<_Point[]>(( points, position) => {
            const y: _Point|null = Position.Transcoder.from(position);
            if(y === null) return points;
            return [...points, y];
        }, [])),
        to: x => (!x ? null : x.reduce<GeoJSON.Position[]>(( positions, point) => {
            const y: GeoJSON.Position|null = Position.Transcoder.to(point);
            if(y === null) return positions;
            return [...positions, y];
        }, [] ))
    }
};


/**
 * Cartesian global coordinates in latitude, longitude format
 */
class _PointDomain extends Values.AggregateDomain<_Point> {
    constructor() {
        super(`${__moduleName__}.PointDomain`, { 
            lat: Values.TheNumberDomain, 
            lng: Values.TheNumberDomain
        });
    }
    asJSON() {
        return {
            from: (x: Introspection.JSONValue) => {
                if(x === null) return null; 
                try {
                    const y = PointSchema.parse(x);
                    return Position.Transcoder.from([ y.coordinates[0], y.coordinates[1] ]);
                } catch(err) {
                    return null;
                }                
            },
            to: (x: _Point|null) => {
                const coordinates = Position.Transcoder.to(x);
                if(coordinates === null) return null;
                return { type: 'Point' as const, coordinates };
            }
        }
    }
};
export const PointDomain = new _PointDomain();
directory.add(PointDomain);

export const ShapeDomain = new Values.UnionDomain(`${__moduleName__}.ShapeDomain`, 'type', {
    Point: PointDomain
});
directory.add(ShapeDomain);

// class _PolygonDomain extends Introspection.Domain<_Polygon> {
//     constructor() {
//         super(`${__moduleName__}.PolygonDomain`, PointDomain);
//     }
//     asGeoJSON(format?: { "array": boolean, "object": boolean, "string": boolean }) {
//         return {
//             polygon() { return {
//                 from: (x: Polygon|null): _Polygon|null => {
//                     if(x === null) return null;
//                     const include = PositionListTranscoder.from(x.coordinates[0]);
//                     const exclude = x.coordinates.slice(1).reduce<_Point[][]>((exclude, positionList) => {
//                         const y: _Point[]|null = PositionListTranscoder.from(positionList);
//                         if(y === null) return exclude;
//                         return [ ...exclude, y ];
//                     }, []);
//                     if(!include) return null;
//                     return { include, exclude };
//                 },
//                 to: (x: _Polygon|null): Polygon|null => {
//                     if(x === null) return null;
//                     const include = PositionListTranscoder.to(x.include);
//                     const exclude = x.exclude.reduce<Position[][]>((exclude, pointList) => {
//                         if(pointList === null) return exclude;
//                         const y: Position[]|null = PositionListTranscoder.to(pointList);
//                         if(y === null) return exclude;
//                         return [...exclude, y];
//                     }, []);
//                     if(include === null) return null;
//                     return { 
//                         type: 'Polygon' as const, 
//                         coordinates: [ include, ...exclude ]
//                     }
//                 }
//             }},
//             point() { return undefined },
//             envelope() { return undefined },
//             circle() { return undefined }
//         }
//     }
// };

// /**
//  * Shape on the surface of the globe as a single point or cloud of points.
//  */
// export const ShapeDomain = new Values.AggregateDomain(`${__moduleName__}.ShapeDomain`, { 
//     point: PointDomain,
//     cloud: new Values.ArrayDomain(`${__moduleName__}.ShapeDomain.cloud`, PointDomain)
// });
// directory.add(ShapeDomain);
