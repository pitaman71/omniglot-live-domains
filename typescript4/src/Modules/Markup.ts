import faker from 'faker';
import * as Elevated from '@pitaman71/omniglot-introspect';

import { Definitions, Objects, Properties, Relations, Values } from '@pitaman71/omniglot-live-data';

import * as Domains from '../Domains';
import { __moduleName__ } from '../Domains/Temporal';

const moduleName = 'omniglot-live-data.Modules.Markup';

export const directory = new Definitions.Directory();

export namespace HasURL {
    export type TypeParams = {
        Binding: { the: Objects.Binding<string> },
        Value: Domains.Base.Parseable & Domains.Internet._URL,
        Domain: Elevated.Domain<Domains.Base.Parseable & Domains.Internet._URL>
    }
    export const Descriptor = new class _Descriptor extends Properties.Descriptor<TypeParams> {
        canonicalName = `${moduleName}.HasURL`
        build(builder: Properties.Builder<TypeParams>): void {
            builder.object('the');
            builder.measure(Domains.Internet.URLDomain);
            builder.scalar();
        }
    }
    directory.descriptors.properties.set(Descriptor.canonicalName, Descriptor);
}

export namespace HasKey {
    export type TypeParams = {
        Binding: { the: Objects.Binding<string> },
        Value: string,
        Domain: Elevated.Domain<string>
    }
    export const Descriptor = new class _Descriptor extends Properties.Descriptor<TypeParams> {
        canonicalName = `${moduleName}.HasKey`
        build(builder: Properties.Builder<TypeParams>): void {
            builder.object('the');
            builder.measure(Values.TheStringDomain);
            builder.example(() => faker.lorem.words(1));
            builder.scalar();
        }
    };
    directory.descriptors.properties.set(Descriptor.canonicalName, Descriptor);
} 

export namespace HasLabel {
    export type TypeParams = {
        Binding: { the: Objects.Binding<string> },
        Value: string,
        Domain: Elevated.Domain<string>
    }
    export const Descriptor = new class _Descriptor extends Properties.Descriptor<TypeParams> {
        canonicalName = `${moduleName}.HasLabel`
        build(builder: Properties.Builder<TypeParams>): void {
            builder.object('the');
            builder.measure(Values.TheStringDomain);
            builder.example(() => faker.lorem.words(Math.floor(Math.random() * 2) + 1));
            builder.scalar();
        }
    }
    directory.descriptors.properties.set(Descriptor.canonicalName, Descriptor);
} 

export namespace HasDescription {
    export type TypeParams = {
        Binding: { the: Objects.Binding<string> },
        Value: string,
        Domain: Elevated.Domain<string>
    }
    export const Descriptor = new class _Descriptor<BindingType extends { the: Objects.Binding<string> }> extends Properties.Descriptor<TypeParams> {
        canonicalName = `${moduleName}.HasDescription`
        build(builder: Properties.Builder<TypeParams>): void {
            builder.object('the');
            builder.measure(Values.TheStringDomain);
            builder.example(() => faker.lorem.paragraphs(2));
            builder.scalar();
        }
    }
    directory.descriptors.properties.set(Descriptor.canonicalName, Descriptor);
}

export namespace HasBody {
    export type TypeParams = {
        Binding: { the: Objects.Binding<string> },
        Value: string,
        Domain: Elevated.Domain<string>
    }
    export const Descriptor = new class _Descriptor extends Properties.Descriptor<TypeParams> {
        canonicalName = `${moduleName}.HasBody`
        build(builder: Properties.Builder<TypeParams>): void {
            builder.object('the');
            builder.measure(Values.TheStringDomain);
            builder.example(() => faker.lorem.words(Math.floor(Math.random() * 8) + 1));
            builder.scalar();
        }
    }
    directory.descriptors.properties.set(Descriptor.canonicalName, Descriptor);
} 

export namespace HasContents {
    interface BindingType extends Objects.BindingType { the: Objects.Binding<string>, contents: Objects.Binding<string> };
    export const Descriptor = new class _Descriptor extends Relations.Descriptor<BindingType> {
        canonicalName = `${moduleName}.HasContents`
        build(builder: Relations.Builder<BindingType>): void {
            builder.object('the');
            builder.scalar();
            builder.object('contents');
        }
    }
    directory.descriptors.relations.set(Descriptor.canonicalName, Descriptor);
} 

// export namespace ViewDocument {
//     interface BindingType extends Objects.BindingType { document: Objects.Binding<string> };
//     export const Descriptor = new class _Descriptor extends Views.Descriptor<BindingType> {
//         canonicalName = `${__moduleName__}.Document`
//         build(builder: Views.Builder<BindingType>) {
//             builder.begin();
//             builder.object('document');
//             builder.property(HasURL.Descriptor, (binding) => { return { the: binding.document } });
//             builder.property(HasLabel.Descriptor, (binding) => { return { the: binding.document } });
//             builder.property(HasDescription.Descriptor, (binding) => { return { the: binding.document } });
//             builder.property(HasBody.Descriptor, (binding) => { return { the: binding.document } });
//             builder.end();
//         }
//     }
// }

// export namespace ViewSection {
//     interface BindingType extends Objects.BindingType { section: Objects.Binding<string> };
//     const Descriptor = new class _Descriptor extends Views.Descriptor<BindingType> {
//         canonicalName = `${__moduleName__}.Section`
//         build(builder: Views.Builder<BindingType>) {
//             builder.begin();
//             builder.object('section');
//             builder.property(HasKey.Descriptor, (binding) => { return { the: binding.section } });
//             builder.property(HasLabel.Descriptor, (binding) => { return { the: binding.section } });
//             builder.property(HasDescription.Descriptor, (binding) => { return { the: binding.section } });    
//             builder.out(this, HasContents.Descriptor, (binding) => { return HasContents.Descriptor.bindAnchor({ the: binding.section }) });
//             builder.in(this, HasContents.Descriptor, (binding) => { return { section: binding.the } as BindingType });
//             builder.end();
//         }
//     }
// }

// export namespace ViewParagraph {
//     interface BindingType extends Objects.BindingType { paragraph: Objects.Binding<string> };
//     const Descriptor = new class _Descriptor extends Views.Descriptor<BindingType> {
//         canonicalName = `${__moduleName__}.Paragraph`
//         build(builder: Views.Builder<BindingType>) {
//             builder.begin();
//             builder.object('paragraph');
//             builder.property(HasKey.Descriptor, (binding) => { return { the: binding.paragraph } });
//             builder.out(this, HasContents.Descriptor, (binding) => { return HasContents.Descriptor.bindAnchor({ the: binding.paragraph }) });
//             builder.in(this, HasContents.Descriptor, (binding) => { return { paragraph: binding.the } as BindingType });
//             builder.end();
//         }
//     };
// }

// export namespace ViewText {
//     interface BindingType extends Objects.BindingType { text: Objects.Binding<string> };
//     export const Descriptor = new class _Descriptor extends Views.Descriptor<BindingType> {
//         canonicalName = `${__moduleName__}.Text`
//         build(builder: Views.Builder<BindingType>) {
//             builder.begin();
//             builder.object('text');
//             builder.property(HasBody.Descriptor, (binding) => { return { the: binding.text } });
//             builder.in(this, HasContents.Descriptor, (binding) => { return { text: binding.the } as BindingType });
//             builder.end();
//         }
//     };
// }
