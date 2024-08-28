import * as Elevated from '@pitaman71/omniglot-introspect';

import { Definitions, Values } from '@pitaman71/omniglot-live-data';

const __moduleName__ = 'omniglot-live-data.Modules.Media'

export const directory = new Definitions.Directory();

export const PixelDimensionsDomain = new Values.AggregateDomain({
    width: Values.TheNumberDomain,
    height: Values.TheNumberDomain
})

export interface _Asset {
    error?: string,
    mime?: string,
    pixelDimensions?: Elevated.getValueType<typeof PixelDimensionsDomain>,
    uri?: string,
    optimize?: Elevated.JSONValue   
}

export const AssetDomain = new Values.AggregateDomain<_Asset>({
    mime: Values.TheStringDomain,
    pixelDimensions: PixelDimensionsDomain,
    uri: Values.TheStringDomain,
    optimize: Values.TheJSONDomain
}, ['optimize']);
