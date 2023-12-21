import * as Elevated from '@pitaman71/omniglot-introspect';
import  { Definitions, Dialogues, Objects, Operations, Properties, Relations, Streams, Values } from '@pitaman71/omniglot-live-data';

import * as Domains from '../Domains';
import { Identity } from '.';

const __moduleName__ = 'omniglot-live-data.Modules.Profile';

export const directory = new Definitions.Directory();

export namespace Handle {
    export type TypeParams = { 
        Binding: { profiled: Objects.Binding<string|object> },
        Value: string,
        Domain: Elevated.Domain<string>
    };
    export const Descriptor =  new class _Descriptor extends Properties.Descriptor<TypeParams> {
        canonicalName = `${__moduleName__}.Handle`
        build(builder: Properties.Builder<TypeParams>): void {
            builder.object('profiled');
            builder.measure(Values.TheStringDomain);
            builder.scalar();
        }
    }
    directory.descriptors.properties.set(Descriptor.canonicalName, Descriptor);
}

export namespace Title {
    export type TypeParams = { 
        Binding: { profiled: Objects.Binding<string|object> },
        Value: string,
        Domain: Elevated.Domain<string>
    };
    export const Descriptor =  new class _Descriptor extends Properties.Descriptor<TypeParams> {
        canonicalName = `${__moduleName__}.Title`
        build(builder: Properties.Builder<TypeParams>): void {
            builder.object('profiled');
            builder.measure(Values.TheStringDomain);
            builder.scalar();
        }
    }
    directory.descriptors.properties.set(Descriptor.canonicalName, Descriptor);
}

export namespace Description {
    export type TypeParams = { 
        Binding: { profiled: Objects.Binding<string|object> },
        Value: string,
        Domain: Elevated.Domain<string>
    };
    export const Descriptor =  new class _Descriptor extends Properties.Descriptor<TypeParams> {
        canonicalName = `${__moduleName__}.Description`
        build(builder: Properties.Builder<TypeParams>): void {
            builder.object('profiled');
            builder.measure(Values.TheStringDomain);
            builder.scalar();
        }
    }
    directory.descriptors.properties.set(Descriptor.canonicalName, Descriptor);
}

export namespace ToProfilePhoto {
    export interface BindingType extends Objects.BindingType {
        person: Objects.Binding<string|object>, image: Objects.Binding<string|object>
    }
    export const Descriptor = new class _Descriptor extends Relations.Descriptor<BindingType> {
        canonicalName = `${__moduleName__}.ToProfilePhoto`
        build(builder: Relations.Builder<BindingType>): void {
            builder.object('person');
            builder.scalar();
            builder.object('image');
        }
    }
    directory.descriptors.relations.set(Descriptor.canonicalName, Descriptor);
}

export namespace ToMyBiography {
    export interface BindingType extends Objects.BindingType { person: Objects.Binding<string|object>, document: Objects.Binding<string|object> }
    export const Descriptor = new class _Descriptor extends Relations.Descriptor<BindingType> {
        canonicalName = `${__moduleName__}.ToMyBiography`
        build(builder: Relations.Builder<BindingType>): void {
            builder.object('person');
            builder.scalar();
            builder.object('document');
        }   
    }
    directory.descriptors.relations.set(Descriptor.canonicalName, Descriptor);
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
        canonicalName = `${__moduleName__}.IntroduceYourself.Why`;

        initialize() { return new class {
            binding(default_: Partial<TypeParams["Binding"]>): TypeParams["Binding"] {
                return { };
            }
            state(default_: Partial<TypeParams["Binding"]>): TypeParams["Binding"] {
                return {};
            }
        } }

        enter(entrances: Dialogues.Entrances<TypeParams>) {}

