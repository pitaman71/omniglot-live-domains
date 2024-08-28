import * as Elevated from '@pitaman71/omniglot-introspect';

import faker from 'faker';
import { Definitions, Objects, Properties, Relations, Values } from '@pitaman71/omniglot-live-data';

const __moduleName__ = 'omniglot-live-data.Modules.Documents';

export const directory = new Definitions.Directory();

export namespace Title {
    const __className__ = `${__moduleName__}.Title`;
    interface Data { title?: string };
    export type TypeParams = {
        Binding: { document: Objects.Binding<string|object> },
        Value: Data,
        Domain: Elevated.Domain<Data>
    }
    
    export const Descriptor = new class _Descriptor extends Properties.Descriptor<TypeParams> {
        canonicalName = __className__;
        build(builder: Properties.Builder<TypeParams>): void {
            builder.object('document');
            builder.measure(new Values.AggregateDomain<Data>({
                title: Values.TheStringDomain
            }));
            builder.scalar();
        }
    }
    directory.descriptors.properties.set(Descriptor.canonicalName, Descriptor);
}

export namespace Description {
    const __className__ = `${__moduleName__}.Description`;
    export interface BindingType extends Objects.BindingType {
        document: Objects.Binding<string|object>,
        markup: Objects.Binding<string|object>
    }
    export class Descriptor {
        canonicalName: string = __className__;
        build(builder: Relations.Builder<BindingType>): void {
            builder.object('document');
            builder.scalar();
            builder.object('markup');
        }
    }
}

export namespace Body {
    const __className__ = `${__moduleName__}.Body`;
    export interface BindingType extends Objects.BindingType {
        document: Objects.Binding<string|object>,
        markup: Objects.Binding<string|object>
    }
    export class Descriptor {
        canonicalName: string = __className__;
        build(builder: Relations.Builder<BindingType>): void {
            builder.object('document');
            builder.scalar();
            builder.object('markup');
        }
    }
}
