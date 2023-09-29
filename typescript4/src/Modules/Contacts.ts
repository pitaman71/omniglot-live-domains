import * as Elevated from '@pitaman71/omniglot-introspect';
import { Definitions, Objects, Properties, Values } from '@pitaman71/omniglot-live-data';

const __moduleName__ = 'omniglot-live-data.Modules.Contacts';

export const directory = new Definitions.Directory();

export namespace Email {
    export interface Data { address?: string };
    export type TypeParams = {
        Binding: { person: Objects.Binding<string> },
        Value: Data,
        Domain: Elevated.Domain<Data>
    }

    export const Descriptor = new class _Descriptor extends Properties.Descriptor<TypeParams> {
        canonicalName = `${__moduleName__}.Email`
        build(builder: Properties.Builder<TypeParams>): void {
            builder.object('person');
            builder.measure(new Elevated.Aggregate<Data>({
                address: Values.TheStringDomain
            }));
            builder.scalar();
        }
    }();
    directory.descriptors.properties.set(Descriptor.canonicalName, Descriptor);
}