        build(builder: Dialogues.Builder<TypeParams>): void {
            builder.headline(Operations.Scalar('Why do I need a profile?'));
            builder.paragraphs(
                Operations.Scalar('Create a public profile that contains what other users may see.'),
                Operations.Scalar(
                    'In order to publish art pieces that you post here, or to validate your claim to ownership of pieces posted here, '+
                    'you will need to create a profile. You cannot get paid for views of your art pieces and we cannot validate '+
                    'ownership claims you make to art pieces posted here until you have a profile. '
                ),
                Operations.Scalar(
                    'With the one exception of the name ("handle") of the profile, you can choose to make private any part of your '+
                    'profile. By default all sections of your profile are shared publicly. '
                ),
                Operations.Scalar(
                    'Your profile has a "handle" that you create and which others can use to mention you in comments and posts. '+
                    'Your profile handle may contain your real name or it may be a pseudonym. '+
                    'Your profile handle cannot match the handle of any other profile in our community. '+
                    'You an change your profile name at any time. '+
                    'The name of your profile is the only part of your profile that you cannot hide. '
                ),
                Operations.Scalar(
                    'Your profile can contain one or more preview photos of you and/or your artwork, and a biography. '+
                    'You may insert hashtags in your biography to attract users to discover and visit your profile. '
                ),
                Operations.Scalar(
                    'You can restrict any section of your profile to be shared with the general public, friends of friends, friends only, or private. '+
                    'Sections marked private are hidden from everyone other than yourself. '+
                    'Sections marked public are visible to anyone on the web. '+
                    'At any time you can return here to change the sharing mode for any section of your profile. '
                )
            );
            builder.control({
                name: 'back',
                isExit: true
            });
        }
    }
    directory.descriptors.dialogues.set(Descriptor.canonicalName, Descriptor);
}

export namespace SetupYourProfile {
    type TypeParams = {
        Binding: {
            me: Objects.Binding<string|object>
        },
        State: {},
        Direction: void,
        Status: 'complete'|'incomplete',
        Control: 'submit'|'undo'|'clear'|'cancel'|'close'|'start'|'resume'|'revise'
    };
    const StatusDomain = new Values.EnumerationDomain('complete', 'incomplete');

