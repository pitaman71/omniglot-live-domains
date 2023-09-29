import faker from 'faker';

import * as Elevated from '@pitaman71/omniglot-introspect';

import { Definitions, Dialogues, Objects, Operations, Properties, Relations, Streams, Values } from '@pitaman71/omniglot-live-data';

import * as Profile from './Profile';

const __moduleName__ = 'omniglot-live-data.Modules.Media'

export const directory = new Definitions.Directory();

export namespace ImageFormat {
    export interface Data { 
        pixelSize: { height: number, width: number },
        durationSeconds: number
    };
    export type TypeParams = {
        Binding: { asset: Objects.Binding<string> },
        Value: Data,
        Domain: Elevated.Domain<Data>
    }
    
    export const Descriptor = new class _Descriptor extends Properties.Descriptor<TypeParams> {
        static pixelSize = new Elevated.Aggregate({
            height: new Values.RangeDomain(16, 2560, 16),
            width: new Values.RangeDomain(16, 2560, 16)
        });
        canonicalName = `${__moduleName__}.Format`
        build(builder: Properties.Builder<TypeParams>): void {
            builder.object('asset');
            builder.measure(new Elevated.Aggregate<Data>({
                'pixelSize': _Descriptor.pixelSize
            }));
            builder.scalar();
        }
    }
    directory.descriptors.properties.set(Descriptor.canonicalName, Descriptor);
}

export namespace ImageData {
    export interface Data {
        imageData?: string,
        imageUrl?: string,
        videoUrl?: string
    }

    export type TypeParams = {
        Binding: { asset: Objects.Binding<string> },
        Value: Data,
        Domain: Elevated.Domain<Data>
    }

    export const Descriptor = new class _Descriptor extends Properties.Descriptor<TypeParams> {
        canonicalName = `${__moduleName__}.ImageData`
        build(builder: Properties.Builder<TypeParams>): void {
            builder.object('asset');
            builder.measure(new Elevated.Aggregate({ 
                imageData: Values.TheStringDomain,
                imageUrl: Values.TheStringDomain,
                videoUrl: Values.TheStringDomain
            }));
            builder.scalar();
        }
    }

    export function makeDomain(maker: () => ImageData.Data) {
        return new class extends Elevated.Domain<ImageData.Data> {
            asString() {
                const target=this;
                return new class {
                    from(text: string) { 
                        if(text.startsWith('data:')) return {
                            imageData: text.slice(5)
                        }; 
                        if(text.startsWith('image:')) return {
                            imageUrl: text.slice(6)
                        }; 
                        if(text.startsWith('video:')) return {
                            videoUrl: text.slice(6)
                        }; 
                        return {};
                    }
                    to(value: ImageData.Data) { 
                        if(value.imageData) return `data:${value.imageData}`;
                        if(value.imageUrl) return `image:${value.imageUrl}`;
                        if(value.videoUrl) return `video:${value.videoUrl}`;
                        return '';
                    }
                }
            }
            asEnumeration(maxCount: number) { return undefined }
            asColumns() { return undefined; }
        
            cmp(a: ImageData.Data, b:ImageData.Data) { 
                if(a.imageData && !b.imageData) return -1;
                if(!a.imageData && b.imageData) return +1;
                if(a.imageData && b.imageData) return a.imageData < b.imageData ? -1 : a.imageData > b.imageData ? +1 : 0;

                if(a.imageUrl && !b.imageUrl) return -1;
                if(!a.imageUrl && b.imageUrl) return +1;
                if(a.imageUrl && b.imageUrl) return a.imageUrl < b.imageUrl ? -1 : a.imageUrl > b.imageUrl ? +1 : 0;

                if(a.videoUrl && !b.videoUrl) return -1;
                if(!a.videoUrl && b.videoUrl) return +1;
                if(a.videoUrl && b.videoUrl) return a.videoUrl < b.videoUrl ? -1 : a.videoUrl > b.videoUrl ? +1 : 0;

                return 0;
            }

            make() { return maker() }
            enumerable(maxCount: number) { return false }
            *enumerate(maxCount: number, ascending: boolean) { }
            random(...history: string[]) { 
                return maker();
            }
        }();
    }
    directory.descriptors.properties.set(Descriptor.canonicalName, Descriptor);
}


export namespace ManageAsset {
    export type TypeParams = {
        Binding: {
            asset: Objects.Binding<string>
        },
        State: {},
        Direction: void,
        Status: 'complete'|'incomplete',
        Control: 'submit'|'cancel'|'close'
    }

    export const Descriptor = new class _Descriptor extends Dialogues.Descriptor<TypeParams> {
        canonicalName = `${__moduleName__}.ManageAsset`;

        initialize() { return new class {
            binding(default_: Partial<TypeParams["Binding"]>): TypeParams["Binding"] {
                return { asset: default_.asset || Objects.Binding.from_bound(Elevated.factories.makeObjectId()) };
            }
            state(default_: Partial<TypeParams["State"]>): TypeParams["State"] {
                return {};
            }
        } }

        enter(entrances: Dialogues.Entrances<TypeParams>) {
            entrances.in(Profile.ToProfilePhoto.Descriptor, ({ binding }) => 
                this.bind({ asset: binding.image })
            );
        }

        build(builder: Dialogues.Builder<TypeParams>): void {
            let imageData = builder.streams().property(ImageData.Descriptor.bind({ asset: builder.instance().binding.asset }));
            builder.property(imageData);
            const statefuls = [
                ...Streams.Stateful.fromPropertyStreams(imageData)
            ];

            builder.when( new class {
                name = 'ManageAsset.ShowSubmitButton';
                condition() { return builder.zone().hasChanges() }
                then(builder: Dialogues.Builder<Dialogues.TypeParams>): void {
                    builder.control({
                        name: 'submit',
                        action: () => builder.zone().commitAll(),
                        isExit: true
                    });
                }
            })
            builder.when( new class {
                name = 'ManageAsset.ShowCancelButton';
                condition() { return builder.zone().hasChanges() }
                then(builder: Dialogues.Builder<Dialogues.TypeParams>): void {
                    builder.control({
                        name: 'cancel',
                        action: () => builder.zone().revertAll(),
                        isExit: true,
                        confirmation: Operations.Scalar('Discard all changes to your profile photo?')
                    });
                }
            })
            builder.when( new class {
                name = 'ManageAsset.ShowCloseButton';
                condition() { return Operations.Eval(Values.TheBooleanDomain, ({ a }) => !a , { a: builder.zone().hasChanges() }) }
                then(builder: Dialogues.Builder<Dialogues.TypeParams>): void {
                    builder.control({
                        name: 'close',
                        isExit: true
                    });
                }
            })
        }
    }();
    directory.descriptors.dialogues.set(Descriptor.canonicalName, Descriptor);
}
