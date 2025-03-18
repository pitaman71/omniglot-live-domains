// src/GeoJSONSchemas.ts
import { z } from 'zod';

// Position: [longitude, latitude, altitude?]
const Position = z.tuple([
  z.number(), // longitude
  z.number(), // latitude
  z.number().optional() // optional altitude
]);

// BoundingBox: [west, south, east, north] or [west, south, min altitude, east, north, max altitude]
const BoundingBox = z.union([
  z.tuple([z.number(), z.number(), z.number(), z.number()]),
  z.tuple([z.number(), z.number(), z.number(), z.number(), z.number(), z.number()])
]);

// Base GeoJSON object properties shared by all types
const GeoJSONBase = z.object({
  bbox: BoundingBox.optional(),
  properties: z.record(z.any()).optional(),
});

// Point
export const PointSchema = GeoJSONBase.extend({
  type: z.literal("Point"),
  coordinates: Position,
});
export type Point = z.infer<typeof PointSchema>;

// MultiPoint
export const MultiPointSchema = GeoJSONBase.extend({
  type: z.literal("MultiPoint"),
  coordinates: z.array(Position),
});
export type MultiPoint = z.infer<typeof MultiPointSchema>;

// LineString
export const LineStringSchema = GeoJSONBase.extend({
  type: z.literal("LineString"),
  coordinates: z.array(Position).min(2),
});
export type LineString = z.infer<typeof LineStringSchema>;

// MultiLineString
export const MultiLineStringSchema = GeoJSONBase.extend({
  type: z.literal("MultiLineString"),
  coordinates: z.array(z.array(Position).min(2)),
});
export type MultiLineString = z.infer<typeof MultiLineStringSchema>;

// Polygon (array of linear rings, where first ring is exterior and rest are holes)
// Each linear ring is a closed LineString with 4+ positions where the first and last positions are identical
const LinearRing = z.array(Position).refine(
  (arr) => arr.length >= 4 && 
           arr[0][0] === arr[arr.length-1][0] && 
           arr[0][1] === arr[arr.length-1][1],
  { message: "A linear ring must have at least 4 positions with the first and last positions being identical" }
);

export const PolygonSchema = GeoJSONBase.extend({
  type: z.literal("Polygon"),
  coordinates: z.array(LinearRing),
});
export type Polygon = z.infer<typeof PolygonSchema>;

// MultiPolygon
export const MultiPolygonSchema = GeoJSONBase.extend({
  type: z.literal("MultiPolygon"),
  coordinates: z.array(z.array(LinearRing)),
});
export type MultiPolygon = z.infer<typeof MultiPolygonSchema>;

// Important: Break the circular reference with a proper recursive type
// First define a schema for GeometryCollection without its content
const geometryCollectionDef = GeoJSONBase.extend({
  type: z.literal("GeometryCollection"),
});

// Then create a recursive type using z.lazy
// This is the key pattern for self-referential types in Zod
export const GeometrySchema: z.ZodType = z.lazy(() => 
  z.discriminatedUnion("type", [
    PointSchema,
    MultiPointSchema,
    LineStringSchema,
    MultiLineStringSchema, 
    PolygonSchema,
    MultiPolygonSchema,
    geometryCollectionDef.extend({
      geometries: z.array(z.lazy(() => GeometrySchema))
    })
  ])
);

// Now extract the full GeometryCollectionSchema for export
export const GeometryCollectionSchema = geometryCollectionDef.extend({
  geometries: z.array(GeometrySchema)
});
export type GeometryCollection = z.infer<typeof GeometryCollectionSchema>;
export type Geometry = z.infer<typeof GeometrySchema>;

// Feature
export const FeatureSchema = GeoJSONBase.extend({
  type: z.literal("Feature"),
  geometry: GeometrySchema.nullable(),
  id: z.union([z.string(), z.number()]).optional(),
});
export type Feature = z.infer<typeof FeatureSchema>;

// FeatureCollection
export const FeatureCollectionSchema = GeoJSONBase.extend({
  type: z.literal("FeatureCollection"),
  features: z.array(FeatureSchema),
});
export type FeatureCollection = z.infer<typeof FeatureCollectionSchema>;

// GeoJSON - Union of all GeoJSON object types
export const GeoJSONSchema = z.discriminatedUnion("type", [
  PointSchema,
  MultiPointSchema,
  LineStringSchema,
  MultiLineStringSchema,
  PolygonSchema,
  MultiPolygonSchema,
  GeometryCollectionSchema,
  FeatureSchema,
  FeatureCollectionSchema,
]);
export type GeoJSON = z.infer<typeof GeoJSONSchema>;