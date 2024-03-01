import * as Elevated from '@pitaman71/omniglot-introspect';

import { Definitions } from '@pitaman71/omniglot-live-data';

import { Base } from '../Domains';

const __moduleName__ = 'omniglot-live-data.Modules.Media'

export const directory = new Definitions.Directory();

interface _Asset {
    mime?: string,
    pixelDimensions?: { width: number, height: number}, 
    uri?: string
};

export const AssetDomain = new class _EventDomain extends Elevated.Domain<Base.Parseable & _Asset> {
    asJSON() {
        return {
            from(json: any): Base.Parseable & _Asset {
                const error = (json.pixelDimensions !== undefined && (json.pixelDimensions.width === undefined || json.pixelDimensions.height === undefined)) ? 
                    'Expected JSON to contain properties { pixelDimensions { width, number } }' : undefined;
                return (
                    !!error ? { error } : {
                        mime: json.mime,
                        pixelDimensions: !json.pixelDimensions ? undefined : { width: json.pixelDimensions.width, height: json.pixelDimensions.height },
                        uri: json.uri
                    }
                );
            },
            to(value: Base.Parseable & _Asset) {
                return JSON.stringify({
                    mime: value.mime,
                    pixelDimensions: value.pixelDimensions === undefined ? undefined : { width: value.pixelDimensions.width, height: value.pixelDimensions.height }
                });
            }
        }
    }
    asString(format?: string) { 
        const domain = this;
        return {
            from(text: string): Base.Parseable & _Asset { 
                try {
                    const descriptor = JSON.parse(text);
                    return { text, ...domain.asJSON().from(descriptor) };
                } catch(e) {
                    return {
                        text,
                        error: 'unable to parse JSON as Tasks.Descriptor'
                    };
                }
            },
            to(value: Base.Parseable & _Asset) { return domain.asJSON().to(value) }
        };
    }
    asEnumeration(maxCount: number) { return undefined }
    asColumns() { return undefined }
    cmp(a: Base.Parseable & _Asset, b: Base.Parseable & _Asset) {
        return undefined;
    }
};
