import * as faker from 'faker';

import * as Elevated from '@pitaman71/omniglot-introspect';
import { Objects, Properties, Values } from '@pitaman71/omniglot-live-data';
import { StateDomain } from './Tasks';

const DirectionDomain = new Values.EnumerationDomain('unknown', 'invite', 'uninvite');

export const ConfigDomain = new Values.AggregateDomain({
    owner: Objects.BindingDomain,
    direction: DirectionDomain,
    person: Objects.BindingDomain,
    project: Objects.BindingDomain,
    queued: new Values.ArrayDomain(Objects.BindingDomain),
    done: new Values.ArrayDomain(Objects.BindingDomain)
}, ['person', 'project', 'queued', 'done']);

namespace HasState {
    export const Domain = new Values.ParseableDomain(StateDomain(ConfigDomain));
    const foo = Domain.asProperties().domain;
    export interface TypeParams extends Properties.TypeParams<any, any, Elevated.Domain<any>> {
        Binding: { task: Objects.Binding<string> },
        Value: Elevated.getValueType<typeof Domain>,
        Domain: typeof Domain
    }
    export const Descriptor = new class _Descriptor extends Properties.Descriptor<TypeParams> {
        canonicalName = 'Tasks.InviteAll.HasState';
        build(builder: Properties.Builder<TypeParams>): void {
            builder.object('task');
            builder.measure(Domain);
            builder.scalar();
        }
    };
}

describe('HasState.asJSON.from', () => {
    const input = {
        "config": {
            "owner": {
                "status": "bound",
                "objectId": "admins.persons.1"
            },
            "direction": "invite",
            "person": {
                "status": "bound",
                "objectId": "425a24ef-280a-4e62-8893-5709f1d5a1dd"
            }
        },
        "descriptor": {
            "nonce": "f9762dde-0292-4bd8-9907-14cd921b3db2",
            "session": "?",
            "principal": "425a24ef-280a-4e62-8893-5709f1d5a1dd"
        },
        "progress": {}
    };
    it('parses ConfigDomain from a string', () => {
        const domain = new Values.ParseableDomain(ConfigDomain);
        const asJSON = domain.asJSON();
        expect(asJSON).toBeTruthy();
        const result = asJSON.from(input.config, { onError: error => console.error(`Parsing JSON ${JSON.stringify(input.config)} causes ${JSON.stringify(error)}`) });
        expect(result).toBeTruthy();
        expect(result?.parsed).toBeTruthy();
        expect(result?.parsed?.owner).toBeTruthy();
        expect(result?.parsed?.direction).toBeTruthy();
        expect(result?.parsed?.person).toBeTruthy();
        expect(result?.parsed?.person?.objectId).toEqual("425a24ef-280a-4e62-8893-5709f1d5a1dd");
    });
    it('parses StateDomain from a string', () => {
        const result = HasState.Domain.asJSON()?.from(input);
        expect(result).toBeTruthy();
        expect(result?.parsed).toBeTruthy();
        expect(result?.parsed?.config).toBeTruthy();
        expect(result?.parsed?.config?.owner).toBeTruthy();
        expect(result?.parsed?.config?.direction).toBeTruthy();
        expect(result?.parsed?.config?.person).toBeTruthy();
        expect(result?.parsed?.config?.person?.objectId).toEqual("425a24ef-280a-4e62-8893-5709f1d5a1dd");
    });

})
