import * as Elevated from '@pitaman71/omniglot-introspect';
import { Definitions, Dialogues, Objects, Operations, Properties, Streams, Values } from '@pitaman71/omniglot-live-data';

import * as Temporal from '../Domains/Temporal';

const __moduleName__ = 'omniglot-live-data.Modules.Identity';

export const directory = new Definitions.Directory();

export namespace PersonName {
    interface Data { familyName?: string, givenName?: string };
    export type TypeParams = {
        Binding: { person: Objects.Binding<string|object> },
        Value: Data,
        Domain: Elevated.Domain<Data>
    }
    
    export const Descriptor = new class _Descriptor extends Properties.Descriptor<TypeParams> {
        canonicalName = `${__moduleName__}.PersonName`
        build(builder: Properties.Builder<TypeParams>): void {
            builder.object('person');
            builder.measure(new Elevated.Aggregate<Data>({
                'givenName': Values.TheStringDomain,
                'familyName': Values.TheStringDomain
            }));
            builder.scalar();
        }
    }
    directory.descriptors.properties.set(Descriptor.canonicalName, Descriptor);
}

export namespace BirthDate {
    export type TypeParams = {
        Binding: { person: Objects.Binding<string|object> },
        Value: Temporal._Date,
        Domain: Elevated.Domain<Temporal._Date>
    } 
    export const Descriptor = new class _Descriptor extends Properties.Descriptor<TypeParams> {
        canonicalName = `${__moduleName__}.BirthDate`
        build(builder: Properties.Builder<TypeParams>): void {
            builder.object('person');
            builder.measure(Temporal.DateDomain);
            builder.scalar();
        }
    }
    directory.descriptors.properties.set(Descriptor.canonicalName, Descriptor);
}

export namespace BirthGender {
    export type TypeParams = {
        Binding: { person: Objects.Binding<string|object> },
        Value: string,
        Domain: Elevated.Domain<string>
    };
    export const Descriptor = new class _Descriptor extends Properties.Descriptor<TypeParams> {
        static values = new Values.EnumerationDomain('xx', 'xy', 'other');
        canonicalName = `${__moduleName__}.BirthGender`
        build(builder: Properties.Builder<TypeParams>): void {
            builder.object('person');
            builder.measure(_Descriptor.values);
            builder.scalar();
        }
    }
    directory.descriptors.properties.set(Descriptor.canonicalName, Descriptor);
}

export namespace Why {
    type TypeParams = {
        Binding: {},
        State: {},
        Direction: void,
        Status: void,
        Control: 'back'
    }
    export const Descriptor = new class _Descriptor extends Dialogues.Descriptor<TypeParams> {
        canonicalName = `${__moduleName__}.Why`;

        initialize() { return new class {
            binding(default_: Partial<{}>): {} {
                return { };
            }
            state(default_: Partial<{}>): {} {
                return {};
            }
        } }

        enter(entrances: Dialogues.Entrances<TypeParams>) {
        }

        build(builder: Dialogues.Builder<TypeParams>): void {
            builder.headline(Operations.Scalar('Why do I need a user account?'));
            builder.paragraphs(
                Operations.Scalar('In order to publish art pieces that you post here, or to validate your claim to ownership of pieces posted here, the system must be able to know your identity.'),
                Operations.Scalar('When you first use this app, or if you uninstall or re-install this app, or if you use "clear browser data", you will need to introduce yourself.'),
                Operations.Scalar('Otherwise, you should not have to introduce yourself more than once on the same device.')
            );
            builder.control({
                name: 'back',
                isExit: true
            });
        }
    }
    directory.descriptors.dialogues.set(Descriptor.canonicalName, Descriptor);
}

