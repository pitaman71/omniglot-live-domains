import * as Introspection from 'typescript-introspection';

import { Definitions, Values } from '@pitaman71/omniglot-live-data';

const __moduleName__ = 'omniglot-live-domains.Media'
export const directory = new Definitions.Directory();

export const PixelDimensionsDomain = new Values.AggregateDomain(`${__moduleName__}.PixelDimensionsDomain`, {
    width: Values.TheNumberDomain,
    height: Values.TheNumberDomain
})
directory.add(PixelDimensionsDomain);

export interface _Asset {
    error?: string,
    mime?: string,
    pixelDimensions?: Introspection.getValueType<typeof PixelDimensionsDomain>,
    uri?: string,
    optimize?: Introspection.JSONValue   
}

/**
 * A media file, such as a video or image, along with critical
 * metadata.
 */
export const AssetDomain = new Values.AggregateDomain<_Asset>(`${__moduleName__}.AssetDomain`, {
    error: Values.TheStringDomain,
    mime: Values.TheStringDomain,
    pixelDimensions: PixelDimensionsDomain,
    uri: Values.TheStringDomain,
    optimize: Values.TheJSONDomain
}, ['optimize']);
directory.add(AssetDomain);