    export const Descriptor = new class _Descriptor extends Dialogues.Descriptor<TypeParams> {
        canonicalName = `${__moduleName__}.SetupYourProfile`;

        initialize() { return new class {
            binding(default_: Partial<TypeParams["Binding"]>): TypeParams["Binding"] {
                return { me: default_.me || Objects.Binding.from_bound('__me__')};
            }
            state(default_: Partial<TypeParams["State"]>): TypeParams["State"] {
                return {};
            }
        } }

        enter(entrances: Dialogues.Entrances<TypeParams>) {
        }

        build(builder: Dialogues.Builder<TypeParams>): void {
            let personName = builder.streams().property(Identity.PersonName.Descriptor.bind({ person: builder.instance().binding.me }));
            const handle = builder.streams().property(Handle.Descriptor.bind({ profiled: builder.instance().binding.me }));
            const avatarImage = builder.streams().relation(ToProfilePhoto.Descriptor.bindAnchor({ person: builder.instance().binding.me }));
            const biography = builder.streams().relation(ToMyBiography.Descriptor.bindAnchor({ person: builder.instance().binding.me }));

            const isBlank = Operations.Eval('Profile.ts:185', Values.TheBooleanDomain, ({ personName, handle, avatarImage, biography }) => personName === undefined && handle === undefined && avatarImage === undefined && biography === undefined, 
                { 
                    personName: personName.scalar, 
                    handle: handle.scalar, 
                    avatarImage: Operations.Reduce(
                            'Profile.ts:190',
                            avatarImage, 
                            () => 0, 
                            (_accum, value_) => _accum + 1, 
                            (_accum, value_) => _accum - 1, 
                            Values.Count
                        ),
                    biography: Operations.Reduce(
                            'Profile.ts:198',
                            biography,
                            () => 0, 
                            (_accum, value_) => _accum + 1, 
                            (_accum, value_) => _accum - 1, 
                            Values.Count
                        )
                }
            );
            const isComplete = Operations.Eval(
                'Profile.ts:208',
                Values.TheBooleanDomain, ({ personName, handle, avatarImage, biography }) => personName !== undefined && handle !== undefined && avatarImage !== undefined && biography !== undefined, 
                { 
                    personName: personName.scalar, 
                    handle: handle.scalar, 
                    avatarImage: Operations.Reduce(
                            'Profile.ts:212',
                            avatarImage, 
                            () => 0, 
                            (_accum, value_) => _accum + 1, 
                            (_accum, value_) => _accum - 1, 
                            Values.Count
                        ),
                    biography: Operations.Reduce(
                            'Profile.ts:220',
                            biography,
                            () => 0, 
                            (_accum, value_) => _accum + 1, 
                            (_accum, value_) => _accum - 1, 
                            Values.Count
                        )
                }
            );
            const isIncomplete = Operations.Eval(
                'Profile.ts:230',
                Values.TheBooleanDomain, ({ isBlank, isComplete }) => !isBlank && !isComplete,
                { 
                    isBlank,
                    isComplete
                }
            );

            builder.headline(
                Operations.Scalar('Setup your profile')
            );

            builder.status({ 
                scalar: Operations.Eval(
                    'Profile.ts:246',
                    StatusDomain, 
                    ({a}) => {
                        return a ? 'complete' : 'incomplete'
                    }, 
                    { a: isComplete })
            } as Streams.ValueStream<TypeParams["Status"], any>);
            builder.when( new class {
                name = 'SetupYourProfile.Blank';
                condition() { return isBlank }
                then(builder: Dialogues.Builder<Dialogues.TypeParams>): void {
                    builder.control({
                        name: 'start',
                        isEntrance: true
                    });
                    builder.detour(Why.Descriptor, ({binding, state}) => Why.Descriptor.bind({}));
                }
            })
            builder.when( new class {
                name = 'SetupYourProfile.Incomplete';
                condition() { return isIncomplete }
                then(builder: Dialogues.Builder<Dialogues.TypeParams>): void {
                    builder.control({
                        name: 'resume',
                        isEntrance: true
                    });
                    builder.detour(Why.Descriptor, ({binding, state}) => Why.Descriptor.bind({}));
                }
            })
            builder.when( new class {
                name = 'SetupYourProfile.Complete';
                condition() { return isComplete }
                then(builder: Dialogues.Builder<Dialogues.TypeParams>): void {
                    builder.control({
                        name: 'revise',
                        isEntrance: true
                    });
                }
            })

            personName = builder.streams().property(Identity.PersonName.Descriptor.bind({ person: builder.instance().binding.me }));

            builder.property(personName);
            builder.property(handle);
            builder.relation(avatarImage);
            builder.relation(biography);
            const statefuls = [
                ...Streams.Stateful.fromPropertyStreams(personName, handle),
                ...Streams.Stateful.fromRelationStreams(avatarImage, biography)
            ];

            builder.control({
                name: 'submit',
                enable: () => builder.zone().hasChanges('Profile.SetupYourProfile.submit'),
                action: () => builder.zone().commitAll(),
                isExit: true
            });
            builder.control({
                name: 'undo',
                enable: () => builder.zone().hasChanges('Profile.SetupYourProfile.undo'),
                action: () => builder.zone().revertAll()
            });

            builder.when( new class {
                name = 'SetupYourProfile.ShowCancelButton';
                condition() { return builder.zone().hasChanges(this.name) }
                then(builder: Dialogues.Builder<Dialogues.TypeParams>): void {
                    builder.control({
                        name: 'cancel',
                        action: () => builder.zone().revertAll(),
                        isExit: true,
                        confirmation: Operations.Scalar('Discard all changes to your profile? ')
                    });
                }
            })
            builder.when( new class {
                name = 'SetupYourProfile.ShowCloseButton';
                condition() { return Operations.Eval(this.name, Values.TheBooleanDomain, ({ a }) => !a , { a: builder.zone().hasChanges(this.name) }) }
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
