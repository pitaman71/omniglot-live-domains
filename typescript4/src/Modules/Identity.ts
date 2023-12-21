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

export namespace IntroduceYourself {
    type TypeParams = {
        Binding: {
            me: Objects.Binding<string|object>
        },
        State: {},
        Direction: void,
        Status: 'complete'|'incomplete',
        Control: 'submit'|'undo'|'clear'|'cancel'|'close'|'start'|'resume'|'revise'
    }
    const StatusDomain = new Values.EnumerationDomain('complete', 'incomplete');

    export const Descriptor = new class _Descriptor extends Dialogues.Descriptor<TypeParams> {
        canonicalName = `${__moduleName__}.IntroduceYourself`;

        initialize() { return new class {
            binding(default_: Partial<TypeParams["Binding"]>): TypeParams["Binding"] {
                return { me: default_.me || Objects.Binding.from_bound('__me__') };
            }
            state(default_: Partial<TypeParams["State"]>): TypeParams["State"] {
                return {};
            }
        } }

        enter(entrances: Dialogues.Entrances<TypeParams>) {
        }

        build(builder: Dialogues.Builder<TypeParams>): void {
            const binding = { person: Objects.Binding.from_bound('__me__') };
            const personName = builder.streams().property(PersonName.Descriptor.bind(binding));
            const birthDate = builder.streams().property(BirthDate.Descriptor.bind(binding));
            const birthGender = builder.streams().property(BirthGender.Descriptor.bind(binding));
            const isBlank = Operations.Eval('Identity.IntroduceYourself', Values.TheBooleanDomain, 
                ({ personName, birthDate, birthGender }) => {
                    return personName === undefined && birthDate === undefined && birthGender === undefined
                },
                { 
                    personName: personName.scalar, 
                    birthDate: birthDate.scalar, 
                    birthGender: birthGender.scalar
                }
            );
            const isComplete = Operations.Eval('Identity.IntroduceYourself', Values.TheBooleanDomain, 
                ({ personName, birthDate, birthGender }) => {
                    return personName !== undefined && birthDate !== undefined && birthGender !== undefined
                },
                { 
                    personName: personName.scalar, 
                    birthDate: birthDate.scalar, 
                    birthGender: birthGender.scalar
                }
            );
            const isIncomplete = Operations.Eval('Identity.IntroduceYourself', Values.TheBooleanDomain, ({ isBlank, isComplete }) => !isBlank && !isComplete,
                { 
                    isBlank, isComplete
                }
            );

            builder.status({ 
                scalar: Operations.Eval('Identity.IntroduceYourself', StatusDomain, 
                    ({a}) => {
                        return a ? 'complete' : 'incomplete'
                    }, 
                    { a: isComplete })
            } as Streams.ValueStream<TypeParams["Status"]>);

            builder.when( new class {
                name = 'IntroduceYourself.Blank';
                condition() { return isBlank }
                then(builder: Dialogues.Builder<Dialogues.TypeParams>): void {
                    builder.headline(Operations.Scalar('Create your user account'));
                    builder.control({
                        name: 'start',
                        isEntrance: true
                    });
                    builder.detour(Why.Descriptor, ({}) => Why.Descriptor.bind({}));
                }
            })
            builder.when( new class {
                name = 'IntroduceYourself.Incomplete';
                condition() { return isIncomplete }
                then(builder: Dialogues.Builder<Dialogues.TypeParams>): void {
                    builder.headline(Operations.Scalar('Finish creating your user account'));
                    builder.control({
                        name: 'resume',
                        isEntrance: true
                    });
                    builder.detour(Why.Descriptor, ({}) => Why.Descriptor.bind({}));
                }
            })
            builder.when( new class {
                name = 'IntroduceYourself.Complete';
                condition() { return isComplete }
                then(builder: Dialogues.Builder<Dialogues.TypeParams>): void {
                    builder.headline(Operations.Scalar('Edit your user account'));
                    builder.control({
                        name: 'revise',
                        isEntrance: true
                    });
                }
            })

            builder.property(personName);
            builder.property(birthDate);
            builder.property(birthGender);
            
            builder.control({
                name: 'submit',
                enable: () => builder.zone().hasChanges('Identity.IntroduceYourself'),
                action: () => builder.zone().commitAll(),
                isExit: true
            });
            builder.control({
                name: 'undo',
                enable: () => builder.zone().hasChanges('Identity.IntroduceYourself'),
                action: () => builder.zone().revertAll()
            });

            builder.when( new class {
                name = 'IntroduceYourself.ShowCancelButton';
                condition() { return builder.zone().hasChanges('Identity.IntroduceYourself') }
                then(builder: Dialogues.Builder<Dialogues.TypeParams>): void {
                    builder.control({
                        name: 'cancel',
                        action: () => builder.zone().revertAll(),
                        isExit: true,
                        confirmation: Operations.Scalar('Discard all changes to your user account?')
                    });
                }
            })
            builder.when( new class {
                name = 'IntroduceYourself.ShowCloseButton';
                condition() { return Operations.Eval(this.name, Values.TheBooleanDomain, ({ anyChanges }) => !anyChanges , { anyChanges: builder.zone().hasChanges('Identity.IntroduceYourself') }) }
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
