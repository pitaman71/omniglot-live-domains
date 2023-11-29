import * as Elevated from '@pitaman71/omniglot-introspect';
import { Definitions, Objects, Properties, Relations, Values } from '@pitaman71/omniglot-live-data';

import { Temporal } from '../Domains';
import faker from 'faker';

const __moduleName__ = 'omniglot-live-data.Modules.Conversations';

export const directory = new Definitions.Directory();

export namespace CommentHasAuthor {
    export type BindingType = {
        comment: Objects.Binding<string|object>,
        author: Objects.Binding<string|object>
    }

    export const Descriptor = new class _Descriptor extends Relations.Descriptor<BindingType> {
        canonicalName = `${__moduleName__}.CommentHasAuthor`
        build(builder: Relations.Builder<BindingType>): void {
            builder.object('comment');
            builder.scalar();
            builder.object('author');
        }
    }();
    directory.descriptors.relations.set(Descriptor.canonicalName, Descriptor);
}

export namespace CommentHasSubject {
    export type BindingType = {
        comment: Objects.Binding<string|object>,
        subject: Objects.Binding<string|object>
    }

    export const Descriptor = new class _Descriptor extends Relations.Descriptor<BindingType> {
        canonicalName = `${__moduleName__}.CommentHasSubject`
        build(builder: Relations.Builder<BindingType>): void {
            builder.object('comment');
            builder.scalar();
            builder.object('subject');
        }
    }();
    directory.descriptors.relations.set(Descriptor.canonicalName, Descriptor);
}

export namespace SubjectHasComment {
    export type BindingType = {
        subject: Objects.Binding<string|object>,
        comment: Objects.Binding<string|object>
    }

    export const Descriptor = new class _Descriptor extends Relations.Descriptor<BindingType> {
        canonicalName = `${__moduleName__}.SubjectHasComment`
        build(builder: Relations.Builder<BindingType>): void {
            builder.object('subject');
            builder.scalar();
            builder.object('comment');
        }
    }();
    directory.descriptors.relations.set(Descriptor.canonicalName, Descriptor);
}

export namespace Comment {
    export interface Data { 
        when?: Temporal._Date,
        text?: string
    };
    export type TypeParams = {
        Binding: { 
            comment: Objects.Binding<string|object>
        },
        Value: Data,
        Domain: Elevated.Domain<Data>
    }

    export const Descriptor = new class _Descriptor extends Properties.Descriptor<TypeParams> {
        canonicalName = `${__moduleName__}.Comment`
        build(builder: Properties.Builder<TypeParams>): void {
            builder.object('comment');
            builder.measure(new Elevated.Aggregate<Data>({
                when: Temporal.DateDomain,
                text: Values.TheStringDomain
            }));
            builder.example(() => ({
                when: Temporal.DateDomain.fromJSDate(faker.date.past()),
                text: faker.lorem.sentences()
            }))
            builder.scalar();
        }
    }();
    directory.descriptors.properties.set(Descriptor.canonicalName, Descriptor);
}
